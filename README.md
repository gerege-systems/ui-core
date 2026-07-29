# `@gerege/ui-core`

Gerege флотын **нийтлэг frontend давхарга** — API клиент, i18n, theme, session
болон дундын React компонентууд. Платформ бүр өөрийн `brand.config.ts`,
landing текст, route бүртгэлээ л эзэмшинэ.

Яагаад хэрэгтэйг [`UI_CORE_PLAN.md`](https://github.com/erdenebatt/vision-gerege-mn/blob/main/UI_CORE_PLAN.md)
дээр хэмжилттэй нь тайлбарласан: 9 платформын frontend-ийн ~93% нь мөр мөрөөрөө
ижил байсан.

## 🧬 Удамшлын гинж

Энэ репо флотын удамшлын мод дотор дараах байрлалтай:

```
@gerege/ui-core               ← ЭНЭ РЕПО (npm tarball)
   └─► public/private template · template-dgov-mn · gov ба gerege апп-ууд (9 репо)
```

**Механизм:** npm (HTTPS tarball) — git fork биш. Шинэчлэлт нэг мөрийн хувилбар солилтоор тарна, тиймээс merge conflict үүсэхгүй.

---

## Топологи

```
@gerege/ui-core   (нээлттэй)  ←  gov урсгал + доорх бүгд
        │  npm dependency
        ▼
   платформ бүрийн frontend  (brand.config.ts + landing/copy.ts + app/**/page.tsx)
```

Цөмийн (`public-gerege-core` → `private-gerege-core`) загварыг давтана. Gerege-д
л хэрэгтэй UI гарвал тэр үед `@gerege/ui-gerege` нэмнэ — өмнө нь биш.

## Суулгах

Багц нь **тэгийн HTTPS tarball-аар** тарна — репо нээлттэй тул нэвтрэлт
шаардахгүй:

```json
"dependencies": {
  "@gerege/ui-core": "https://github.com/gerege-systems/ui-core/archive/refs/tags/v0.1.0.tar.gz"
}
```

> **Яагаад `github:gerege-systems/ui-core#v0.1.0` биш вэ.** npm нь `github:`
> хэлбэрийг `git clone`-оор шийддэг тул хостод `git` binary хэрэгтэй.
> `node:20-alpine` дотор git байдаггүй — Docker build `npm error syscall spawn
> git`-ээр унана (туршиж батлав). HTTPS tarball нь зөвхөн сүлжээ шаардана,
> мөн `package-lock.json`-д жинхэнэ `integrity` hash үлдээнэ.

> **Яагаад GitHub Packages биш вэ** (UI_CORE_PLAN.md-д анх түүнийг төлөвлөсөн):
>
> 1. `npm.pkg.github.com` нь scope-ыг байгууллагын нэртэй ЯГ таарахыг шаарддаг.
>    `@gerege` ≠ `gerege-systems` тул нийтлэх оролдлого `403 permission_denied`
>    өгнө. Багцыг `@gerege-systems/ui-core` болгож нэрлэвэл л боломжтой.
> 2. Түүнчлэн registry нь НЭЭЛТТЭЙ багцад ч токен шаарддаг — репо бүрийн CI ба
>    Dockerfile-д `.npmrc` + secret хэрэгтэй болно (9 репо × 2 газар).
>
> Нээлттэй git URL нь хоёуланг нь шаардахгүй, Docker build дотор ч ажиллана.

Шинэчлэх: URL доторх тэгийг солиод `npm install`.

`next.config.mjs`-д **заавал**:

```js
const nextConfig = {
  transpilePackages: ['@gerege/ui-core'],  // багц нь TypeScript эх кодоор тарна
};
```

Root layout-д нэг удаа:

```tsx
import { UiCoreProvider } from '@gerege/ui-core';
import { brand } from '@/brand.config';
import { landingCopy } from '@/components/landing/copy';

<UiCoreProvider
  brandName={brand.name}
  docsUrl={brand.docsUrl}      // хэрэглэгчийн цэсэнд «Баримт бичиг» гарна
  landingCopy={landingCopy}
>
  {children}
</UiCoreProvider>
```

## Импортлох

Дэд зам (subpath)-аар шууд — barrel-аар биш:

```tsx
import AppShell from '@gerege/ui-core/components/AppShell';
import ProfileView from '@gerege/ui-core/components/me/ProfileView';
import { api } from '@gerege/ui-core/lib/api';
import { useLang } from '@gerege/ui-core/lib/lang';
```

> Компонентуудын ихэнх нь `'use client'` тул нэг barrel-д цуглуулбал серверийн
> хуудсууд ч бүхэлд нь client bundle-д татагдана. Иймд root гарц (`.`) нь зөвхөн
> `UiCoreProvider` ба төрлүүдийг гаргадаг.

## Хил хязгаар — юу энд байх ёсгүй вэ

| Багцад | Аппад |
|---|---|
| `lib/**` — api, bff, i18n, theme, session, pki … | `brand.config.ts` |
| `components/**` — shell, admin, me, gov, registry, relay … | `components/landing/**` (брэндийн текст + холбоос) |
| `types.ts` — `LandingCopy` **бүтэц** | `landing/copy.ts` — тэр бүтцийн **агуулга** |
| | `app/**/page.tsx`, `app/globals.css`, `app/manifest.ts` |

Хоёр зүйлийг апп **заавал** нийлүүлнэ:

1. **CSS** — багц нь `className` ашиглана, харин стиль нь аппын
   `app/globals.css`-д. Багц CSS агуулаагүй нь зориуд: брэндийн өнгөний токен
   платформ бүрд өөр.
2. **`UiCoreProvider`** — брэндийн нэр, landing текстийн суурь утга.

## Хөгжүүлэх

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # vitest run
```

## BFF route-ууд (`app/api/**`)

158 BFF route-ийн **логик** нь багцад (`src/api/**`). Next.js нь route-ыг
файлын системээр бүртгэдэг тул апп нь зам бүрд нэг мөрийн бүрхүүл үлдээнэ:

```ts
// src/app/api/gov/overview/route.ts
export { GET, dynamic } from '@gerege/ui-core/api/gov/overview';
```

Динамик сегмент мөн ажиллана — багц дотор файлын нэр нь хаалтаа хэвээр авна:

```ts
// src/app/api/org/[id]/route.ts
export { GET, PUT, DELETE, dynamic } from '@gerege/ui-core/api/org/[id]';
```

**Бүрхүүлийг яагаад үлдээв.** Route-ын жагсаалт нь аюулгүй байдлын
**зөвшөөрлийн жагсаалт** — хөтчөөс backend-ийн аль зам хүрч болохыг тодорхойлно.
Ганц `[...path]` catch-all болгож 158 файлыг 1 болгож болох ч тэр нь тэрхүү
жагсаалтыг устгаж, backend-ийн БҮХ зам руу проксиг нээнэ. Иймд бүрхүүл нь
зориудын үнэ — файл бүр 1 мөр, логик нь багцад ганц хувь.

> `export const dynamic`-ыг **заавал дахин экспортлоно**. Next.js нь route-ын
> тохиргоог модулийн export-оос уншдаг тул орхивол route чимээгүйгээр
> `force-dynamic`-аа алдана (туршиж батлав: `force-static`-ыг дахин
> экспортлоход `○`, орхиход `ƒ`).
