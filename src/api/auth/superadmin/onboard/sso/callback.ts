import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// GET /api/auth/superadmin/onboard/sso/callback — SSO-гийн хүлээн авагч.
// state-ийг cookie-той тулгаж (CSRF), ТҮҮХИЙ code-ийг wizard руу (?ssocode=)
// буцаана. Токен exchange-ийг backend (POST /auth/superadmin/onboard/sso) хийнэ.
//
// Google-ийн `?code=`-ээс ЯЛГААТАЙ параметр ашиглана: wizard аль IdP-ээс
// ирснийг мэдэх ёстой — эс бөгөөс SSO-гийн code-ыг Google endpoint руу
// илгээж, ойлгомжгүй алдаа гарна.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = process.env.APP_ORIGIN ?? url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const jar = await cookies();
  const savedState = jar.get('sa_onboard_sso_state')?.value;
  jar.delete('sa_onboard_sso_state');

  if (url.searchParams.get('error') || !code) {
    return NextResponse.redirect(`${origin}/superadmin/onboard?gerror=sso_cancelled`);
  }
  if (!state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${origin}/superadmin/onboard?gerror=state_mismatch`);
  }

  return NextResponse.redirect(`${origin}/superadmin/onboard?ssocode=${encodeURIComponent(code)}`);
}
