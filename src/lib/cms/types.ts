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

export type MusicPlatformLink = {
  label: string;
  url: string;
};

export type MusicTrackSample = {
  title: string;
  sampleAudioUrl?: string;
};

export type MusicWorkContent = {
  id: string;
  title: string;
  kind: LocalizedString;
  /** Cover / grid thumbnail (usually first gallery image). */
  image: string;
  /** Modal gallery; falls back to `[image]` when empty. */
  images?: string[];
  /** Short preview visitors can play on-site. */
  sampleAudioUrl?: string;
  /** Spotify, Apple Music, YouTube, Bandcamp, etc. */
  platformLinks?: MusicPlatformLink[];
  /** Optional track list with per-track samples. */
  tracks?: MusicTrackSample[];
  span?: string;
  year: string;
  emphasis: LocalizedString;
  description: LocalizedString;
  highlights: LocalizedString[];
};

export type HomeReelItem = {
  id: string;
  kind: "video" | "instagram";
  title: LocalizedString;
  /** Uploaded video URL or still/poster image. */
  mediaUrl: string;
  posterUrl?: string;
  /** Instagram / external post URL. */
  externalUrl?: string;
  published: boolean;
};

export type HomeStudioFeedContent = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  body: LocalizedString;
  items: HomeReelItem[];
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
  studioFeed: HomeStudioFeedContent;
  faq: HomeFaqContent;
};

export type AnnouncementKind =
  | "episode"
  | "song"
  | "drop"
  | "mixtape"
  | "general";

export type AnnouncementItem = {
  id: string;
  kind: AnnouncementKind;
  title: LocalizedString;
  excerpt: LocalizedString;
  body: LocalizedString;
  image: string;
  href?: string;
  published: boolean;
  pinned?: boolean;
  publishedAt: string;
};

export type AnnouncementsBundle = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  body: LocalizedString;
  items: AnnouncementItem[];
};
