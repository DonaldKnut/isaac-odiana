"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";
import { useCart } from "@/components/cart-provider";
import { IconBadge, WaveIllustration } from "@/components/illustrations";
import { useLocale } from "@/components/locale-provider";
import { formatMoney } from "@/lib/utils";

export function CartPageClient({
  success,
  cancelled,
}: {
  success?: boolean;
  cancelled?: boolean;
}) {
  const { items, subtotalCents, setQuantity, removeItem } = useCart();
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      {success ? (
        <p className="mb-8 border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber-bright">
          {t.cart.success}
        </p>
      ) : null}
      {cancelled ? (
        <p className="mb-8 border border-line px-4 py-3 text-sm text-smoke">
          {t.cart.cancelled}
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="border border-dashed border-line px-8 py-16 text-center">
          <IconBadge icon={ShoppingBag} className="mx-auto h-14 w-14" />
          <WaveIllustration className="mx-auto mt-5 h-8 w-32" />
          <p className="mt-6 font-display text-2xl text-parchment">
            {t.cart.empty}
          </p>
          <Link
            href="/books"
            className="mt-6 inline-block text-[0.7rem] uppercase tracking-[0.2em] text-amber"
          >
            {t.cart.browseBooks}
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-5 border-b border-line pb-6"
              >
                <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-ink-soft">
                  {item.coverUrl ? (
                    <Image
                      src={item.coverUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-display text-2xl text-parchment hover:text-amber-bright"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-smoke">
                      {formatMoney(item.priceCents, item.currency)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <label className="text-[0.65rem] uppercase tracking-[0.18em] text-smoke">
                      {t.cart.qty}
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          setQuantity(
                            item.productId,
                            Number(event.target.value) || 1,
                          )
                        }
                        className="ml-3 w-16 border border-line bg-transparent px-2 py-1 text-parchment"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="cursor-pointer text-[0.65rem] uppercase tracking-[0.18em] text-smoke hover:text-amber"
                    >
                      {t.cart.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-line bg-ink-soft/50 px-6 py-8">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-amber">
              {t.cart.summary}
            </p>
            <p className="mt-4 font-display text-4xl text-parchment">
              {formatMoney(subtotalCents, items[0]?.currency ?? "EUR")}
            </p>
            <p className="mt-2 text-sm text-smoke">{t.cart.shipping}</p>
            <div className="mt-8">
              <CheckoutButton />
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
