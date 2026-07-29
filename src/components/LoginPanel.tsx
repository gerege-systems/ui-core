// Нэвтрэх гадаргууны ГАНЦ цэг — backend-ийн AUTH_MODE-оос хамааран
// `LoginForm` (платформ өөрөө нэвтрүүлнэ) эсвэл `SsoSignin` (дээд SSO руу
// шилжүүлнэ) гэсэн хоёрын нэгийг үзүүлнэ.
//
// Энэ бол SERVER компонент — зориуд. Горим нь `fetchAuthMode()`-оор backend-ээс
// ирдэг ба тэр нь `server-only` (lib/api) тул сонголтыг серверт хийхээс өөр
// аргагүй. Дүрслэгдээгүй салаа нь client талд ажиллахгүй, hydrate хийгдэхгүй.
//
// АНХААР — bundle хэмнэлт БИШ. Next нь энэ файлын статик импортыг route-ын
// client module manifest-д оруулдаг тул `LoginForm`-ийн chunk (~12KB) нь client
// горимын хуудсанд ч preload-д үлдэнэ (бодитоор хэмжиж баталсан). Хэрэв тэр нь
// чухал болвол салаа тус бүрийг тусдаа route/`next/dynamic` руу гаргах хэрэгтэй.
//
// Хэрэглээ:
//
//   // app/login/page.tsx (server)
//   const auth = await fetchAuthMode();
//   <SigninShell>
//     <section className="signin-card">
//       <LoginPanel auth={auth} next={next} ssoFailed={sp.error === 'sso'} />
//     </section>
//   </SigninShell>

import React from 'react';
import LoginForm from './LoginForm';
import SsoSignin from './SsoSignin';
import { loginHref, ssoHostName, type SiteAuth } from '../lib/authMode';

export interface LoginPanelProps {
  /** `fetchAuthMode()`-ийн үр дүн. Дуудагч тал нэг л удаа татаж дамжуулна. */
  auth: SiteAuth;
  /** Нэвтэрсний дараа буцах зам. */
  next: string;
  // --- provider горимд LoginForm руу дамжина ---
  notice?: string;
  googleLink?: boolean;
  googleError?: boolean;
  mfaGate?: boolean;
  /** РД талбарт автоматаар фокус тавих эсэх (landing дээр false — §LoginForm). */
  autoFocus?: boolean;
  // --- client горимд ---
  /** SSO callback амжилтгүй болж ?error=sso-тэй буцаж ирсэн эсэх. */
  ssoFailed?: boolean;
}

export default function LoginPanel({
  auth,
  next,
  notice,
  googleLink,
  googleError,
  mfaGate,
  autoFocus,
  ssoFailed,
}: LoginPanelProps) {
  if (auth.mode === 'client') {
    return (
      <SsoSignin
        href={loginHref(auth, next)}
        hostName={ssoHostName(auth)}
        failed={ssoFailed}
      />
    );
  }

  return (
    <LoginForm
      next={next}
      notice={notice}
      googleLink={googleLink}
      googleError={googleError}
      mfaGate={mfaGate}
      autoFocus={autoFocus}
    />
  );
}
