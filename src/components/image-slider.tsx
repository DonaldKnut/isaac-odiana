"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function ImageSlider({
  images,
  alt,
  className = "aspect-[3/4]",
  sizes = "(max-width: 768px) 100vw, 40vw",
  showDots = true,
  onMediaClick,
}: {
  images: string[];
  alt: string;
  className?: string;
  sizes?: string;
  showDots?: boolean;
  onMediaClick?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length > 0 ? images : [];

  if (safeImages.length === 0) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-ink-soft text-smoke ${className}`}
      >
        No image
      </div>
    );
  }

  const go = (next: number) => {
    setIndex((current) => (current + next + safeImages.length) % safeImages.length);
  };

  return (
    <div className={`group relative overflow-hidden bg-ink-soft ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={safeImages[index]}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {onMediaClick ? (
            <button
              type="button"
              aria-label={alt}
              onClick={onMediaClick}
              className="absolute inset-0 cursor-pointer"
            >
              <Image
                src={safeImages[index]!}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-cover"
                sizes={sizes}
              />
            </button>
          ) : (
            <Image
              src={safeImages[index]!}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover"
              sizes={sizes}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {safeImages.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 border border-parchment/20 bg-ink/50 px-2 py-1 text-parchment opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 border border-parchment/20 bg-ink/50 px-2 py-1 text-parchment opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
          >
            ›
          </button>
          {showDots ? (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {safeImages.map((image, imageIndex) => (
                <button
                  key={`${image}-${imageIndex}`}
                  type="button"
                  aria-label={`Image ${imageIndex + 1}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIndex(imageIndex);
                  }}
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    imageIndex === index ? "bg-amber-bright" : "bg-parchment/35"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
