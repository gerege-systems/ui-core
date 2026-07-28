// Багцын үндсэн (root) гарц — ЗӨВХӨН аппаас өгөх тохиргоо ба хуваалцсан төрөл.
//
// Компонент, lib модулиудыг энд re-export ХИЙХГҮЙ: тэдгээрийн ихэнх нь
// `'use client'` тул нэг barrel-д цуглуулбал сервер талын хуудсууд ч бүхэлд нь
// client bundle-д татагдана. Оронд нь дэд зам (subpath)-аар шууд импортлоно:
//
//     import AppShell from '@gerege/ui-core/components/AppShell';
//     import { api }  from '@gerege/ui-core/lib/api';

export { UiCoreProvider, useBrandName, useLandingCopy } from './config';
export type { UiCoreConfig } from './config';
export type { LandingCopy } from './types';
