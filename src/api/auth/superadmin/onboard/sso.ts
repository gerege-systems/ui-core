import { backendFetch } from '../../../../lib/api';
import { checkOrigin, proxyResult, readJson } from '../../../../lib/bff';

export const dynamic = 'force-dynamic';

// POST /api/auth/superadmin/onboard/sso — онбординг эхний алхмын SSO хувилбар.
// Wizard-аас ирсэн SSO code-ийг backend руу дамжуулж onboard_token авна.
//
// redirect_uri-г ЗААВАЛ дамжуулна: OAuth нь token хүсэлтийн redirect_uri нь
// authorize үеийнхтэй яг таарахыг шаарддаг. Онбординг нь өөрийн callback-аар
// эхэлдэг тул SSO client-ийн өгөгдмөл URI (ердийн /sso/callback) таарахгүй.
// Урилгын хаалга backend талд — тиймээс НЭВТРЭЭГҮЙ.
export async function POST(req: Request) {
  const bad = checkOrigin(req);
  if (bad) return bad;

  const origin = process.env.APP_ORIGIN ?? new URL(req.url).origin;
  const { code } = await readJson<{ code?: string }>(req);
  const redirect_uri = `${origin}/api/auth/superadmin/onboard/sso/callback`;

  return proxyResult(
    await backendFetch('/auth/superadmin/onboard/sso', {
      method: 'POST',
      body: JSON.stringify({ code, redirect_uri }),
    }),
  );
}
