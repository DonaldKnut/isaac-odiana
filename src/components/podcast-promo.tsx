"use client";

import Image from "next/image";
import Link from "next/link";
import { Headphones, Mic2, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { IconBadge } from "@/components/illustrations";
import { useLocale } from "@/components/locale-provider";
import { studioMedia } from "@/lib/media";

const pillarIcons = [Mic2, Headphones, Sparkles] as const;

export function PodcastPromo() {
  const { t } = useLocale();
  const promo = t.podcastPromo;

  return (
    <>
      <section className="border-t border-line bg-ink-soft/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-24 lg:gap-16">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
              <Headphones className="h-3.5 w-3.5" strokeWidth={1.6} />
              {promo.whyEyebrow}
            </p>
            <h2 className="mt-4 font-display text-4xl text-parchment md:text-5xl">
              {promo.whyTitle}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-smoke md:text-lg">
              {promo.whyBody}
            </p>
          </Reveal>
          <Reveal delay={0.08} className="relative min-h-[260px] overflow-hidden">
            <Image
              src={studioMedia.headphones}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-ink/40" />
          </Reveal>
        </div>

        <div className="mx-auto grid max-w-7xl gap-px border-t border-line bg-line md:grid-cols-3">
          {promo.pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.06}>
              <div className="h-full bg-ink px-6 py-10 md:px-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-2xl text-amber/80">
                    0{index + 1}
                  </p>
                  <IconBadge icon={pillarIcons[index]} />
                </div>
                <h3 className="mt-4 font-display text-2xl text-parchment">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-smoke">
                  {pillar.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line">
        <Image
          src={studioMedia.mic}
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 py-20 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
              <Mic2 className="h-3.5 w-3.5" strokeWidth={1.6} />
              {promo.ctaEyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl text-parchment md:text-5xl">
              {promo.ctaTitle}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-sand/85 md:text-base">
              {promo.ctaBody}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/books"
              className="bg-parchment px-5 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-ink transition hover:bg-amber-bright"
            >
              {promo.ctaBooks}
            </Link>
            <Link
              href="/tutoring"
              className="border border-amber/45 px-5 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-amber-bright transition hover:bg-amber/10"
            >
              {promo.ctaTutoring}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
