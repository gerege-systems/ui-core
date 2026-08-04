import { NextResponse } from 'next/server';
import { authedFetch } from '../../../lib/api';
import { proxyResult, checkOrigin, readJson } from '../../../lib/bff';

export const dynamic = 'force-dynamic';

// PUT /api/admin/platform/module/[id] — модуль асаах/унтраах.
// Дүрмүүд (core унтрахгүй, хамаарлын дараалал) backend дээр мөрдөгдөнө;
// BFF нь зөвхөн хэлбэрийг шалгаж дамжуулна.
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const bad = checkOrigin(req);
  if (bad) return bad;
  const { id } = await ctx.params;
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(id)) {
    return NextResponse.json({ ok: false, status: 400, message: 'Модулийн ID буруу байна.' }, { status: 400 });
  }
  const { enabled } = await readJson<{ enabled?: unknown }>(req);
  if (typeof enabled !== 'boolean') {
    return NextResponse.json({ ok: false, status: 400, message: 'enabled нь boolean байх ёстой.' }, { status: 400 });
  }
  return proxyResult(
    await authedFetch(`/platform/admin/modules/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    }),
  );
}
