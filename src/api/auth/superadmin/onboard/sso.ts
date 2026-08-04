import { backendFetch } from '../../../../lib/api';
import { checkOrigin, proxyResult, readJson } from '../../../../lib/bff';

export const dynamic = 'force-dynamic';

// POST /api/auth/superadmin/onboard/sso — онбординг эхний алхмын SSO хувилбар.
// Wizard-аас ирсэн SSO code-ийг backend руу дамжуулж onboard_token авна.
//
// Google-ийнхээс ЯЛГААТАЙ нь redirect_uri дамжуулахгүй: SSO client өөрийн
// тохируулсан URI-гаа хэрэглэдэг тул түүнийг гаднаас хүлээж авах нь илүүц
// (мөн аюулгүй биш). Урилгын хаалга backend талд — тиймээс НЭВТРЭЭГҮЙ.
export async function POST(req: Request) {
  const bad = checkOrigin(req);
  if (bad) return bad;

  const { code } = await readJson<{ code?: string }>(req);

  return proxyResult(
    await backendFetch('/auth/superadmin/onboard/sso', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
  );
}
