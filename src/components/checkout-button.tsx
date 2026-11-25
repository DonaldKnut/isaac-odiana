"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { z } from "zod";
import { useCart } from "@/components/cart-provider";
import { useLocale } from "@/components/locale-provider";
import { useToast } from "@/components/toast-provider";
import { UiButton } from "@/components/ui-button";
import { emailSchema, firstZodError, nameSchema } from "@/lib/validation";

export function CheckoutButton() {
  const { items, clear } = useCart();
  const toast = useToast();
  const { t, locale } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkout() {
    const parsed = z
      .object({
        name: nameSchema(locale),
        email: emailSchema(locale),
      })
      .safeParse({ name: name.trim(), email: email.trim() });
    if (!parsed.success) {
      toast.error(t.cart.invalidEmail, firstZodError(parsed.error, locale));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          idempotencyKey:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? `cart_${crypto.randomUUID()}`
              : `cart_${Date.now()}`,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        toast.error(t.cart.checkoutFailed, data.error ?? t.cart.tryAgain);
        return;
      }

      toast.success(t.cart.redirectingStripe, t.cart.securePayment);
      clear();
      window.location.href = data.url;
    } catch {
      toast.error(t.cart.networkError, t.cart.couldNotReach);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-smoke">
          {t.cart.customerName}
        </span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t.cart.customerNamePlaceholder}
          autoComplete="name"
          className="mt-2 w-full border-b border-line bg-transparent py-2 text-parchment outline-none focus:border-amber"
        />
      </label>
      <label className="block">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-smoke">
          {t.cart.emailReceipt}
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          className="mt-2 w-full border-b border-line bg-transparent py-2 text-parchment outline-none focus:border-amber"
        />
      </label>
      <UiButton
        tone="amber"
        className="w-full"
        loading={loading}
        disabled={items.length === 0}
        icon={CreditCard}
        onClick={checkout}
      >
        {loading ? t.cart.redirecting : t.cart.buy}
      </UiButton>
      <p className="text-xs text-smoke">{t.cart.checkoutNote}</p>
    </div>
  );
}
