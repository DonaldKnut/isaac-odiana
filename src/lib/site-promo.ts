"use client";

export type SitePromoId = "announcement" | "newsletter";

type Listener = () => void;

let holder: SitePromoId | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function getSitePromoHolder() {
  return holder;
}

export function claimSitePromo(id: SitePromoId) {
  if (holder && holder !== id) return false;
  if (holder !== id) {
    holder = id;
    emit();
  }
  return true;
}

export function releaseSitePromo(id: SitePromoId) {
  if (holder !== id) return;
  holder = null;
  emit();
}

export function subscribeSitePromo(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
