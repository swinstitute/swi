import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

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
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
};

/**
 * POST /api/upload - Secure admin image upload to ImgBB CDN
 */
export async function POST(req: NextRequest) {
  // 1. Verify admin session
  const cookieStore = await cookies();
  const token = cookieStore.get('sw_admin_auth_token')?.value;

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  // 2. Fetch server-side API Key
  const apiKey = process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY || '07afc547f88e09e5ced81621fd89ddea';

  if (!apiKey) {
    return NextResponse.json({ error: 'ImgBB API key is not configured on server' }, { status: 500 });
  }

  try {
    const incomingFormData = await req.formData();
    const image = incomingFormData.get('image');

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append('key', apiKey);

    if (typeof image === 'string') {
      const cleanBase64 = image.replace(/^data:image\/[a-z]+;base64,/, '');
      imgbbFormData.append('image', cleanBase64);
    } else {
      imgbbFormData.append('image', image);
    }

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbFormData,
    });

    const data = await response.json();

    if (data && data.success) {
      return NextResponse.json({
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url || data.data.url,
        deleteUrl: data.data.delete_url,
      });
    } else {
      return NextResponse.json(
        { success: false, error: data?.error?.message || 'Failed to upload to ImgBB' },
        { status: 502 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server network error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
