"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { BookCtaModal } from "@/components/book-cta-modal";
import { CmsEditableImage } from "@/components/cms-editable-image";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { useLocalized } from "@/components/localized";
import type { HomeAboutContent } from "@/lib/cms/types";

export function HomeAbout({ content }: { content: HomeAboutContent }) {
  const t = useLocalized();
  const [bookOpen, setBookOpen] = useState(false);
  const opensSession =
    content.ctaHref === "/tutoring" ||
    content.ctaHref.startsWith("/tutoring");

  return (
    <section className="relative overflow-hidden border-t border-line bg-ink">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <Reveal className="relative min-h-[420px] lg:min-h-full">
          <CmsEditableImage
            src={content.image}
            alt=""
            fill
            target={{ kind: "about.image" }}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="pointer-events-none absolute bottom-8 left-8 right-8">
            <p className="mt-3 max-w-sm font-display text-3xl text-parchment">
              {t(content.imageCaption)}
            </p>
          </div>
        </Reveal>

        <div className="relative px-6 py-16 md:px-10 md:py-24 lg:px-14">
          <div className="pointer-events-none absolute -right-16 top-20 h-64 w-64 rounded-full bg-amber/10 blur-3xl" />
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
              <UserRound className="h-3.5 w-3.5" strokeWidth={1.6} />
              {t(content.eyebrow)}
            </p>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] text-parchment md:text-5xl lg:text-6xl">
              {t(content.title)}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-smoke md:text-lg">
              {t(content.body)}
            </p>
            {opensSession ? (
              <button
                type="button"
                onClick={() => setBookOpen(true)}
                className="mt-10 inline-flex cursor-pointer border border-amber/45 px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-amber-bright transition duration-500 hover:border-amber-bright hover:bg-amber/10"
              >
                {t(content.cta)}
              </button>
            ) : (
              <a
                href={content.ctaHref}
                className="mt-10 inline-flex border border-amber/45 px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-amber-bright transition duration-500 hover:border-amber-bright hover:bg-amber/10"
              >
                {t(content.cta)}
              </a>
            )}
          </Reveal>

          <RevealGroup className="mt-14 space-y-0 border-t border-line">
            {content.pillars.map((pillar) => (
              <RevealItem
                key={pillar.number}
                className="group border-b border-line py-7"
              >
                <motion.div
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-4 md:grid-cols-[4.5rem_1fr]"
                >
                  <span className="font-display text-2xl text-amber/80 transition-colors group-hover:text-amber-bright">
                    {pillar.number}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-parchment md:text-3xl">
                      {t(pillar.title)}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-smoke md:text-base">
                      {t(pillar.copy)}
                    </p>
                  </div>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>

      <BookCtaModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </section>
  );
}
