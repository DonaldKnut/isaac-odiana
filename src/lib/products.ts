import { ProductType, type Product } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ProductCardData = {
  id: string;
  slug: string;
  title: string;
  titleFr: string | null;
  description: string;
  descriptionFr: string | null;
  type: ProductType;
  priceCents: number;
  currency: string;
  coverUrl: string | null;
  images: string[];
  stock: number | null;
  digitalUrl: string | null;
};

export function getProductImages(product: {
  coverUrl?: string | null;
  images?: unknown;
}): string[] {
  let raw = product.images;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = [];
    }
  }
  const fromJson = Array.isArray(raw)
    ? raw.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];
  if (fromJson.length > 0) return fromJson;
  return product.coverUrl ? [product.coverUrl] : [];
}

export function toProductCard(product: Product): ProductCardData {
  const images = getProductImages(product);
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    titleFr: product.titleFr,
    description: product.description,
    descriptionFr: product.descriptionFr,
    type: product.type,
    priceCents: product.priceCents,
    currency: product.currency,
    coverUrl: images[0] ?? product.coverUrl,
    images,
    stock: product.stock,
    digitalUrl: product.digitalUrl,
  };
}

export async function getPublishedProducts(types?: ProductType[]) {
  return prisma.product.findMany({
    where: {
      published: true,
      ...(types?.length ? { type: { in: types } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedProductCards(types?: ProductType[]) {
  const products = await getPublishedProducts(types);
  return products.map(toProductCard);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, published: true },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export function isBook(product: Product) {
  return (
    product.type === ProductType.BOOK_PHYSICAL ||
    product.type === ProductType.BOOK_DIGITAL
  );
}

export function productTypeLabel(type: ProductType) {
  switch (type) {
    case ProductType.BOOK_PHYSICAL:
      return "Physical book";
    case ProductType.BOOK_DIGITAL:
      return "E-book";
    case ProductType.MERCH:
      return "Merchandise";
  }
}
