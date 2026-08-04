import { NextResponse } from 'next/server';
import { authedFetch } from '../../../lib/api';
import { proxyResult, checkOrigin, readJson } from '../../../lib/bff';

export const dynamic = 'force-dynamic';

// GET /api/admin/platform/modules — модулиудын дэлгэрэнгүй төлөв (нэр,
// хамаарал, route). Backend талдаа админаар хамгаалагдсан.
export async function GET() {
  return proxyResult(await authedFetch('/platform/admin/modules', { method: 'GET' }));
}
