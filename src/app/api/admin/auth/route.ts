import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Secret key used to sign the admin session token
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'sw-institute-secure-session-salt-2026-bhilai-key-v1';

// Expected admin password from environment variable
const getAdminPassword = () => {
  return process.env.SW_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'SW@Bhilai2026!SecureStudio';
};

const createToken = (payload: string): string => {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
};

const verifyToken = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payloadB64, signature] = parts;
    const payload = Buffer.from(payloadB64, 'base64url').toString();
    const data = JSON.parse(payload);

    // Check expiry (valid for 7 days)
    if (!data.exp || Date.now() > data.exp) return false;

    // Verify HMAC signature with timing-safe comparison
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
};

/**
 * GET /api/admin/auth - Check active session
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sw_admin_auth_token')?.value;

  if (token && verifyToken(token)) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

/**
 * POST /api/admin/auth - Login with admin password
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const expected = getAdminPassword();

    // Constant-time comparison to prevent timing attacks
    const passwordBuffer = Buffer.from(password.trim());
    const expectedBuffer = Buffer.from(expected.trim());

    const isMatch =
      passwordBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(passwordBuffer, expectedBuffer);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // Create session valid for 7 days
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const sessionPayload = JSON.stringify({ role: 'admin', exp });
    const token = createToken(sessionPayload);

    const cookieStore = await cookies();
    cookieStore.set('sw_admin_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({ success: true, message: 'Authentication successful' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/auth - Logout
 */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('sw_admin_auth_token');
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
