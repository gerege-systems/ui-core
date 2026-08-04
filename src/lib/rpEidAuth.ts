import 'server-only';
// eID нэвтрэлтийн RP proxy-ийн хуваалцсан хэрэгжилт.
//
// Энэ платформ SSO-ийн үүрэг гүйцэтгэж байгаа үед бүртгэлтэй апп (RP)-ууд
// eID нэвтрэлтийг <sso>/api/rp/eid-auth/{start,start-id,poll}-оор дуудна →
// backend /api/v1/eid-auth/{...}. Backend нь аппын OAuth токеныг (svc:eid-auth
// эрхтэй client_credentials) шалгаад, ӨӨРИЙН eID RP креденшлээр session-ыг
// эхлүүлж/төлвийг буцаана.
//
// ЯАГААД ТҮҮХИЙ ДАМЖУУЛАЛТ: дуудагч нь browser биш, өөр платформын сервер
// (pkg/ssoeidauth). Тиймээс:
//   · дугтуйг ЗАДЛАХГҮЙ — Go client `{data:…}`-ыг өөрөө уншина,
//   · статусыг ӨӨРЧЛӨХГҮЙ — 401/403/503 нь клиентийн шийдвэрт чухал,
//   · cookie/session ХЭРЭГЛЭХГҮЙ — танилт нь зөвхөн Authorization толгой,
//   · checkOrigin ХЭРЭГГҮЙ — cookie-д тулгуурладаггүй тул CSRF өртөг алга.
import { BACKEND_BASE, clientIPHeaders } from './api';

/** Хүсэлтийн биеийн дээд хэмжээ — энгийн JSON тул бага. */
const MAX_BODY_BYTES = 4096;

/** eID нэвтрэлтийн нэг үйлдлийг backend руу түүхийгээр дамжуулна. */
export async function proxyEidAuth(req: Request, action: 'start' | 'start-id' | 'poll'): Promise<Response> {
  const auth = req.headers.get('authorization') ?? '';
  if (!auth.toLowerCase().startsWith('bearer ')) {
    return Response.json({ status: false, message: 'missing bearer token' }, { status: 401 });
  }

  const body = await req.text();
  if (body.length > MAX_BODY_BYTES) {
    return Response.json({ status: false, message: 'body too large' }, { status: 413 });
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_BASE}/eid-auth/${action}`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: auth,
        ...(await clientIPHeaders()),
      },
      body: body || '{}',
    });
  } catch {
    return Response.json({ status: false, message: 'backend unreachable' }, { status: 503 });
  }

  // Статус + биеийг хэвээр нь буцаана (дугтуйг задлахгүй).
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') ?? 'application/json' },
  });
}
