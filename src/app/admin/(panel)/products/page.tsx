import { Package } from "lucide-react";
import { AdminPageHeading } from "@/components/admin-page-heading";
import { AdminProductForm } from "@/components/admin-product-form";
import { AdminProductRowActions } from "@/components/admin-product-row-actions";
import {
  getAllProducts,
  getProductImages,
  productTypeLabel,
} from "@/lib/products";
import { formatMoney } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <AdminPageHeading
        icon={Package}
        title="Products"
        description="Create books and merch with multi-image galleries via Cloudinary or pasted URLs."
      />

      <div className="mt-10 overflow-x-auto border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-ink-soft text-[0.65rem] uppercase tracking-[0.16em] text-smoke">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Images</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-line/70">
                <td className="px-4 py-4 text-parchment">{product.title}</td>
                <td className="px-4 py-4 text-smoke">
                  {productTypeLabel(product.type)}
                </td>
                <td className="px-4 py-4 text-smoke">
                  {getProductImages(product).length}
                </td>
                <td className="px-4 py-4 text-smoke">
                  {formatMoney(product.priceCents, product.currency)}
                </td>
                <td className="px-4 py-4 text-smoke">
                  {product.published ? "Published" : "Draft"}
                </td>
                <td className="px-4 py-4">
                  <AdminProductRowActions
                    id={product.id}
                    published={product.published}
                  />
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-smoke">
                  No products yet — add one below.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <AdminProductForm />
    </div>
  );
}
