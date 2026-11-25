"use client";

import { useActionState, useEffect, useState } from "react";
import { ChevronDown, Mail, UserRound } from "lucide-react";
import {
  markOrderFulfilled,
  type OrderActionState,
} from "@/app/actions/admin-orders";
import { useToast } from "@/components/toast-provider";
import { formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type AdminOrderRow = {
  id: string;
  email: string;
  shippingName: string | null;
  status: string;
  totalCents: number;
  currency: string;
  createdAt: string;
  items: Array<{ title: string; quantity: number; unitCents: number }>;
};

const initial: OrderActionState = { ok: false, message: "" };

function FulfilForm({ orderId, status }: { orderId: string; status: string }) {
  const toast = useToast();
  const [state, action, pending] = useActionState(markOrderFulfilled, initial);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success("Orders", state.message);
    else toast.error("Orders", state.message);
  }, [state, toast]);

  if (status === "FULFILLED") {
    return (
      <p className="text-xs uppercase tracking-[0.16em] text-amber-bright">
        Fulfilled · customer notified
      </p>
    );
  }

  if (status !== "PAID") {
    return (
      <p className="text-xs text-smoke">
        Fulfilment unlocks after Stripe marks the order PAID.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-3 border border-line/80 bg-ink/50 p-4">
      <input type="hidden" name="orderId" value={orderId} />
      <label className="block space-y-1.5">
        <span className="text-[0.6rem] uppercase tracking-[0.16em] text-smoke">
          Fulfilment note (optional)
        </span>
        <textarea
          name="note"
          rows={2}
          placeholder="Tracking number, digital download note…"
          className="w-full border border-line bg-ink px-3 py-2 text-sm text-parchment outline-none focus:border-amber/50"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-9 cursor-pointer items-center border border-amber/40 bg-amber/10 px-3 text-[0.65rem] uppercase tracking-[0.16em] text-amber-bright transition hover:bg-amber/20 disabled:opacity-50"
      >
        {pending ? "Updating…" : "Mark fulfilled + email guest"}
      </button>
    </form>
  );
}

export function AdminOrdersTable({ orders }: { orders: AdminOrderRow[] }) {
  const [openId, setOpenId] = useState<string | null>(orders[0]?.id ?? null);

  if (orders.length === 0) {
    return (
      <p className="border border-dashed border-line px-4 py-10 text-center text-sm text-smoke">
        No orders yet. Guests checkout with email only — no signup required.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const open = openId === order.id;
        const customer = order.shippingName || order.email;
        return (
          <article key={order.id} className="border border-line bg-ink-soft/30">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : order.id)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
              aria-expanded={open}
            >
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.18em] text-amber">
                  <UserRound className="h-3 w-3" strokeWidth={1.6} />
                  Guest customer
                </p>
                <p className="mt-1 truncate font-display text-2xl text-parchment">
                  {customer}
                </p>
                <p className="mt-1 truncate text-xs text-smoke">{order.email}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <div className="hidden text-right sm:block">
                  <p className="text-sm text-parchment">
                    {formatMoney(order.totalCents, order.currency)}
                  </p>
                  <p className="text-[0.65rem] uppercase tracking-[0.16em] text-amber-bright">
                    {order.status}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-smoke transition duration-300",
                    open && "rotate-180 text-amber-bright",
                  )}
                  strokeWidth={1.6}
                />
              </div>
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-4 border-t border-line px-4 py-5 sm:px-5">
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <p className="inline-flex items-center gap-2 text-smoke">
                      <Mail className="h-3.5 w-3.5 text-brass" strokeWidth={1.6} />
                      {order.email}
                    </p>
                    <p className="text-smoke">
                      Placed{" "}
                      {new Date(order.createdAt).toLocaleString("en-GB")}
                    </p>
                    <p className="text-smoke">
                      Status{" "}
                      <span className="text-amber-bright">{order.status}</span>
                    </p>
                    <p className="text-smoke">
                      Total{" "}
                      <span className="text-parchment">
                        {formatMoney(order.totalCents, order.currency)}
                      </span>
                    </p>
                    <p className="text-xs text-smoke/70 sm:col-span-2">
                      Order ID · {order.id}
                    </p>
                  </div>

                  <ul className="space-y-2 border border-line/80 bg-ink/40 px-4 py-3">
                    {order.items.map((item, index) => (
                      <li
                        key={`${order.id}-${index}`}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span className="text-parchment">
                          {item.title} ×{item.quantity}
                        </span>
                        <span className="text-smoke">
                          {formatMoney(
                            item.unitCents * item.quantity,
                            order.currency,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <FulfilForm orderId={order.id} status={order.status} />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
