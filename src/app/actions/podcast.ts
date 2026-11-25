"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getRequestLocale, tServer } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import {
  firstZodError,
  optionalUrlSchema,
  positiveIntSchema,
  slugSchema,
  urlSchema,
} from "@/lib/validation";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type PodcastActionState = {
  ok: boolean;
  message: string;
};

export async function createEpisode(
  _prev: PodcastActionState,
  formData: FormData,
): Promise<PodcastActionState> {
  const locale = await getRequestLocale();
  const t = await tServer();
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "") || slugify(title);

  const episodeSchema = z.object({
    title: z.string().trim().min(2, t.validation.titleRequired),
    titleFr: z.string().trim().optional(),
    slug: slugSchema(locale),
    description: z.string().trim().min(10, t.validation.descriptionDetail),
    descriptionFr: z.string().trim().optional(),
    audioUrl: urlSchema(locale),
    coverUrl: optionalUrlSchema(locale),
    category: z.string().trim().optional(),
    categoryFr: z.string().trim().optional(),
    durationSec: positiveIntSchema.optional().nullable(),
    published: z.coerce.boolean().default(false),
  });

  const parsed = episodeSchema.safeParse({
    title,
    titleFr: String(formData.get("titleFr") ?? "") || undefined,
    slug,
    description: formData.get("description"),
    descriptionFr: String(formData.get("descriptionFr") ?? "") || undefined,
    audioUrl: formData.get("audioUrl"),
    coverUrl: formData.get("coverUrl") || "",
    category: String(formData.get("category") ?? "") || undefined,
    categoryFr: String(formData.get("categoryFr") ?? "") || undefined,
    durationSec: formData.get("durationSec") || null,
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { ok: false, message: firstZodError(parsed.error, locale) };
  }

  const data = parsed.data;

  try {
    await prisma.podcastEpisode.create({
      data: {
        title: data.title,
        titleFr: data.titleFr || null,
        slug: data.slug,
        description: data.description,
        descriptionFr: data.descriptionFr || null,
        audioUrl: data.audioUrl,
        coverUrl: data.coverUrl || null,
        category: data.category || null,
        categoryFr: data.categoryFr || null,
        durationSec: data.durationSec,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
      },
    });
  } catch {
    return { ok: false, message: t.messages.episodeCreateFailed };
  }

  revalidatePath("/admin/podcast");
  revalidatePath("/podcast");
  return { ok: true, message: t.messages.episodeCreated };
}

export async function toggleEpisodePublished(id: string) {
  const episode = await prisma.podcastEpisode.findUnique({ where: { id } });
  if (!episode) return;

  const published = !episode.published;
  await prisma.podcastEpisode.update({
    where: { id },
    data: {
      published,
      publishedAt: published ? episode.publishedAt ?? new Date() : episode.publishedAt,
    },
  });

  revalidatePath("/admin/podcast");
  revalidatePath("/podcast");
}

export async function deleteEpisode(id: string) {
  await prisma.podcastEpisode.delete({ where: { id } });
  revalidatePath("/admin/podcast");
  revalidatePath("/podcast");
}
