"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { CmsEditableImage } from "@/components/cms-editable-image";
import { Reveal } from "@/components/reveal";
import { useLocalized } from "@/components/localized";
import type { HomeFaqContent } from "@/lib/cms/types";

export function HomeFaq({ content }: { content: HomeFaqContent }) {
  const t = useLocalized();
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <section className="border-t border-line bg-ink">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative hidden min-h-[640px] overflow-hidden lg:block">
          <CmsEditableImage
            src={content.sideImage}
            alt=""
            fill
            target={{ kind: "faq.side" }}
            className="object-cover"
            sizes="40vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-ink/80" />
          <div className="pointer-events-none absolute bottom-10 left-10 right-10">
            <p className="mt-3 font-display text-4xl text-parchment">
              {t(content.sideCaption)}
            </p>
          </div>
        </div>

        <div className="px-6 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
              <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.6} />
              {t(content.eyebrow)}
            </p>
            <h2 className="mt-5 font-display text-4xl text-parchment md:text-5xl">
              {t(content.title)}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-smoke md:text-lg">
              {t(content.body)}
            </p>
          </Reveal>

          <div className="mt-12 border-t border-line">
            {content.items.map((faq, index) => {
              const open = openId === index;
              const question = t(faq.question);
              return (
                <Reveal key={`${question}-${index}`} delay={index * 0.04}>
                  <div className="border-b border-line">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenId(open ? null : index)}
                      className="flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-left transition-colors hover:text-amber-bright"
                    >
                      <span className="font-display text-xl text-parchment md:text-2xl">
                        {question}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-1 text-2xl leading-none text-amber"
                        aria-hidden
                      >
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-3xl pb-7 text-sm leading-relaxed text-smoke md:text-base">
                            {t(faq.answer)}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
