"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { CmsEditableImage } from "@/components/cms-editable-image";
import { Reveal } from "@/components/reveal";
import { useLocalized } from "@/components/localized";
import type { HomeFeaturedContent } from "@/lib/cms/types";

export function HomeFeaturedStrip({ content }: { content: HomeFeaturedContent }) {
  const t = useLocalized();

  return (
    <section className="border-t border-line bg-ink-soft/30">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
            <Star className="h-3.5 w-3.5" strokeWidth={1.6} />
            {t(content.eyebrow)}
          </p>
          <h2 className="mt-3 font-display text-3xl text-parchment md:text-4xl">
            {t(content.title)}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.items.map((feature, index) => (
            <Reveal key={`${feature.href}-${index}`} delay={index * 0.08}>
              <Link
                href={feature.href}
                className="group relative block aspect-[4/5] overflow-hidden"
              >
                <CmsEditableImage
                  src={feature.image}
                  alt={t(feature.title)}
                  fill
                  target={{ kind: "featured.item", index }}
                  className="object-cover transition duration-[900ms] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-amber">
                    {t(feature.label)}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-parchment md:text-3xl">
                    {t(feature.title)}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
