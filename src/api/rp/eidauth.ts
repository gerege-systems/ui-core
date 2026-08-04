// eID нэвтрэлтийн RP proxy — БАЙГУУЛЛАГА ХООРОНДЫН (server→server) дамжуулагч.
//
// Энэ платформ SSO-ийн үүрэг гүйцэтгэж байгаа үед бүртгэлтэй апп (RP)-ууд
// eID нэвтрэлтийг үүгээр дуудна: <sso>/api/rp/eid-auth/{start,start-id,poll}
// → backend /api/v1/eid-auth/{...}. Backend нь аппын OAuth токеныг (svc:eid-auth
// эрхтэй client_credentials) шалгаад, ӨӨРИЙН eID RP креденшлээр session-ыг
// эхлүүлж/төлвийг буцаана.
//
// ЯАГААД ТҮҮХИЙ ДАМЖУУЛАЛТ: дуудагч нь browser биш, өөр платформын сервер
// (pkg/ssoeidauth). Тиймээс:
//   · дугтуйг ЗАДЛАХГҮЙ — Go client `{data:…}`-ыг өөрөө уншина,
//   · статусыг ӨӨРЧЛӨХГҮЙ — 401/403/503 нь клиентийн шийдвэрт чухал,
//   · cookie/session ХЭРЭГЛЭХГҮЙ — танилт нь зөвхөн Authorization толгой,
//   · checkOrigin ХЭРЭГГҮЙ — cookie-д тулгуурладаггүй тул CSRF өртөг алга.
import { BACKEND_BASE, clientIPHeaders } from '../../lib/api';

/** Зөвшөөрөгдсөн үйлдлүүд — дурын зам backend руу нэвтрэхээс сэргийлнэ. */
const ACTIONS = new Set(['start', 'start-id', 'poll']);

/** Хүсэлтийн биеийн дээд хэмжээ — энгийн JSON тул бага. */
const MAX_BODY_BYTES = 4096;

/**
 * POST /api/rp/eid-auth/[action] — RP-ийн eID нэвтрэлтийн дуудлагыг backend руу
 * түүхийгээр дамжуулна. `action` нь Next-ийн dynamic сегментээс ирнэ.
 */
export async function proxyEidAuth(req: Request, action: string): Promise<Response> {
  if (!ACTIONS.has(action)) {
    return Response.json({ status: false, message: 'unknown action' }, { status: 404 });
  }

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
