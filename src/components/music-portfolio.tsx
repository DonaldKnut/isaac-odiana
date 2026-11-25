"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Disc3,
  ExternalLink,
  Pause,
  Play,
  X,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { useLocalized } from "@/components/localized";
import type { MusicWorkContent } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type Playable = {
  id: string;
  title: string;
  src: string;
};

function workGallery(work: MusicWorkContent) {
  if (work.images?.length) return work.images;
  return work.image ? [work.image] : [];
}

function livePlatformLinks(work: MusicWorkContent) {
  return (work.platformLinks || []).filter((link) => link.url.trim());
}

function playablesFor(work: MusicWorkContent): Playable[] {
  const tracks = (work.tracks || [])
    .filter((track) => track.title.trim() && track.sampleAudioUrl?.trim())
    .map((track, index) => ({
      id: `${work.id}-track-${index}`,
      title: track.title,
      src: track.sampleAudioUrl!,
    }));

  if (tracks.length) return tracks;

  if (work.sampleAudioUrl?.trim()) {
    return [
      {
        id: `${work.id}-main`,
        title: work.title,
        src: work.sampleAudioUrl,
      },
    ];
  }

  return [];
}

export function MusicPortfolio({ works }: { works: MusicWorkContent[] }) {
  const localize = useLocalized();
  const [active, setActive] = useState<MusicWorkContent | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {works.map((item, index) => {
          const hasSample = playablesFor(item).length > 0;
          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setActive(item)}
              className={cn(
                "group relative aspect-[4/5] cursor-pointer overflow-hidden border border-line text-left",
                item.span?.includes("col-span-2") && "sm:col-span-2 xl:aspect-[8/5]",
              )}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition duration-[900ms] group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/5" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                <span className="inline-flex h-16 w-16 items-center justify-center border border-amber/45 bg-ink/70 text-amber-bright backdrop-blur-md">
                  <Play className="h-6 w-6 translate-x-0.5" strokeWidth={1.5} fill="currentColor" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-amber">
                  <Disc3 className="h-3 w-3" strokeWidth={1.6} />
                  {localize(item.kind)}
                  {hasSample ? " · Sample" : ""}
                </p>
                <h3 className="mt-2 font-display text-3xl leading-tight text-parchment md:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-sand/85">
                  {localize(item.emphasis)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <NowPlayingModal work={active} onClose={() => setActive(null)} />
    </>
  );
}

function NowPlayingModal({
  work,
  onClose,
}: {
  work: MusicWorkContent | null;
  onClose: () => void;
}) {
  const localize = useLocalized();
  const { t } = useLocale();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queueIndex, setQueueIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const queue = useMemo(() => (work ? playablesFor(work) : []), [work]);
  const platforms = work ? livePlatformLinks(work) : [];
  const cover = work ? workGallery(work)[0] || work.image : "";
  const current = queue[queueIndex] ?? null;

  useEffect(() => {
    if (!work) return;
    setQueueIndex(0);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === " ") {
        event.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work, onClose]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    audio.src = current.src;
    audio.load();
    void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [current?.id]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) {
      void audio.play().then(() => setPlaying(true));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = value;
    setProgress(value);
  }

  function selectTrack(index: number) {
    setQueueIndex(index);
  }

  return (
    <AnimatePresence>
      {work ? (
        <motion.div
          className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label={t.close}
            className="absolute inset-0 bg-ink/85 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="now-playing-title"
            className="relative z-10 grid w-full max-w-4xl overflow-hidden border border-line/80 bg-[#0d0c0b] shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:max-h-[88svh] md:grid-cols-[1.05fr_0.95fr]"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative min-h-[280px] md:min-h-[560px]">
              <Image
                src={cover}
                alt={work.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-transparent to-ink/20" />
              <motion.div
                className="absolute bottom-6 left-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber/40 bg-ink/55 backdrop-blur-md"
                animate={{ rotate: playing ? 360 : 0 }}
                transition={
                  playing
                    ? { repeat: Infinity, duration: 8, ease: "linear" }
                    : { duration: 0.4 }
                }
              >
                <Disc3 className="h-9 w-9 text-amber-bright" strokeWidth={1.3} />
              </motion.div>
            </div>

            <div className="flex max-h-[70svh] flex-col md:max-h-none">
              <div className="flex items-start justify-between gap-4 border-b border-line/70 px-5 py-5 md:px-7">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.24em] text-amber">
                    {t.nowPlaying}
                  </p>
                  <h2
                    id="now-playing-title"
                    className="mt-2 font-display text-3xl leading-tight text-parchment md:text-4xl"
                  >
                    {work.title}
                  </h2>
                  <p className="mt-2 text-sm text-smoke">
                    {localize(work.kind)} · {work.year}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer text-smoke transition hover:text-parchment"
                  aria-label={t.close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 md:px-7">
                <p className="text-sm leading-relaxed text-sand/90 md:text-base">
                  {localize(work.emphasis)}
                </p>

                <div className="border border-line/80 bg-ink/60 p-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={togglePlay}
                      disabled={!current}
                      className="inline-flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center border border-amber/50 bg-amber/15 text-amber-bright transition hover:bg-amber/25 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={playing ? t.pause : t.play}
                    >
                      {playing ? (
                        <Pause className="h-5 w-5" strokeWidth={1.6} fill="currentColor" />
                      ) : (
                        <Play className="h-5 w-5 translate-x-0.5" strokeWidth={1.6} fill="currentColor" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-parchment">
                        {current?.title || t.noSampleYet}
                      </p>
                      <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={progress}
                        disabled={!current}
                        onChange={(event) => seek(Number(event.target.value))}
                        className="mt-3 w-full accent-amber"
                      />
                      <div className="mt-1 flex justify-between text-[0.65rem] uppercase tracking-[0.14em] text-smoke">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                  <audio
                    ref={audioRef}
                    preload="metadata"
                    onTimeUpdate={(event) =>
                      setProgress(event.currentTarget.currentTime)
                    }
                    onLoadedMetadata={(event) =>
                      setDuration(event.currentTarget.duration || 0)
                    }
                    onEnded={() => {
                      if (queueIndex < queue.length - 1) {
                        setQueueIndex((value) => value + 1);
                      } else {
                        setPlaying(false);
                      }
                    }}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                  />
                </div>

                {queue.length > 1 ? (
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.2em] text-brass">
                      {t.sampleTracks}
                    </p>
                    <ul className="mt-3 space-y-1">
                      {queue.map((track, index) => {
                        const activeTrack = index === queueIndex;
                        return (
                          <li key={track.id}>
                            <button
                              type="button"
                              onClick={() => selectTrack(index)}
                              className={cn(
                                "flex w-full cursor-pointer items-center justify-between gap-3 border px-3 py-3 text-left transition",
                                activeTrack
                                  ? "border-amber/40 bg-amber/10 text-parchment"
                                  : "border-transparent text-sand hover:border-line hover:bg-ink/50",
                              )}
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                <span className="w-5 text-[0.65rem] text-smoke">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="truncate text-sm">{track.title}</span>
                              </span>
                              {activeTrack && playing ? (
                                <span className="flex gap-0.5">
                                  <span className="h-3 w-0.5 animate-pulse bg-amber-bright" />
                                  <span className="h-3 w-0.5 animate-pulse bg-amber-bright [animation-delay:120ms]" />
                                  <span className="h-3 w-0.5 animate-pulse bg-amber-bright [animation-delay:240ms]" />
                                </span>
                              ) : (
                                <Play className="h-3.5 w-3.5 opacity-50" strokeWidth={1.6} />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}

                {platforms.length > 0 ? (
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.2em] text-amber">
                      {t.listenOn}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {platforms.map((link) => (
                        <a
                          key={`${link.label}-${link.url}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-line px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-sand transition hover:border-amber/45 hover:text-amber-bright"
                        >
                          {link.label}
                          <ExternalLink className="h-3 w-3" strokeWidth={1.6} />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
