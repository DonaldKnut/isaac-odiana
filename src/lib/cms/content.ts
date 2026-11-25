import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  defaultHomepage,
  defaultMusicPage,
  defaultMusicWorks,
  defaultSiteSettings,
} from "@/lib/cms/defaults";
import type {
  HomepageBundle,
  MusicPageContent,
  MusicWorkContent,
  SiteSettings,
} from "@/lib/cms/types";

export const CMS_KEYS = {
  homepage: "homepage",
  musicWorks: "music.works",
  musicPage: "music.page",
  settings: "site.settings",
} as const;

function asObject<T>(value: unknown, fallback: T): T {
  if (!value || typeof value !== "object") return fallback;
  return value as T;
}

export async function getHomepageContent(): Promise<HomepageBundle> {
  const row = await prisma.siteContent.findUnique({
    where: { key: CMS_KEYS.homepage },
  });
  const value = asObject(row?.value, defaultHomepage);
  // Migrate older featured-array shape if present.
  if (Array.isArray((value as { featured?: unknown }).featured)) {
    return {
      ...defaultHomepage,
      ...value,
      featured: {
        ...defaultHomepage.featured,
        items: (value as unknown as { featured: HomepageBundle["featured"]["items"] })
          .featured,
      },
    };
  }
  return {
    ...defaultHomepage,
    ...value,
    featured: {
      ...defaultHomepage.featured,
      ...(value.featured || {}),
      items: value.featured?.items?.length
        ? value.featured.items
        : defaultHomepage.featured.items,
    },
    hero: { ...defaultHomepage.hero, ...value.hero },
    about: {
      ...defaultHomepage.about,
      ...value.about,
      pillars: value.about?.pillars?.length
        ? value.about.pillars
        : defaultHomepage.about.pillars,
    },
    world: {
      ...defaultHomepage.world,
      ...value.world,
      rooms: value.world?.rooms?.length
        ? value.world.rooms
        : defaultHomepage.world.rooms,
    },
    faq: {
      ...defaultHomepage.faq,
      ...value.faq,
      items: value.faq?.items?.length
        ? value.faq.items
        : defaultHomepage.faq.items,
    },
  };
}

function normalizeMusicWork(work: MusicWorkContent): MusicWorkContent {
  const images =
    work.images?.filter(Boolean).length
      ? work.images.filter(Boolean)
      : work.image
        ? [work.image]
        : [];
  return {
    ...work,
    image: images[0] || work.image || "",
    images,
  };
}

export async function getMusicWorksContent(): Promise<MusicWorkContent[]> {
  const row = await prisma.siteContent.findUnique({
    where: { key: CMS_KEYS.musicWorks },
  });
  const value = row?.value;
  const works = Array.isArray(value)
    ? (value as MusicWorkContent[])
    : defaultMusicWorks;
  return works.map((work) => {
    const hasGallery = Array.isArray(work.images) && work.images.length > 0;
    if (!hasGallery) {
      const fallback = defaultMusicWorks.find((item) => item.id === work.id);
      if (fallback?.images?.length) {
        return normalizeMusicWork({ ...work, images: fallback.images });
      }
    }
    return normalizeMusicWork(work);
  });
}

export async function saveMusicWorksContent(value: MusicWorkContent[]) {
  const normalized = value.map(normalizeMusicWork);
  await prisma.siteContent.upsert({
    where: { key: CMS_KEYS.musicWorks },
    create: {
      key: CMS_KEYS.musicWorks,
      value: normalized as unknown as Prisma.InputJsonValue,
    },
    update: {
      value: normalized as unknown as Prisma.InputJsonValue,
    },
  });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await prisma.siteContent.findUnique({
    where: { key: CMS_KEYS.settings },
  });
  return asObject(row?.value, defaultSiteSettings);
}

export async function getMusicPageContent(): Promise<MusicPageContent> {
  const row = await prisma.siteContent.findUnique({
    where: { key: CMS_KEYS.musicPage },
  });
  const value = asObject(row?.value, defaultMusicPage);
  return {
    listening: {
      ...defaultMusicPage.listening,
      ...(value.listening || {}),
      images: value.listening?.images?.length
        ? value.listening.images
        : defaultMusicPage.listening.images,
      eyebrow: {
        ...defaultMusicPage.listening.eyebrow,
        ...(value.listening?.eyebrow || {}),
      },
      title: {
        ...defaultMusicPage.listening.title,
        ...(value.listening?.title || {}),
      },
    },
  };
}

export async function saveHomepageContent(value: HomepageBundle) {
  const json = value as unknown as Prisma.InputJsonValue;
  await prisma.siteContent.upsert({
    where: { key: CMS_KEYS.homepage },
    update: { value: json },
    create: { key: CMS_KEYS.homepage, value: json },
  });
}

export async function saveSiteSettings(value: SiteSettings) {
  const json = value as unknown as Prisma.InputJsonValue;
  await prisma.siteContent.upsert({
    where: { key: CMS_KEYS.settings },
    update: { value: json },
    create: { key: CMS_KEYS.settings, value: json },
  });
}

export async function saveMusicPageContent(value: MusicPageContent) {
  const json = value as unknown as Prisma.InputJsonValue;
  await prisma.siteContent.upsert({
    where: { key: CMS_KEYS.musicPage },
    update: { value: json },
    create: { key: CMS_KEYS.musicPage, value: json },
  });
}

export async function ensureCmsDefaults() {
  await Promise.all([
    prisma.siteContent.upsert({
      where: { key: CMS_KEYS.homepage },
      update: {},
      create: {
        key: CMS_KEYS.homepage,
        value: defaultHomepage as unknown as Prisma.InputJsonValue,
      },
    }),
    prisma.siteContent.upsert({
      where: { key: CMS_KEYS.musicWorks },
      update: {},
      create: {
        key: CMS_KEYS.musicWorks,
        value: defaultMusicWorks as unknown as Prisma.InputJsonValue,
      },
    }),
    prisma.siteContent.upsert({
      where: { key: CMS_KEYS.musicPage },
      update: {},
      create: {
        key: CMS_KEYS.musicPage,
        value: defaultMusicPage as unknown as Prisma.InputJsonValue,
      },
    }),
    prisma.siteContent.upsert({
      where: { key: CMS_KEYS.settings },
      update: {},
      create: {
        key: CMS_KEYS.settings,
        value: defaultSiteSettings as unknown as Prisma.InputJsonValue,
      },
    }),
  ]);
}
