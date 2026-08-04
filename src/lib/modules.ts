// Модулийн төлвийн клиент талын хэрэгслүүд (V4.0 Modular Platform).
//
// СЕМАНТИК — FAIL-OPEN: жагсаалт ачаалагдаагүй эсвэл алдаатай үед модулийг
// ИДЭВХТЭЙ гэж үзнэ. Аюулгүй байдлын хил нь backend-ийн route gate (идэвхгүй
// модулийн API 404 буцаана); UI-ийн нуулт нь зөвхөн UX. Fail-closed бол
// backend түр хүрэхгүй болоход бүх цэс алга болно — тэр нь илүү муу.
'use client';

import { useQuery } from '@tanstack/react-query';

/** Нэг модулийн нийтийн төлөв (backend /v1/platform/modules-ийн хэлбэр). */
export interface ModuleStatus {
  id: string;
  kind: 'core' | 'business';
  enabled: boolean;
  /** Модулийн эзэмшдэг UI зам (backend манифестээс). */
  ui_prefixes?: string[];
}

/** Модулиудын төлвийг татна (60с staleTime — nav бүрт дахин татахгүй). */
export function useModules() {
  return useQuery<ModuleStatus[]>({
    queryKey: ['platform', 'modules'],
    staleTime: 60_000,
    queryFn: async () => {
      const res = await fetch('/api/platform/modules', { cache: 'no-store' });
      if (!res.ok) return [];
      const body = (await res.json()) as { data?: ModuleStatus[] };
      return body.data ?? [];
    },
  });
}

/**
 * Тухайн модуль идэвхтэй эсэх. Жагсаалт хоосон/ачаалагдаагүй бол true
 * (fail-open — дээрх тайлбарыг үз).
 */
export function useModuleEnabled(id: string): boolean {
  const { data } = useModules();
  if (!data || data.length === 0) return true;
  const mod = data.find((m) => m.id === id);
  return mod ? mod.enabled : true;
}

/**
 * Замын эзэн модулийг ХАМГИЙН УРТ угтвараар олно — backend-ийн route
 * gate-тэй ижил дүрэм. Үүрлэсэн угтвар зөв ажиллана: '/me/eid/' нь
 * eidproxy-д, '/me/eid/sign' нь sign-д харьяалагдана.
 */
export function moduleForPath(modules: ModuleStatus[] | undefined, href: string): ModuleStatus | null {
  if (!modules || modules.length === 0) return null;
  let best: ModuleStatus | null = null;
  let bestLen = -1;
  for (const m of modules) {
    for (const p of m.ui_prefixes ?? []) {
      const match = href === p || href.startsWith(p) || href.startsWith(p + '/');
      if (match && p.length > bestLen) {
        best = m;
        bestLen = p.length;
      }
    }
  }
  return best;
}

/**
 * Тухайн UI зам харагдах эсэх. Эзэн модуль олдоогүй бол ХАРАГДАНА
 * (fail-open) — эзэнгүй зам нь ямар ч модульд харьяалагдахгүй core
 * гадаргуу байж болно.
 */
export function usePathEnabled(href: string): boolean {
  const { data } = useModules();
  const owner = moduleForPath(data, href);
  return owner ? owner.enabled : true;
}
