import { ProductType } from "@prisma/client";
import { PageHero } from "@/components/page-hero";
import { ProductCatalogue } from "@/components/product-catalogue";
import { studioMedia } from "@/lib/media";
import { getPublishedProductCards } from "@/lib/products";

export const metadata = { title: "Shop" };

export default async function ShopPage() {
  const merch = await getPublishedProductCards([ProductType.MERCH]);

  return (
    <>
      <PageHero page="shop" image={studioMedia.gift} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <ProductCatalogue products={merch} emptyKey="shop" />
      </section>
    </>
  );
}
