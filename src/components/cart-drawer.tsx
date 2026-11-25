"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useLocale } from "@/components/locale-provider";
import { formatMoney } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    count,
    subtotalCents,
    drawerOpen,
    closeDrawer,
    setQuantity,
    removeItem,
  } = useCart();
  const { t } = useLocale();

  return (
    <AnimatePresence>
      {drawerOpen ? (
        <div className="fixed inset-0 z-[95]">
          <motion.button
            type="button"
            aria-label={t.close}
            className="absolute inset-0 cursor-pointer bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-ink shadow-[0_0_80px_rgba(0,0,0,0.45)] max-[230px]:max-w-none"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-5">
              <div>
                <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.24em] text-amber">
                  <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.6} />
                  {t.nav.cart}
                  {count > 0 ? ` · ${count}` : ""}
                </p>
                <h2
                  id="cart-drawer-title"
                  className="mt-2 font-display text-3xl text-parchment"
                >
                  {t.cart.drawerTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="cursor-pointer text-smoke transition hover:text-parchment"
                aria-label={t.close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {items.length === 0 ? (
                <div className="border border-dashed border-line px-4 py-12 text-center">
                  <p className="font-display text-2xl text-parchment">
                    {t.cart.empty}
                  </p>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="mt-6 cursor-pointer text-[0.65rem] uppercase tracking-[0.2em] text-amber"
                  >
                    {t.cart.continueShopping}
                  </button>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-4 border-b border-line pb-5">
                      <div className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden bg-ink-soft">
                        {item.coverUrl ? (
                          <Image
                            src={item.coverUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="72px"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-xl text-parchment">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-smoke">
                          {formatMoney(item.priceCents, item.currency)}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <label className="text-[0.6rem] uppercase tracking-[0.16em] text-smoke">
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
                              className="ml-2 w-14 border border-line bg-transparent px-2 py-1 text-parchment"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="cursor-pointer text-[0.6rem] uppercase tracking-[0.16em] text-smoke hover:text-amber"
                          >
                            {t.cart.remove}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-line px-5 py-5">
              {items.length > 0 ? (
                <div className="mb-5 flex items-end justify-between gap-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-smoke">
                    {t.cart.summary}
                  </p>
                  <p className="font-display text-3xl text-parchment">
                    {formatMoney(subtotalCents, items[0]?.currency ?? "EUR")}
                  </p>
                </div>
              ) : null}
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="inline-flex w-full items-center justify-center gap-2 bg-parchment px-5 py-3.5 text-[0.7rem] uppercase tracking-[0.2em] text-ink transition hover:bg-amber-bright"
              >
                {t.cart.viewFullCart}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
              </Link>
              <button
                type="button"
                onClick={closeDrawer}
                className="mt-3 w-full cursor-pointer py-2 text-[0.65rem] uppercase tracking-[0.18em] text-smoke transition hover:text-parchment"
              >
                {t.cart.continueShopping}
              </button>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
