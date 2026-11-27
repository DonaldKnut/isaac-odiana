"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isaacMedia } from "@/lib/media";

type Slide =
  | { id: string; kind: "video"; src: string; poster: string }
  | { id: string; kind: "image"; src: string };

const slides: Slide[] = [
  {
    id: "nardis",
    kind: "video",
    src: isaacMedia.videos.nardis,
    poster: isaacMedia.images.reborn1,
  },
  {
    id: "valence-portrait",
    kind: "image",
    src: isaacMedia.images.valencePortrait,
  },
  {
    id: "joy-spring",
    kind: "video",
    src: isaacMedia.videos.joySpring,
    poster: isaacMedia.images.reborn2,
  },
  {
    id: "reborn-art",
    kind: "image",
    src: isaacMedia.images.reborn4,
  },
];

export function AdminPromoSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  const active = slides[index]!;

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {active.kind === "video" ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
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
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${active.src}')` }}
            />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(11,10,9,0.35),rgba(11,10,9,0.88))]" />
      <div className="grain" />
    </div>
  );
}
