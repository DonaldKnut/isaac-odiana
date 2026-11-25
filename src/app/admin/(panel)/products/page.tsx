import { Package } from "lucide-react";
import { AdminPageHeading } from "@/components/admin-page-heading";
import { AdminProductsPanel } from "@/components/admin-products-panel";
import { getAllProducts } from "@/lib/products";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <AdminPageHeading
        icon={Package}
        title="Products"
        description="Create and edit books and merch with multi-image galleries via Cloudinary."
      />
      <AdminProductsPanel
        products={products.map((product) => ({
          id: product.id,
          title: product.title,
          titleFr: product.titleFr,
          slug: product.slug,
          description: product.description,
          descriptionFr: product.descriptionFr,
          type: product.type,
          priceCents: product.priceCents,
          stock: product.stock,
          digitalUrl: product.digitalUrl,
          published: product.published,
          coverUrl: product.coverUrl,
          images: product.images,
        }))}
      />
    </div>
  );
}
