"use client";

import { deleteProduct, toggleProductPublished } from "@/app/actions/products";

export function AdminProductRowActions({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => toggleProductPublished(id)}
        className="text-[0.65rem] uppercase tracking-[0.16em] text-amber hover:text-amber-bright"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        onClick={() => {
          if (confirm("Delete this product?")) deleteProduct(id);
        }}
        className="text-[0.65rem] uppercase tracking-[0.16em] text-smoke hover:text-parchment"
      >
        Delete
      </button>
    </div>
  );
}
