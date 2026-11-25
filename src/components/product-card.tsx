"use client";

import { ImageSlider } from "@/components/image-slider";
import { useLocale } from "@/components/locale-provider";
import { resolveLocalized } from "@/lib/i18n/localize-content";
import type { ProductCardData } from "@/lib/products";
import { formatMoney } from "@/lib/utils";

export function ProductCard({
  product,
  onOpen,
}: {
  product: ProductCardData;
  onOpen: (product: ProductCardData) => void;
}) {
  const { t, locale } = useLocale();
  const title = resolveLocalized(product.title, product.titleFr, locale);

  return (
    <article className="group block w-full text-left">
      <ImageSlider
        images={product.images}
        alt={title}
        className="aspect-[3/4]"
        sizes="(max-width: 768px) 100vw, 25vw"
        onMediaClick={() => onOpen(product)}
      />
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="mt-4 w-full cursor-pointer text-left"
      >
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-amber">
          {t.productTypes[product.type]}
        </p>
        <h3 className="mt-2 font-display text-2xl text-parchment transition-colors group-hover:text-amber-bright">
          {title}
        </h3>
        <p className="mt-2 text-sm text-smoke">
          {formatMoney(product.priceCents, product.currency)}
        </p>
      </button>
    </article>
  );
}
