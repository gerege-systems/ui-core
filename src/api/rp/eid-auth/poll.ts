// POST /api/rp/eid-auth/poll — RP-ийн eID нэвтрэлт (§lib/rpEidAuth).
import { proxyEidAuth } from '../../../lib/rpEidAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  return proxyEidAuth(req, 'poll');
}
