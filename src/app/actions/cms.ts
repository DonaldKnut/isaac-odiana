"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import {
  ensureCmsDefaults,
  getHomepageContent,
  saveAnnouncementsContent,
  saveHomepageContent,
  saveMusicPageContent,
  saveMusicWorksContent,
  saveSiteSettings,
} from "@/lib/cms/content";
import type {
  AnnouncementsBundle,
  HomepageBundle,
  MusicPageContent,
  MusicWorkContent,
  SiteSettings,
} from "@/lib/cms/types";
import { tServer } from "@/lib/i18n/server";

/** Stable targets for inline image edits on the live site. */
export type HomepageImageTarget =
  | { kind: "world.side" }
  | { kind: "world.room"; index: number }
  | { kind: "featured.item"; index: number }
  | { kind: "about.image" }
  | { kind: "faq.side" };

export type CmsActionState = {
  ok: boolean;
  message: string;
};

export async function seedCmsDefaultsAction(): Promise<CmsActionState> {
  await requireAdmin();
  const t = await tServer();
  await ensureCmsDefaults();
  revalidatePath("/");
  revalidatePath("/music");
  revalidatePath("/announcements");
  revalidatePath("/admin/content");
  revalidatePath("/admin/announcements");
  return { ok: true, message: t.messages.defaultsSeeded };
}

export async function saveHomepageAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  await requireAdmin();
  const t = await tServer();
  try {
    const raw = String(formData.get("payload") || "");
    const value = JSON.parse(raw) as HomepageBundle;
    await saveHomepageContent(value);
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { ok: true, message: t.messages.homepageSaved };
  } catch {
    return { ok: false, message: t.messages.homepageSaveFailed };
  }
}

export async function saveMusicWorksAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  await requireAdmin();
  const t = await tServer();
  try {
    const raw = String(formData.get("payload") || "");
    const value = JSON.parse(raw) as MusicWorkContent[];
    await saveMusicWorksContent(value);
    revalidatePath("/music");
    revalidatePath("/admin/content");
    return { ok: true, message: t.messages.musicSaved };
  } catch {
    return { ok: false, message: t.messages.musicSaveFailed };
  }
}

export async function saveSiteSettingsAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  await requireAdmin();
  const t = await tServer();
  try {
    const raw = String(formData.get("payload") || "");
    const value = JSON.parse(raw) as SiteSettings;
    const digits = value.whatsappNumber.replace(/\D/g, "");
    await saveSiteSettings({
      ...value,
      whatsappNumber: digits || "33758544042",
    });
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { ok: true, message: t.messages.settingsSaved };
  } catch {
    return { ok: false, message: t.messages.settingsSaveFailed };
  }
}

export async function saveMusicPageAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  await requireAdmin();
  const t = await tServer();
  try {
    const raw = String(formData.get("payload") || "");
    const value = JSON.parse(raw) as MusicPageContent;
    await saveMusicPageContent(value);
    revalidatePath("/music");
    revalidatePath("/admin/content");
    return { ok: true, message: t.messages.musicSaved };
  } catch {
    return { ok: false, message: t.messages.musicSaveFailed };
  }
}

export async function saveAnnouncementsAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  await requireAdmin();
  const t = await tServer();
  try {
    const raw = String(formData.get("payload") || "");
    const value = JSON.parse(raw) as AnnouncementsBundle;
    await saveAnnouncementsContent(value);
    revalidatePath("/");
    revalidatePath("/announcements");
    revalidatePath("/admin/announcements");
    revalidatePath("/admin/content");
    return { ok: true, message: t.messages.announcementsSaved };
  } catch {
    return { ok: false, message: t.messages.announcementsSaveFailed };
  }
}

export async function updateHomepageImageAction(input: {
  target: HomepageImageTarget;
  url: string;
}): Promise<CmsActionState> {
  await requireAdmin();
  const t = await tServer();
  const url = input.url.trim();
  if (!url) {
    return { ok: false, message: t.messages.homepageSaveFailed };
  }

  try {
    const homepage = await getHomepageContent();
    const next = applyHomepageImage(homepage, input.target, url);
    await saveHomepageContent(next);
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { ok: true, message: t.messages.homepageSaved };
  } catch {
    return { ok: false, message: t.messages.homepageSaveFailed };
  }
}

function applyHomepageImage(
  homepage: HomepageBundle,
  target: HomepageImageTarget,
  url: string,
): HomepageBundle {
  switch (target.kind) {
    case "world.side":
      return {
        ...homepage,
        world: { ...homepage.world, sideImage: url },
      };
    case "world.room": {
      const rooms = homepage.world.rooms.map((room, index) =>
        index === target.index ? { ...room, image: url } : room,
      );
      return {
        ...homepage,
        world: { ...homepage.world, rooms },
      };
    }
    case "featured.item": {
      const items = homepage.featured.items.map((item, index) =>
        index === target.index ? { ...item, image: url } : item,
      );
      return {
        ...homepage,
        featured: { ...homepage.featured, items },
      };
    }
    case "about.image":
      return {
        ...homepage,
        about: { ...homepage.about, image: url },
      };
    case "faq.side":
      return {
        ...homepage,
        faq: { ...homepage.faq, sideImage: url },
      };
    default:
      return homepage;
  }
}
