"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isaacMedia } from "@/lib/media";

type Slide =
  | { id: string; kind: "video"; src: string; poster: string; label: string }
  | { id: string; kind: "image"; src: string; label: string };

const slides: Slide[] = [
  {
    id: "joy-spring",
    kind: "video",
    src: isaacMedia.videos.joySpring,
    poster: isaacMedia.images.reborn1,
    label: "Joy Spring · Afro-jazz",
  },
  {
    id: "residency",
    kind: "video",
    src: isaacMedia.videos.residency,
    poster: isaacMedia.images.reborn2,
    label: "Blackmany Trio · Residency",
  },
  {
    id: "shakara-ep",
    kind: "video",
    src: isaacMedia.videos.shakaraEp,
    poster: isaacMedia.images.reborn4,
    label: "Shakara Don End · EP",
  },
  {
    id: "soundcheck",
    kind: "video",
    src: isaacMedia.videos.soundcheck,
    poster: isaacMedia.images.reborn3,
    label: "Psalm 122 · Soundcheck",
  },
  {
    id: "valence",
    kind: "image",
    src: isaacMedia.images.valencePortrait,
    label: "Valence · On the road",
  },
];

const INTERVAL_MS = 7500;

export function HeroBackgroundSlider() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  const active = slides[index]!;

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="absolute inset-0"
          initial={animate ? { opacity: 0, scale: 1.06 } : false}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {active.kind === "video" ? (
            <video
              className="hero-media absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={active.poster}
            >
              <source src={active.src} type="video/mp4" />
            </video>
          ) : (
            <div
              className="hero-media absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${active.src}')` }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(11,10,9,0.62),rgba(11,10,9,0.78))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(196,165,116,0.18),transparent_55%)]" />
      <div className="grain" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink to-transparent" />

      <div className="absolute bottom-8 right-6 z-20 flex items-center gap-3 md:right-10">
        <p className="hidden text-[0.6rem] uppercase tracking-[0.28em] text-sand/70 sm:block">
          {active.label}
        </p>
        <div className="flex gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show ${slide.label}`}
              onClick={() => setIndex(slideIndex)}
              className="group relative h-8 w-8"
            >
              <span
                className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                  slideIndex === index
                    ? "scale-125 bg-amber-bright"
                    : "bg-parchment/35 group-hover:bg-parchment/70"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
