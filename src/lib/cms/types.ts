export type Locale = "en" | "fr";

export type LocalizedString = { en: string; fr: string };

export function pickLocale(value: LocalizedString, locale: Locale) {
  return value[locale] || value.en;
}

export type HomeHeroContent = {
  eyebrow: LocalizedString;
  titleLine1: LocalizedString;
  titleLine2: LocalizedString;
  description: LocalizedString;
  primaryCta: LocalizedString;
  primaryHref: string;
  secondaryCta: LocalizedString;
  secondaryHref: string;
};

export type HomeFeaturedItem = {
  href: string;
  label: LocalizedString;
  title: LocalizedString;
  image: string;
};

export type HomeFeaturedContent = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  items: HomeFeaturedItem[];
};

export type HomeAboutContent = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  body: LocalizedString;
  cta: LocalizedString;
  ctaHref: string;
  image: string;
  imageCaption: LocalizedString;
  pillars: Array<{
    number: string;
    title: LocalizedString;
    copy: LocalizedString;
  }>;
};

export type HomeWorldContent = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  body: LocalizedString;
  sideImage: string;
  rooms: Array<{
    href: string;
    title: LocalizedString;
    copy: LocalizedString;
    image: string;
  }>;
};

export type HomeFaqContent = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  body: LocalizedString;
  sideImage: string;
  sideCaption: LocalizedString;
  items: Array<{
    question: LocalizedString;
    answer: LocalizedString;
  }>;
};

export type MusicWorkContent = {
  id: string;
  title: string;
  kind: LocalizedString;
  /** Cover / grid thumbnail (usually first gallery image). */
  image: string;
  /** Modal gallery; falls back to `[image]` when empty. */
  images?: string[];
  span?: string;
  year: string;
  emphasis: LocalizedString;
  description: LocalizedString;
  highlights: LocalizedString[];
};

export type SiteSettings = {
  whatsappNumber: string;
  whatsappMessage: LocalizedString;
  brandTagline: LocalizedString;
};

export type MusicPageContent = {
  listening: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    images: string[];
  };
};

export type HomepageBundle = {
  hero: HomeHeroContent;
  featured: HomeFeaturedContent;
  about: HomeAboutContent;
  world: HomeWorldContent;
  faq: HomeFaqContent;
};
