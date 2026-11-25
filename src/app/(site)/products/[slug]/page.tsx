import { notFound, redirect } from "next/navigation";
import { getProductBySlug, isBook } from "@/lib/products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Catalogue now opens a modal; deep links land on the right aisle.
  redirect(isBook(product) ? "/books" : "/shop");
}
