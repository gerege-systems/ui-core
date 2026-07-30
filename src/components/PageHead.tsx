"use client";

import React from 'react';
import { useT } from '../lib/lang';
import type { DictKey } from '../lib/i18n';

/**
 * Орчуулагддаг хуудасны толгой — eyebrow / гарчиг / дэд тайлбар.
 *
 * Хоёр горим:
 *
 *   • `*Key` — БАГЦЫН толь бичгийн түлхүүр (флот дундын үг хэллэг).
 *   • `eyebrow` / `title` / `sub` — АЛЬ ХЭДИЙН орчуулсан мөр.
 *
 * Хоёр дахь нь платформын ӨӨРИЙН нэр томьёонд зориулагдсан. Жишээ нь
 * хөгжүүлэгчийн портал «API каталог», «Апп бүртгэл» гэх мэт зөвхөн өөрт нь
 * хамаатай үгтэй; тэдгээрийг флотын дундын толь руу хийвэл wallet, kiosk,
 * POS бүгд тэр үгсийг үүрэх болно. Иймд апп өөрийн жижиг толь бичгээ
 * (`useLang()`-ийн `lang`-аар) шийдээд бэлэн мөрөө өгнө.
 *
 * Хэрэв хоёулаа өгвөл бэлэн мөр давамгайлна.
 */
export default function PageHead({
  eyebrowKey, titleKey, subKey,
  eyebrow, title, sub,
}: {
  eyebrowKey?: DictKey;
  titleKey?: DictKey;
  subKey?: DictKey;
  eyebrow?: string;
  title?: string;
  sub?: string;
}) {
  const { T } = useT();
  const eyebrowText = eyebrow ?? (eyebrowKey ? T(eyebrowKey) : '');
  const titleText = title ?? (titleKey ? T(titleKey) : '');
  const subText = sub ?? (subKey ? T(subKey) : '');
  return (
    <div className="page-head">
      <span className="page-head__eyebrow">{eyebrowText}</span>
      <h1>{titleText}</h1>
      {subText && <p className="page-head__sub">{subText}</p>}
    </div>
  );
}
