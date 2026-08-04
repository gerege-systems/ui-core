import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cookieOptions } from '../../../../../lib/cookies';

export const dynamic = 'force-dynamic';

// GET /api/auth/superadmin/onboard/sso/start — онбординг ТӨВИЙН SSO руу redirect.
//
// ЯАГААД GOOGLE БИШ: Google-ийн шууд урсгал платформ бүрээс өөрийн redirect URI
// илгээдэг тул шинэ платформ бүрд Google Console-д мөр нэмэхийг шаарддаг. SSO нь
// тэр бүртгэлийг НЭГ газар төвлөрүүлдэг ба платформ бүрийн SSO redirect URI аль
// хэдийн бүртгэгдсэн байдаг.
//
// state cookie нь Google урсгалынхаас ТУСДАА (sa_onboard_sso_state) — хоёр
// урсгал зэрэг эхэлсэн ч бие биенийхээ state-ыг дарж бичихгүй.
export async function GET(req: Request) {
  const issuer = process.env.SSO_ISSUER;
  const clientId = process.env.SSO_CLIENT_ID;
  const origin = process.env.APP_ORIGIN ?? new URL(req.url).origin;
  if (!issuer || !clientId) {
    return NextResponse.redirect(`${origin}/superadmin/onboard?gerror=sso_disabled`);
  }

  const state = crypto.randomUUID();
  const jar = await cookies();
  jar.set('sa_onboard_sso_state', state, { ...cookieOptions(600), maxAge: 600 }); // 10 мин

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/superadmin/onboard/sso/callback`,
    response_type: 'code',
    scope: process.env.SSO_SCOPE ?? 'openid profile email',
    state,
    prompt: 'login',
  });
  return NextResponse.redirect(`${issuer.replace(/\/$/, '')}/oauth2/auth?${params.toString()}`);
}
