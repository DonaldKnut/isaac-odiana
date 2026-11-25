"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocalized } from "@/components/localized";
import type { MusicPageContent } from "@/lib/cms/types";

export function MusicListeningRoom({
  content,
}: {
  content: MusicPageContent["listening"];
}) {
  const t = useLocalized();
  const images = content.images.length ? content.images : [""];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    if (images.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-[50svh] overflow-hidden border-t border-line">
      <AnimatePresence mode="sync">
        <motion.div
          key={images[index] || "empty"}
          initial={animate ? { opacity: 0, scale: 1.04 } : false}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {images[index] ? (
            <Image
              src={images[index]}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative z-10 mx-auto flex min-h-[50svh] max-w-7xl flex-col justify-center px-6 py-20 md:px-10">
        <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
          <Headphones className="h-3.5 w-3.5" strokeWidth={1.6} />
          {t(content.eyebrow)}
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl text-parchment md:text-6xl">
          {t(content.title)}
        </h2>
        {images.length > 1 ? (
          <div className="mt-10 flex gap-2">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 w-8 cursor-pointer transition ${
                  i === index ? "bg-amber" : "bg-parchment/25 hover:bg-parchment/50"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
