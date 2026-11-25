"use client";

import { Disc3, Mic2, ShoppingBag, Sparkles } from "lucide-react";
import { SectionHero } from "@/components/section-hero";
import { useLocale } from "@/components/locale-provider";
import type { PageHeroKey } from "@/lib/i18n/dictionary";

const pageIcons = {
  music: Disc3,
  books: undefined,
  shop: ShoppingBag,
  podcast: Mic2,
  tutoring: Sparkles,
  cart: ShoppingBag,
} as const;

export function PageHero({
  page,
  image,
}: {
  page: PageHeroKey;
  image?: string;
}) {
  const { t } = useLocale();
  const content = t.pages[page];

  return (
    <SectionHero
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      image={image}
      icon={pageIcons[page]}
    />
  );
}
