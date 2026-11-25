"use client";

import { useState } from "react";
import {
  AdminProductForm,
  type AdminProductFormValues,
} from "@/components/admin-product-form";
import { AdminProductRowActions } from "@/components/admin-product-row-actions";
import { useLocale } from "@/components/locale-provider";
import { getProductImages, productTypeLabel } from "@/lib/products";
import { formatMoney } from "@/lib/utils";

export function AdminProductsPanel({
  products,
}: {
  products: AdminProductFormValues[];
}) {
  const { t } = useLocale();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = products.find((product) => product.id === editingId) ?? null;

  return (
    <>
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
                  {formatMoney(product.priceCents, "EUR")}
                </td>
                <td className="px-4 py-4 text-smoke">
                  {product.published ? "Published" : "Draft"}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(product.id);
                        window.requestAnimationFrame(() => {
                          document
                            .getElementById("admin-product-form")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        });
                      }}
                      className="cursor-pointer text-[0.65rem] uppercase tracking-[0.16em] text-parchment hover:text-amber-bright"
                    >
                      {t.admin.common.editProduct}
                    </button>
                    <AdminProductRowActions
                      id={product.id}
                      published={product.published}
                    />
                  </div>
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

      <AdminProductForm
        key={editing?.id ?? "create"}
        product={editing}
        onCancelEdit={() => setEditingId(null)}
      />
    </>
  );
}
