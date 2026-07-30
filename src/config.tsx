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
import type { DictKey, Lang } from './lib/i18n';
import type { LandingCopy } from './types';

export interface UiCoreConfig {
  /** Брэндийн нэр — толгой мөр, хөл хэсэг, logo-ийн alt текст. */
  brandName: string;
  /** Багцлагдсан landing текстийн суурь утга (ThemeEditor-т л хэрэгтэй). */
  /**
   * Багцлагдсан landing текстийн суурь утга (ThemeEditor-т л хэрэгтэй).
   *
   * ХЭСЭГЧЛЭН: landing текст нь платформын өмч бөгөөд ихэвчлэн интерфэйсээс
   * ЦӨӨН хэлтэй байдаг (маркетингийн текст орчуулах нь тусдаа ажил). Иймд
   * долоон хэлийг бүгдийг шаардахгүй — байхгүй хэлийг ThemeEditor алгасана.
   */
  landingCopy?: Partial<Record<Lang, LandingCopy>>;
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
  /**
   * Апп ҮНЭХЭЭР үйлчилдэг хуудсууд — зүүн цэс үүгээр шүүгдэнэ.
   *
   * Цэсний бүтэц багцад байдаг ч платформ бүр түүний ДЭД олонлогийг л
   * хэрэгжүүлдэг: хэтэвч нь gateway, бүртгэлийн модульгүй. Өгөөгүй бол
   * шүүлт хийхгүй (бүх зүйл харагдана) — бүх модулиа хэрэгжүүлсэн платформ
   * (template, sso) юу ч тохируулах шаардлагагүй.
   *
   * Яг тэнцүү эсвэл сегментийн зааг дээрх угтвар л таарна: '/me/eid' нь
   * '/me/eid/id'-г нээнэ, '/me/eidfoo'-г нээхгүй.
   */
  navRoutes?: readonly string[];
  /**
   * Зөвхөн ЭНЭ платформд байдаг цэсний зүйл (ring-ийн BPM модулиуд г.м.).
   *
   * ⚠️ **CLIENT компонентоос дамжуулна.** `icon` нь React component, `label`
   * нь функц тул server→client хилээр гарахгүй (React шууд алдаа өгнө).
   * Root layout нь server component байдаг учир апп өөрийн нимгэн client
   * бүрхүүл үүсгэж, түүн дотроос дамжуулна:
   *
   * ```tsx
   * // src/nav.config.tsx
   * 'use client';
   * import { Workflow } from 'lucide-react';
   * import { UiCoreProvider } from '@gerege/ui-core';
   *
   * const NAV_EXTRA = [{ system: 'admin', subsystem: 'group.bpm',
   *   href: '/admin/workflow', icon: Workflow, label: (l) => ringT(l, 'nav.wf') }];
   *
   * export default function AppNav({ children }) {
   *   return <UiCoreProvider navExtra={NAV_EXTRA}>{children}</UiCoreProvider>;
   * }
   * ```
   *
   * Provider-ууд үүрлэж болдог тул root layout нь `brandName` г.м.-ээ өгөөд,
   * энэ бүрхүүл зөвхөн `navExtra`-г нэмнэ.
   *
   * Цөөн зүйл нэмэхэд багцын цэсэнд `optIn: true`-тэй оруулах нь ч болно
   * (`/me/wallet` шиг) — тэр нь дундын нэр томьёо байвал илүү зохимжтой.
   */
  navExtra?: readonly NavExtra[];

  /**
   * Rail дээрх системийн нэрийг дарж бичих (`'me'` → `'sys.wallet'` г.м.).
   *
   * Ижил бүтэцтэй ч платформ өөрөө нэрлэдэг: template-д «Хэрэглэгч», хэтэвчид
   * «Хэтэвч».
   */
  navSystemLabels?: Readonly<Record<string, DictKey>>;
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
  navRoutes,
  navExtra,
  navSystemLabels,
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
      navRoutes: navRoutes ?? parent.navRoutes,
      navExtra: navExtra ?? parent.navExtra,
      navSystemLabels: navSystemLabels ?? parent.navSystemLabels,
    }),
    [brandName, landingCopy, docsUrl, helpUrl, docsLangs, navRoutes, navExtra,
     navSystemLabels,
     parent.brandName, parent.landingCopy, parent.docsUrl, parent.helpUrl,
     parent.docsLangs, parent.navRoutes, parent.navExtra, parent.navSystemLabels],
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
export function useLandingCopy(): Partial<Record<Lang, LandingCopy>> {
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
/**
 * Платформын өөрийн цэсний зүйл.
 *
 * Нэрийг ХОЁР аргаар өгч болно:
 *   `labelKey` — дундын толийн түлхүүр (`@gerege/ui-core/lib/i18n`);
 *   `label`    — аппын өөрийн толиос шийдэх функц (BPM г.м. нэр томьёо
 *                дундын толинд байх ёсгүй — тэр нь бүх платформыг үүрүүлнэ).
 * Хоёулаа өгвөл `label` давамгайлна.
 */
interface NavExtraBase {
  /** Аль систем (rail) — 'superadmin' | 'admin' | 'manager' | 'me'. */
  system: string;
  /** Аль дэд бүлэг. Тэр нэртэй бүлэг байхгүй бол шинээр эхэнд үүснэ. */
  subsystem: DictKey;
  /** Шинэ дэд бүлэг үүсэх үед түүний нэрийг аппын толиос авах бол. */
  subsystemLabel?: (lang: string) => string;
  /** Энэ href-ийн ӨМНӨ оруулна. Өгөөгүй/олдоогүй бол бүлгийн төгсгөлд. */
  before?: string;
  href: string;
  /** lucide-react дүрс. */
  icon: React.ComponentType<{ size?: number | string; strokeWidth?: number }>;
  /** Шаардагдах эрх; өгөөгүй бол бүх нэвтэрсэн хэрэглэгчид. */
  perm?: string;
  superAdminOnly?: boolean;
}

// Нэрийг ЗААВАЛ нэг аргаар өгнө — хоёулааг мартвал хөрвүүлэлтийн үед барина
// (эс бөгөөс цэс хоосон шошготой зурагдана).
export type NavExtra = NavExtraBase &
  (
    | { labelKey: DictKey; label?: never }
    | { label: (lang: string) => string; labelKey?: never }
  );

/** Цэсний тохиргоо — AppShell дуудна. */
export function useNavConfig(): Pick<UiCoreConfig, 'navRoutes' | 'navExtra' | 'navSystemLabels'> {
  const c = useContext(Ctx);
  return { navRoutes: c.navRoutes, navExtra: c.navExtra, navSystemLabels: c.navSystemLabels };
}
