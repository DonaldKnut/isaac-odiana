"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Slide =
  | { id: string; kind: "video"; src: string; poster: string }
  | { id: string; kind: "image"; src: string };

const slides: Slide[] = [
  {
    id: "v1",
    kind: "video",
    src: "https://videos.pexels.com/video-files/2022395/2022395-uhd_2560_1440_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "img1",
    kind: "image",
    src: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "v2",
    kind: "video",
    src: "https://videos.pexels.com/video-files/3209822/3209822-uhd_2560_1440_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "img2",
    kind: "image",
    src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1800&q=80",
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
