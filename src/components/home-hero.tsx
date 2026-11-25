"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { HeroBackgroundSlider } from "@/components/hero-background-slider";
import { useLocalized } from "@/components/localized";
import type { HomeHeroContent } from "@/lib/cms/types";

export function HomeHero({ content }: { content: HomeHeroContent }) {
  const t = useLocalized();

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <HeroBackgroundSlider />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-24 pt-32 md:px-10 md:pb-32">
        <p className="animate-rise inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.35em] text-amber">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.6} />
          {t(content.eyebrow)}
        </p>
        <h1 className="animate-rise-delay-1 mt-4 max-w-4xl font-display text-6xl leading-[0.92] tracking-tight text-parchment md:text-8xl lg:text-9xl">
          <span className="hero-title-line inline-block">
            {t(content.titleLine1)}
          </span>
          <br />
          <span className="hero-title-line inline-block [animation-delay:0.12s]">
            {t(content.titleLine2)}
          </span>
        </h1>
        <p className="animate-rise-delay-2 mt-6 max-w-md text-base leading-relaxed text-sand/90 md:text-lg">
          {t(content.description)}
        </p>
        <div className="animate-rise-delay-3 mt-10 flex flex-wrap gap-4">
          <Link
            href={content.primaryHref}
            className="bg-parchment px-7 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink transition duration-500 hover:bg-amber-bright"
          >
            {t(content.primaryCta)}
          </Link>
          <Link
            href={content.secondaryHref}
            className="border border-parchment/35 px-7 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-parchment transition duration-500 hover:border-amber hover:text-amber-bright"
          >
            {t(content.secondaryCta)}
          </Link>
        </div>
      </div>
    </section>
  );
}
