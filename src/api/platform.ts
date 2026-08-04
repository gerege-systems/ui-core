import { backendFetch } from '../lib/api';
import { proxyResult } from '../lib/bff';

export const dynamic = 'force-dynamic';

// GET /api/platform/modules — модулиудын нийтийн төлөв (V4.0 Modular
// Platform). Нэвтрэлт шаардахгүй: nav/dashboard нь нэвтрэхээс өмнө ч
// зурагддаг бөгөөд backend тал нь мөн нийтийн endpoint.
//
// Хариу: { id, kind, enabled }[] — хамаарал, route зэрэг дотоод мэдээлэл
// ЗОРИУД задлагддаггүй (тандалт багасгана); дэлгэрэнгүйг админы endpoint өгнө.
export async function GET() {
  return proxyResult(await backendFetch('/platform/modules', { method: 'GET' }));
}
