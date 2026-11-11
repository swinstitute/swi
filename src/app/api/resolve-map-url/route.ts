import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import {
  isAllowedGoogleShortHost,
  isAllowedMapEmbedHost,
  isGoogleMapsShortUrl,
  isSafeHttpUrl,
} from '@/lib/map-utils';

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'sw-institute-secure-session-salt-2026-bhilai-key-v1';

const verifyToken = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payloadB64, signature] = parts;
    const payload = Buffer.from(payloadB64, 'base64url').toString();
    const data = JSON.parse(payload);
    if (!data.exp || Date.now() > data.exp) return false;
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    if (signature.length !== expectedSignature.length) return false;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
};

const isAllowedHopHost = (hostname: string): boolean => {
  const host = hostname.toLowerCase();
  return (
    isAllowedGoogleShortHost(host) ||
    isAllowedMapEmbedHost(host) ||
    host === 'consent.google.com' ||
    /^consent\.google\.[a-z.]{2,12}$/.test(host)
  );
};

const extractContinueUrl = (urlObj: URL): string | null => {
  const cont = urlObj.searchParams.get('continue');
  if (cont && isSafeHttpUrl(cont)) {
    try {
      const parsed = new URL(cont);
      if (isAllowedMapEmbedHost(parsed.hostname)) {
        return parsed.toString();
      }
    } catch {}
  }
  return null;
};

/**
 * POST /api/resolve-map-url - Safely expands Google Maps share shortlinks for verified admins
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('sw_admin_auth_token')?.value;

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const rawUrl = typeof body?.url === 'string' ? body.url.trim() : '';

    if (!rawUrl || rawUrl.length > 2048 || !isGoogleMapsShortUrl(rawUrl)) {
      return NextResponse.json(
        { error: 'Please provide a valid Google Maps share shortlink (maps.app.goo.gl, goo.gl/maps, or g.page).' },
        { status: 400 }
      );
    }

    let currentUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const maxHops = 6;

    for (let hop = 0; hop < maxHops; hop++) {
      const parsedCurrent = new URL(currentUrl);
      if (!isAllowedHopHost(parsedCurrent.hostname)) {
        return NextResponse.json(
          { error: 'Redirect target left trusted Google domains.' },
          { status: 400 }
        );
      }

      if (parsedCurrent.hostname.startsWith('consent.google.')) {
        const cont = extractContinueUrl(parsedCurrent);
        if (cont) {
          currentUrl = cont;
          break;
        }
      }

      // Already landed on a full Google Maps URL (either /maps/... or maps.google.<tld>/?...)
      const isRootMapsHost = /^maps\.google\.[a-z.]{2,12}$/i.test(parsedCurrent.hostname);
      if (
        isAllowedMapEmbedHost(parsedCurrent.hostname) &&
        (parsedCurrent.pathname.toLowerCase().includes('/maps') || isRootMapsHost)
      ) {
        break;
      }

      const response = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        cache: 'no-store',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(6000),
      });

      const locationHeader = response.headers.get('location');
      if (locationHeader && response.status >= 300 && response.status < 400) {
        const nextUrl = new URL(locationHeader, currentUrl);
        if (!isSafeHttpUrl(nextUrl.toString()) || !isAllowedHopHost(nextUrl.hostname)) {
          return NextResponse.json(
            { error: 'Shortlink redirected to an unsupported domain.' },
            { status: 400 }
          );
        }
        currentUrl = nextUrl.toString();
        continue;
      }

      // Some shortlinks return HTML with meta-refresh or canonical Google Maps link
      if (response.ok) {
        const rawHtml = (await response.text()).slice(0, 24000);
        const normalizedHtml = rawHtml
          .replace(/\\\//g, '/')
          .replace(/\\u0026/gi, '&')
          .replace(/&amp;/gi, '&');
        const mapUrlMatch = normalizedHtml.match(
          /https:\/\/(?:www\.|maps\.)?google\.[a-z.]{2,12}\/maps(?:\/|\?)[^\s"'<>]+/i
        );
        if (mapUrlMatch && isSafeHttpUrl(mapUrlMatch[0])) {
          currentUrl = mapUrlMatch[0];
        }
      }
      break;
    }

    const finalParsed = new URL(currentUrl);
    if (!isAllowedMapEmbedHost(finalParsed.hostname)) {
      return NextResponse.json(
        { error: 'Could not resolve this shortlink to a Google Maps location. Please copy the full URL from your browser address bar.' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      resolvedUrl: finalParsed.toString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to resolve short Google Maps URL';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
