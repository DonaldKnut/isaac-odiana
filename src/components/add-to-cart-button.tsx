"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useLocale } from "@/components/locale-provider";
import { UiButton } from "@/components/ui-button";
import { useToast } from "@/components/toast-provider";

type AddToCartButtonProps = {
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  coverUrl: string | null;
};

export function AddToCartButton(props: AddToCartButtonProps) {
  const { addItem } = useCart();
  const toast = useToast();
  const { t } = useLocale();
  const [added, setAdded] = useState(false);

  return (
    <UiButton
      tone="primary"
      icon={added ? Check : ShoppingBag}
      onClick={() => {
        addItem(props);
        setAdded(true);
        toast.success(t.product.addedToast, props.title);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? t.product.added : t.product.addToCart}
    </UiButton>
  );
}
