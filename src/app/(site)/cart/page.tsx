import { CartPageClient } from "@/components/cart-page-client";
import { PageHero } from "@/components/page-hero";
import { studioMedia } from "@/lib/media";

export const metadata = { title: "Cart" };

type PageProps = {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
};

export default async function CartPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <>
      <PageHero page="cart" image={studioMedia.gift} />
      <CartPageClient
        success={params.success === "1"}
        cancelled={params.cancelled === "1"}
      />
    </>
  );
}
