// Gerege Systems Development Team болон Claude AI хамтран бүтээв, 2026.

import { describe, it, expect } from 'vitest';
import { moduleForPath, type ModuleStatus } from '../lib/modules';

const mods: ModuleStatus[] = [
  { id: 'eidproxy', kind: 'business', enabled: true, ui_prefixes: ['/me/eid/'] },
  { id: 'sign', kind: 'business', enabled: false, ui_prefixes: ['/me/eid/sign'] },
  { id: 'gov', kind: 'business', enabled: true, ui_prefixes: ['/me/services/', '/me/applications/'] },
];

describe('moduleForPath', () => {
  it('хамгийн урт угтвар ялна (үүрлэсэн зам)', () => {
    // /me/eid/sign нь ХОЁУЛАНД нь таарна; илүү тодорхой нь ялах ёстой,
    // эс бөгөөс sign-ийг унтраахад гарын үсгийн цэс нуугдахгүй.
    expect(moduleForPath(mods, '/me/eid/sign')?.id).toBe('sign');
    expect(moduleForPath(mods, '/me/eid/certificates')?.id).toBe('eidproxy');
  });

  it('нэг модулийн олон угтварыг дэмжинэ', () => {
    expect(moduleForPath(mods, '/me/services/list')?.id).toBe('gov');
    expect(moduleForPath(mods, '/me/applications/')?.id).toBe('gov');
  });

  it('эзэнгүй зам null буцаана (fail-open дуудагч талд)', () => {
    expect(moduleForPath(mods, '/me/organizations')).toBeNull();
  });

  it('жагсаалт байхгүй бол null (fail-open)', () => {
    expect(moduleForPath(undefined, '/me/eid/sign')).toBeNull();
    expect(moduleForPath([], '/me/eid/sign')).toBeNull();
  });

  it('хэсэгчилсэн сегментийн худал таарц үүсгэхгүй', () => {
    // '/me/eidfoo' нь '/me/eid/'-д таарах ЁСГҮЙ.
    expect(moduleForPath(mods, '/me/eidfoo')).toBeNull();
  });
});
