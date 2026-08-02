import 'server-only';
import { backendFetch } from './api';

// Нэвтрэх гадаргууны горим — платформ өөрөө нэвтрүүлэх үү, дээд SSO руу
// шилжүүлэх үү. Backend-ийн AUTH_MODE (open-gerege-core) нь ганц эх сурвалж:
// frontend-д давхардсан env БАЙХГҮЙ, боот үед `GET /site/auth`-аас уншина.
//
// Энэ нь платформ ӨӨРӨӨ OIDC issuer эсэхээс (OAUTH_ISSUER) тусдаа тэнхлэг —
// хоёулаа зэрэг байж болно (гинжин SSO: өөрөө бусдыг нэвтрүүлдэг, гэхдээ
// хэрэглэгчээ дээд IdP-д илгээдэг).

export type AuthMode = 'provider' | 'client';

export interface SiteAuth {
  /** provider — нэвтрэх карт нүүрэн дээр; client — дээд SSO руу шилжүүлнэ. */
  mode: AuthMode;
  /** client горимд дээд IdP-ийн issuer (тухайн платформын SSO_ISSUER). */
  ssoIssuer?: string;
  /** Энэ платформ өөрөө OIDC issuer мөн эсэх. */
  provider: boolean;
}

// Backend хүрэхгүй үед сонгох горим. `provider` нь хэрэглэгчийг платформ дээрээ
// үлдээнэ; `client` руу уначихвал зочдыг огт хамааралгүй IdP руу шилжүүлэх тул
// илүү буруу. Аль ч тохиолдолд backend унтарсан бол нэвтрэлт ажиллахгүй —
// сонголт нь зөвхөн «хуудас юу харуулах» асуудал.
const FALLBACK: SiteAuth = { mode: 'provider', provider: false };

/**
 * GET /site/auth — нийтийн (auth-гүй). Landing болон /login-ийн SSR-д дуудна.
 * Алдаа гарвал FALLBACK — хуудас хэзээ ч унахгүй.
 */
export async function fetchAuthMode(): Promise<SiteAuth> {
  const r = await backendFetch<{ mode?: string; sso_issuer?: string; provider?: boolean }>(
    '/site/auth',
    { method: 'GET' },
  );
  if (!r.ok || !r.data) return FALLBACK;
  const mode: AuthMode = r.data.mode === 'client' ? 'client' : 'provider';
  return {
    mode,
    ssoIssuer: typeof r.data.sso_issuer === 'string' ? r.data.sso_issuer : undefined,
    provider: r.data.provider === true,
  };
}

/**
 * Нэвтрэх товчийн зорилго.
 *
 *   provider → `providerHref` (анхдагч '#login')
 *   client   → '/api/auth/sso/start' (BFF нь дээд IdP-ийн authorize руу түлхнэ)
 *
 * `providerHref` яагаад параметр вэ: landing хуудас нэвтрэх картыг hero дотроо
 * ШИГТГЭСЭН бол '#login' анкер зөв (тэр карт руу гүйлгэнэ). Харин карт
 * шигтгээгүй landing дээр '#login' нь ХООСОН анкер — товч юу ч хийхгүй. Тийм
 * платформ '/login' гэж дамжуулна.
 */
export function loginHref(auth: SiteAuth, next?: string, providerHref = '#login'): string {
  if (auth.mode === 'provider') return providerHref;
  const q = next && next !== '/' ? `?next=${encodeURIComponent(next)}` : '';
  return `/api/auth/sso/start${q}`;
}

/**
 * Дээд IdP-ийн хүнд харагдах нэр — issuer-ийн host (жишээ 'sso.gerege.mn').
 * Хатуу бичсэн брэндийн нэрийг («Gerege SSO») орлоно: платформ бүр өөрийн
 * SSO_ISSUER-тэй тул нэг код бүгдэд тохирно. Issuer байхгүй бол null.
 */
export function ssoHostName(auth: SiteAuth): string | null {
  if (!auth.ssoIssuer) return null;
  try {
    return new URL(auth.ssoIssuer).host;
  } catch {
    return null;
  }
}
