import { ProductType } from "@prisma/client";
import { PageHero } from "@/components/page-hero";
import { ProductCatalogue } from "@/components/product-catalogue";
import { studioMedia } from "@/lib/media";
import { getPublishedProductCards } from "@/lib/products";

export const metadata = { title: "Books" };

export default async function BooksPage() {
  const books = await getPublishedProductCards([
    ProductType.BOOK_PHYSICAL,
    ProductType.BOOK_DIGITAL,
  ]);

  return (
    <>
      <PageHero page="books" image={studioMedia.writing} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <ProductCatalogue products={books} emptyKey="books" />
      </section>
    </>
  );
}
