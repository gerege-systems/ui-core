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
}

const Ctx = createContext<UiCoreConfig>({ brandName: '' });

export function UiCoreProvider({
  brandName,
  landingCopy,
  children,
}: UiCoreConfig & { children: React.ReactNode }) {
  const value = useMemo(() => ({ brandName, landingCopy }), [brandName, landingCopy]);
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
