"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ImageSlider } from "@/components/image-slider";
import { useLocale } from "@/components/locale-provider";
import { ModalShell } from "@/components/modal-shell";
import { resolveLocalized } from "@/lib/i18n/localize-content";
import type { ProductCardData } from "@/lib/products";
import { formatMoney } from "@/lib/utils";

export function ProductDetailModal({
  product,
  open,
  onClose,
}: {
  product: ProductCardData | null;
  open: boolean;
  onClose: () => void;
}) {
  const { t, locale } = useLocale();
  if (!product) return null;
  const title = resolveLocalized(product.title, product.titleFr, locale);
  const description = resolveLocalized(
    product.description,
    product.descriptionFr,
    locale,
  );

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      labelledBy="product-modal-title"
      size="xl"
    >
      <div className="grid max-h-[92svh] overflow-y-auto md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[280px] border-b border-line md:min-h-full md:border-b-0 md:border-r"
        >
          <ImageSlider
            images={product.images}
            alt={title}
            className="aspect-[4/5] h-full min-h-[280px] md:aspect-auto md:min-h-[520px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between px-6 py-7 sm:px-8 sm:py-9"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-amber">
                {product.type === "MERCH" ? (
                  <Package className="h-3.5 w-3.5" strokeWidth={1.6} />
                ) : null}
                {t.productTypes[product.type]}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-2xl leading-none text-smoke transition hover:text-parchment"
                aria-label={t.close}
              >
                ×
              </button>
            </div>
            <h2
              id="product-modal-title"
              className="mt-4 font-display text-4xl leading-tight text-parchment md:text-5xl"
            >
              {title}
            </h2>
            <p className="mt-4 font-display text-3xl text-sand">
              {formatMoney(product.priceCents, product.currency)}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-smoke md:text-base">
              {description}
            </p>
            {product.stock != null ? (
              <p className="mt-4 text-sm text-sand/70">
                {product.stock} {t.product.inStock}
              </p>
            ) : null}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              title={title}
              priceCents={product.priceCents}
              currency={product.currency}
              coverUrl={product.coverUrl}
            />
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-[0.65rem] uppercase tracking-[0.2em] text-smoke transition hover:text-parchment"
            >
              {t.keepBrowsing}
            </button>
          </div>
        </motion.div>
      </div>
    </ModalShell>
  );
}
