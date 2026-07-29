"use client";

// AUTH_MODE=client горимын нэвтрэх карт — платформ өөрөө нэвтрүүлэхгүй, дээд
// SSO (SSO_ISSUER) руу шилжүүлнэ. `LoginForm`-ийн байрыг эзэлнэ (мөн
// `.signin-card` дотор байрлана) тул нүүр хуудас, /login хоёулаа ижилхэн
// хэрэглэнэ.
//
// IdP-ийн нэрийг ЭНД ХАТУУ БИЧИХГҮЙ: issuer-ийн host-ыг backend-ээс ирсэн
// утгаас гаргаж харуулна (`ssoHostName`). Ингэснээр нэг код флотын бүх
// платформд — sso.gerege.mn, sso.dgov.mn, аль ч — тохирно.

import React from 'react';
import { LogIn } from 'lucide-react';
import Alert from './Alert';
import { useT } from '../lib/lang';

export default function SsoSignin({
  href,
  hostName,
  failed,
}: {
  /** Нэвтрэлт эхлүүлэх зам — ихэвчлэн /api/auth/sso/start?next=… */
  href: string;
  /** Дээд IdP-ийн host (жишээ 'sso.gerege.mn'). Мэдэгдэхгүй бол харуулахгүй. */
  hostName?: string | null;
  /** SSO callback амжилтгүй болж ?error=sso-тэй буцаж ирсэн эсэх. */
  failed?: boolean;
}) {
  const { T } = useT();

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      <div>
        <h1 id="login-title" style={{ margin: '0 0 0.4rem' }}>{T('auth.sso.title')}</h1>
        <p style={{ margin: 0, opacity: 0.7 }}>{T('auth.sso.lede')}</p>
      </div>

      {failed && <Alert kind="danger">{T('auth.sso.failed')}</Alert>}

      <a
        className="btn btn--eid btn--lg btn--block"
        href={href}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <LogIn size={18} strokeWidth={2} />
        <span>{T('auth.sso.button')}</span>
      </a>

      {hostName && (
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>{hostName}</p>
      )}
    </div>
  );
}
