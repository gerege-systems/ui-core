# `@gerege/ui-core`

Gerege флотын **нийтлэг frontend давхарга** — API клиент, i18n, theme, session
болон дундын React компонентууд. Платформ бүр өөрийн `brand.config.ts`,
landing текст, route бүртгэлээ л эзэмшинэ.

Яагаад хэрэгтэйг [`UI_CORE_PLAN.md`](https://github.com/erdenebatt/vision-gerege-mn/blob/main/UI_CORE_PLAN.md)
дээр хэмжилттэй нь тайлбарласан: 9 платформын frontend-ийн ~93% нь мөр мөрөөрөө
ижил байсан.

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

Багц нь **git тэгээр** тарна — репо нь нээлттэй тул нэвтрэлт огт шаардахгүй:

```bash
npm install github:gerege-systems/ui-core#v0.1.0
```

`package.json`-д:

```json
"dependencies": {
  "@gerege/ui-core": "github:gerege-systems/ui-core#v0.1.0"
}
```

> **Яагаад GitHub Packages биш вэ.** `npm.pkg.github.com` нь НЭЭЛТТЭЙ багцад ч
> токен шаарддаг — тэгвэл хэрэглэгч репо бүрийн CI болон Dockerfile-д `.npmrc`
> + secret хэрэгтэй болно (9 репо × 2 газар). Нээлттэй git URL нь тэр бүхнийг
> шаардахгүй. `publish.yml` workflow нь registry рүү нийтлэх сонголтыг
> хэвээр үлдээсэн — хэрэв хожим хаалттай `@gerege/ui-gerege` гарвал хэрэгтэй.

Шинэчлэх: `package.json` дахь тэгийг солиод `npm install`.

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

<UiCoreProvider brandName={brand.name} landingCopy={landingCopy}>
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
