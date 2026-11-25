"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { EmptyCatalogueArt } from "@/components/illustrations";
import { useLocale } from "@/components/locale-provider";
import type { ProductCardData } from "@/lib/products";

export function ProductCatalogue({
  products,
  emptyKey,
}: {
  products: ProductCardData[];
  emptyKey: "books" | "shop";
}) {
  const { t } = useLocale();
  const [active, setActive] = useState<ProductCardData | null>(null);

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-line px-8 py-16 text-center">
        {emptyKey === "shop" ? <EmptyCatalogueArt /> : null}
        <p
          className={`${emptyKey === "shop" ? "mt-6" : ""} font-display text-2xl text-parchment`}
        >
          {t.pages[emptyKey].empty}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={setActive} />
        ))}
      </div>
      <ProductDetailModal
        product={active}
        open={Boolean(active)}
        onClose={() => setActive(null)}
      />
    </>
  );
}
