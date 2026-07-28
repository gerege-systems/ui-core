// Апп → багц руу тохиргоо дамжуулах ганц суваг.
//
// `@gerege/ui-core` нь аль ч платформын `brand.config.ts`, `copy.ts`-ыг
// импортлож БОЛОХГҮЙ — тэдгээр нь аппын өмч, платформ бүрд өөр. Гэвч цөөн
// компонент тэр өгөгдлийг харуулах шаардлагатай:
//
//   • брэндийн нэр  → AppShell, SigninShell, HomeView, ThemeEditor
//   • landing текст → ThemeEditor (theme засварлагчийн суурь утга + preview)
//
// Тиймээс апп нь root layout дотроо нэг удаа өгнө:
//
//     'use client' хэрэггүй — Provider өөрөө client component:
//     import { UiCoreProvider } from '@gerege/ui-core';
//     import { brand } from '@/brand.config';
//     import { landingCopy } from '@/components/landing/copy';
//
//     <UiCoreProvider brandName={brand.name} landingCopy={landingCopy}>
//       {children}
//     </UiCoreProvider>

'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Lang } from './lib/i18n';
import type { LandingCopy } from './types';

export interface UiCoreConfig {
  /** Брэндийн нэр — толгой мөр, хөл хэсэг, logo-ийн alt текст. */
  brandName: string;
  /** Багцлагдсан landing текстийн суурь утга (ThemeEditor-т л хэрэгтэй). */
  landingCopy?: Record<Lang, LandingCopy>;
  /**
   * Баримтын сайтын хаяг (`brand.config.ts`-ийн `docsUrl`). Өгвөл хэрэглэгчийн
   * цэсэнд «Баримт бичиг» холбоос гарна; өгөөгүй бол огт харагдахгүй.
   */
  docsUrl?: string;
  /** Тусламжийн хуудас. Өгөөгүй бол `https://dgov.mn/help`. */
  helpUrl?: string;
  /**
   * Баримтын сайт БОДИТООР ямар хэлтэй вэ. Эхнийх нь үндсэн локал —
   * түүнд угтвар нэмэхгүй, бусдад `<base>/<code>/`. Жагсаалтад байхгүй хэлээр
   * UI байвал хоёр дахь хэл рүү (ихэвчлэн англи) уналт хийнэ.
   *
   * Анхдагч `['mn', 'en']` — флотын ихэнх баримтын сайт хоёр хэлтэй. POS шиг
   * дөрвөн хэлтэй сайт `['mn','en','zh','ru']` гэж өгнө.
   */
  docsLangs?: readonly string[];
}

const DEFAULT_DOCS_LANGS = ['mn', 'en'] as const;

const Ctx = createContext<UiCoreConfig>({ brandName: '' });

/**
 * Provider-ууд ҮҮРЛЭЖ болно: доод давхарга нь өгсөн талбараа л дарж, бусдыг
 * дээдээсээ өвлөнө. Ингэснээр root layout нь `brandName`-ээ нэг удаа өгөөд,
 * зөвхөн ThemeEditor-той хуудас нь `landingCopy`-г нэмж өгнө — 460 мөр текст
 * бүх хуудасны client bundle-д орохгүй.
 */
export function UiCoreProvider({
  brandName,
  landingCopy,
  docsUrl,
  helpUrl,
  docsLangs,
  children,
}: Partial<UiCoreConfig> & { children: React.ReactNode }) {
  const parent = useContext(Ctx);
  const value = useMemo(
    () => ({
      brandName: brandName ?? parent.brandName,
      landingCopy: landingCopy ?? parent.landingCopy,
      docsUrl: docsUrl ?? parent.docsUrl,
      helpUrl: helpUrl ?? parent.helpUrl,
      docsLangs: docsLangs ?? parent.docsLangs,
    }),
    [brandName, landingCopy, docsUrl, helpUrl, docsLangs,
     parent.brandName, parent.landingCopy, parent.docsUrl, parent.helpUrl,
     parent.docsLangs],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Брэндийн нэр. Provider тавиагүй бол хоосон мөр — компонент унахгүй. */
export function useBrandName(): string {
  return useContext(Ctx).brandName;
}

/**
 * Landing текстийн суурь утга. Өгөөгүй бол ойлгомжтой алдаа шиднэ — чимээгүй
 * хоосон preview харуулахаас дээр.
 */
export function useLandingCopy(): Record<Lang, LandingCopy> {
  const copy = useContext(Ctx).landingCopy;
  if (!copy) {
    throw new Error(
      '@gerege/ui-core: <UiCoreProvider landingCopy={…}> өгөөгүй байна. ' +
        'ThemeEditor нь аппын landing текстийн суурь утгыг шаардана.',
    );
  }
  return copy;
}

/**
 * Интерфэйсийн хэлд тохирсон баримтын хаяг.
 *
 * Баримтын сайт нь UI-аас цөөн хэлтэй байж болно (ихэнх нь монгол + англи).
 * Тиймээс жагсаалтад байхгүй хэлээр UI ажиллаж байвал хоёр дахь хэл рүү
 * уналт хийнэ — mkdocs-static-i18n нь орчуулагдаагүй хуудсыг эхээр нөхдөг
 * тул 404 гарахгүй.
 *
 * `docsUrl` өгөөгүй бол `null` — дуудагч тал холбоосыг огт харуулахгүй.
 */
export function useDocsUrl(lang: string): string | null {
  const { docsUrl: base, docsLangs = DEFAULT_DOCS_LANGS } = useContext(Ctx);
  if (!base) return null;
  const root = base.endsWith('/') ? base : `${base}/`;
  const [primary, fallback = 'en'] = docsLangs;
  if (lang === primary) return root;
  return `${root}${docsLangs.includes(lang) ? lang : fallback}/`;
}

/** Тусламжийн хуудас. Өгөөгүй бол флотын анхдагч. */
export function useHelpUrl(): string {
  return useContext(Ctx).helpUrl ?? 'https://dgov.mn/help';
}
