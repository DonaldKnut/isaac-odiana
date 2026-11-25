"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Slide =
  | { id: string; kind: "video"; src: string; poster: string; label: string }
  | { id: string; kind: "image"; src: string; label: string };

const slides: Slide[] = [
  {
    id: "rehearsal",
    kind: "video",
    src: "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=2400&q=80",
    label: "Studio rehearsal",
  },
  {
    id: "crowd",
    kind: "video",
    src: "https://videos.pexels.com/video-files/2022395/2022395-uhd_2560_1440_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2400&q=80",
    label: "Live energy",
  },
  {
    id: "vinyl-spin",
    kind: "video",
    src: "https://videos.pexels.com/video-files/3209822/3209822-uhd_2560_1440_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=2400&q=80",
    label: "Night records",
  },
  {
    id: "present",
    kind: "image",
    src: "https://images.unsplash.com/photo-1513201099705-ce9226a76f90?auto=format&fit=crop&w=2400&q=80",
    label: "The gift of craft",
  },
];

const INTERVAL_MS = 7000;

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
