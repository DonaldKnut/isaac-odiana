"use server";

import { revalidatePath } from "next/cache";
import { ProductType } from "@prisma/client";
import { z } from "zod";
import { getRequestLocale, tServer } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import {
  firstZodError,
  nonNegativeIntSchema,
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

function parseImageList(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export type ProductActionState = {
  ok: boolean;
  message: string;
};

export async function createProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const locale = await getRequestLocale();
  const t = await tServer();
  const title = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "") || slugify(title);
  const images = parseImageList(formData.get("images"));

  const productSchema = z.object({
    title: z.string().trim().min(2, t.validation.titleRequired),
    titleFr: z.string().trim().optional(),
    slug: slugSchema(locale),
    description: z.string().trim().min(10, t.validation.descriptionDetail),
    descriptionFr: z.string().trim().optional(),
    type: z.nativeEnum(ProductType),
    priceCents: positiveIntSchema,
    currency: z.string().default("EUR"),
    images: z.array(urlSchema(locale)).min(1, t.validation.imagesRequired),
    stock: nonNegativeIntSchema.optional().nullable(),
    digitalUrl: optionalUrlSchema(locale),
    published: z.coerce.boolean().default(false),
  });

  const parsed = productSchema.safeParse({
    title,
    titleFr: String(formData.get("titleFr") ?? "") || undefined,
    slug: rawSlug,
    description: formData.get("description"),
    descriptionFr: String(formData.get("descriptionFr") ?? "") || undefined,
    type: formData.get("type"),
    priceCents: formData.get("priceCents"),
    currency: formData.get("currency") || "EUR",
    images,
    stock: formData.get("stock") || null,
    digitalUrl: formData.get("digitalUrl") || "",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: firstZodError(parsed.error, locale),
    };
  }

  const data = parsed.data;

  try {
    await prisma.product.create({
      data: {
        title: data.title,
        titleFr: data.titleFr || null,
        slug: data.slug,
        description: data.description,
        descriptionFr: data.descriptionFr || null,
        type: data.type,
        priceCents: data.priceCents,
        currency: data.currency,
        coverUrl: data.images[0] ?? null,
        images: data.images,
        stock: data.type === ProductType.BOOK_DIGITAL ? null : data.stock,
        digitalUrl: data.digitalUrl || null,
        published: data.published,
      },
    });
  } catch {
    return {
      ok: false,
      message: t.messages.productCreateFailed,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/books");
  revalidatePath("/shop");
  return { ok: true, message: t.messages.productCreated };
}

export async function updateProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const locale = await getRequestLocale();
  const t = await tServer();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "") || slugify(title);
  const images = parseImageList(formData.get("images"));

  if (!id) {
    return { ok: false, message: t.messages.productCreateFailed };
  }

  const productSchema = z.object({
    title: z.string().trim().min(2, t.validation.titleRequired),
    titleFr: z.string().trim().optional(),
    slug: slugSchema(locale),
    description: z.string().trim().min(10, t.validation.descriptionDetail),
    descriptionFr: z.string().trim().optional(),
    type: z.nativeEnum(ProductType),
    priceCents: positiveIntSchema,
    currency: z.string().default("EUR"),
    images: z.array(urlSchema(locale)).min(1, t.validation.imagesRequired),
    stock: nonNegativeIntSchema.optional().nullable(),
    digitalUrl: optionalUrlSchema(locale),
    published: z.coerce.boolean().default(false),
  });

  const parsed = productSchema.safeParse({
    title,
    titleFr: String(formData.get("titleFr") ?? "") || undefined,
    slug: rawSlug,
    description: formData.get("description"),
    descriptionFr: String(formData.get("descriptionFr") ?? "") || undefined,
    type: formData.get("type"),
    priceCents: formData.get("priceCents"),
    currency: formData.get("currency") || "EUR",
    images,
    stock: formData.get("stock") || null,
    digitalUrl: formData.get("digitalUrl") || "",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: firstZodError(parsed.error, locale),
    };
  }

  const data = parsed.data;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, message: t.messages.productCreateFailed };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        titleFr: data.titleFr || null,
        slug: data.slug,
        description: data.description,
        descriptionFr: data.descriptionFr || null,
        type: data.type,
        priceCents: data.priceCents,
        currency: data.currency,
        coverUrl: data.images[0] ?? null,
        images: data.images,
        stock: data.type === ProductType.BOOK_DIGITAL ? null : data.stock,
        digitalUrl: data.digitalUrl || null,
        published: data.published,
      },
    });
  } catch {
    return {
      ok: false,
      message: t.messages.productCreateFailed,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/books");
  revalidatePath("/shop");
  revalidatePath(`/products/${existing.slug}`);
  revalidatePath(`/products/${data.slug}`);
  return { ok: true, message: t.messages.productUpdated };
}

export async function toggleProductPublished(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: { published: !product.published },
  });

  revalidatePath("/admin/products");
  revalidatePath("/books");
  revalidatePath("/shop");
  revalidatePath(`/products/${product.slug}`);
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/books");
  revalidatePath("/shop");
}
