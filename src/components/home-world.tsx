"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Disc3,
  Mic2,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { CmsEditableImage } from "@/components/cms-editable-image";
import { Reveal } from "@/components/reveal";
import { IconBadge } from "@/components/illustrations";
import { useLocale } from "@/components/locale-provider";
import { useLocalized } from "@/components/localized";
import type { HomeWorldContent } from "@/lib/cms/types";

const roomIcons: Record<string, LucideIcon> = {
  "/music": Disc3,
  "/books": BookOpen,
  "/podcast": Mic2,
  "/shop": ShoppingBag,
  "/tutoring": Sparkles,
};

export function HomeWorld({ content }: { content: HomeWorldContent }) {
  const t = useLocalized();
  const { t: ui } = useLocale();

  return (
    <section className="border-t border-line bg-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-28 lg:gap-16">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.6} />
            {t(content.eyebrow)}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-parchment md:text-5xl">
            {t(content.title)}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-smoke md:text-lg">
            {t(content.body)}
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="relative hidden min-h-[280px] overflow-hidden md:block"
        >
          <CmsEditableImage
            src={content.sideImage}
            alt=""
            fill
            target={{ kind: "world.side" }}
            className="object-cover"
            sizes="40vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-ink/10 to-ink/70" />
        </Reveal>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4">
        {content.rooms.map((item, index) => (
          <Reveal key={`${item.href}-${index}`} delay={index * 0.06}>
            <Link
              href={item.href}
              className="group relative block min-h-[360px] overflow-hidden border-t border-line md:border-l xl:min-h-[420px]"
            >
              <CmsEditableImage
                src={item.image}
                alt={t(item.title)}
                fill
                target={{ kind: "world.room", index }}
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15 transition duration-500 group-hover:via-ink/40" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-7 md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <motion.p
                    className="text-[0.65rem] uppercase tracking-[0.24em] text-amber"
                    initial={false}
                  >
                    {ui.enter}
                  </motion.p>
                  <IconBadge
                    icon={roomIcons[item.href] ?? Sparkles}
                    className="border-parchment/20 bg-ink/50"
                  />
                </div>
                <h3 className="mt-3 font-display text-3xl text-parchment transition-colors group-hover:text-amber-bright">
                  {t(item.title)}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-sand/85">
                  {t(item.copy)}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
