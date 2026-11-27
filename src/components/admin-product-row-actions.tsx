"use client";

import { useTransition } from "react";
import { deleteProduct, toggleProductPublished } from "@/app/actions/products";
import { useToast } from "@/components/toast-provider";

export function AdminProductRowActions({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<void>, success: string) {
    startTransition(async () => {
      try {
        await action();
        toast.success(success);
      } catch {
        toast.error("Catalogue error", "Couldn’t update this product.");
      }
    });
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          run(
            () => toggleProductPublished(id),
            published ? "Unpublished" : "Published",
          )
        }
        className="cursor-pointer text-[0.65rem] uppercase tracking-[0.16em] text-amber hover:text-amber-bright disabled:opacity-50"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this product?")) return;
          run(() => deleteProduct(id), "Product deleted");
        }}
        className="cursor-pointer text-[0.65rem] uppercase tracking-[0.16em] text-smoke hover:text-parchment disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
