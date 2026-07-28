// Апп ↔ багц хоорондын хуваалцсан ТӨРЛҮҮД.
//
// `LandingCopy` нь landing хуудасны текстийн БҮТЭЦ. Бүтэц нь дундын (бүх
// платформ ижил хэсэгтэй) боловч АГУУЛГА нь платформ тус бүрийнх — тиймээс
// агуулга (`landingCopy`, `landingCopyFor`) нь аппын
// `src/components/landing/copy.ts`-д үлдэж, зөвхөн энэ төрлийг эндээс авна.
//
// `LangCode` нь `lib/i18n.ts`-д зарлагдсан тул энд давхардуулаагүй.

export interface LandingCopy {
  /** Брэнд нэр (nav + footer). Хоосон бол BrandProvider-ийн нэр. Theme-ээр солино. */
  brand?: string;
  nav: { features: string; security: string; tech: string; docs: string; login: string };
  hero: {
    badge: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    lede: string;
    ctaLogin: string;
    ctaExplore: string;
    stackLabel: string;
    stats: { value: string; label: string }[];
  };
  advantages: {
    heading: string;
    sub: string;
    eidTag: string;
    eidTitle: string;
    eidBody: string;
    googleTitle: string;
    googleBody: string;
    secTitle: string;
    secBody: string;
    ssoTitle: string;
    ssoBody: string;
    signTitle: string;
    signBody: string;
    consentTitle: string;
    consentBody: string;
  };
  tech: {
    heading: string;
    sub: string;
    backendTitle: string;
    backendBody: string;
    frontendTitle: string;
    frontendBody: string;
    aiTitle: string;
    aiBody: string;
    trustTitle: string;
    trustBadge: string;
    trustItems: string[];
  };
  everything: { heading: string; sub: string; items: { title: string; body: string }[] };
  cta: { title: string; sub: string; ctaLogin: string; ctaExplore: string; tagline: string };
  footer: { tagline: string; links: string[]; copyright: string };
  /** Нүүрийн баруун доод буланд хөвөх AI туслахын виджет (нэвтрэлтгүй). */
  chat: {
    /** Хөвөгч товчны tooltip / aria-label. */
    open: string;
    close: string;
    title: string;
    /** Гарчгийн доорх тайлбар — нэвтрэлтгүй гэдгийг ойлгуулна. */
    sub: string;
    /** Чат хоосон үеийн урилга. */
    greeting: string;
    placeholder: string;
    send: string;
    thinking: string;
    error: string;
    /** Хувийн мэдээлэл бүү бич — нээлттэй суваг гэдгийн сануулга. */
    privacy: string;
    /** Санал болгох эхний асуултууд. */
    suggestions: string[];
    /** Push-to-talk: товчийг дарж барихыг заасан tooltip. */
    hold: string;
    /** Бичиж байх үеийн төлөв. */
    recording: string;
    /** Бичиж байх үед доод мөрөнд гарах заавар. */
    recordingHint: string;
    /** Дуут мессежийн бөмбөлөгт харагдах текст. */
    voiceMsg: string;
    /** Хариултыг сонсох товчны шошго. */
    listen: string;
    /** Микрофон боломжгүй үеийн алдаа. */
    micError: string;
    /** Микрофоны зөвшөөрөл татгалзсан үеийн алдаа. */
    micDenied: string;
    /** Зөвшөөрөл өгсний дараах зөвлөмж (эхний даралт бичлэг болоогүй үед). */
    micReady: string;
    /** Хэт богино даралт — санамсаргүй товшилт. */
    tooShort: string;
    /** Яриа таниагүй (чимээгүй бичлэг). */
    noSpeech: string;
    /** Дуут хувилбар бэлдэж чадаагүй үеийн алдаа. */
    ttsError: string;
  };
}
