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
                <span className="relative inline-flex h-16 w-16 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full border border-amber/40 opacity-40 [animation-duration:2.2s]" />
                  <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-amber/45 bg-ink/70 text-amber-bright shadow-[0_0_28px_rgba(212,175,105,0.28)] backdrop-blur-md transition duration-500 group-hover:scale-105">
                    <Play
                      className="h-6 w-6 translate-x-0.5 transition duration-500 group-hover:scale-110"
                      strokeWidth={1.5}
                      fill="currentColor"
                    />
                  </span>
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
  const scrubbingRef = useRef(false);
  const [queueIndex, setQueueIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const queue = useMemo(() => (work ? playablesFor(work) : []), [work]);
  const platforms = work ? livePlatformLinks(work) : [];
  const gallery = work ? workGallery(work) : [];
  const cover = gallery[0] || work?.image || "";
  const current = queue[queueIndex] ?? null;

  useEffect(() => {
    if (!work) return;
    setQueueIndex(0);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
    scrubbingRef.current = false;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === " ") {
        event.preventDefault();
        void togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      audioRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work, onClose]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    scrubbingRef.current = false;
    setProgress(0);
    setDuration(0);
    audio.src = current.src;
    audio.load();
    void audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [current?.id]);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !current) return;
    try {
      if (audio.paused) {
        setPlaying(true);
        await audio.play();
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch {
      setPlaying(false);
    }
  }

  function seekTo(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    const total = Number.isFinite(duration) && duration > 0 ? duration : audio.duration;
    if (!Number.isFinite(total) || total <= 0) return;
    const next = Math.min(Math.max(value, 0), total);
    audio.currentTime = next;
    setProgress(next);
  }

  function selectTrack(index: number) {
    setQueueIndex(index);
  }

  const progressPct =
    duration > 0 ? Math.min(100, Math.max(0, (progress / duration) * 100)) : 0;

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
            className="relative z-10 flex w-full max-w-4xl max-h-[92svh] flex-col overflow-hidden border border-line/80 bg-[#0d0c0b] shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:grid md:grid-cols-[1.05fr_0.95fr] md:grid-rows-1"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative h-[38vw] max-h-[240px] min-h-[160px] shrink-0 md:h-auto md:max-h-none md:min-h-0">
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
                className="absolute bottom-5 left-5 flex h-16 w-16 items-center justify-center rounded-full border border-amber/40 bg-ink/55 backdrop-blur-md md:bottom-6 md:left-6 md:h-20 md:w-20"
                animate={{ rotate: playing ? 360 : 0 }}
                transition={
                  playing
                    ? { repeat: Infinity, duration: 8, ease: "linear" }
                    : { duration: 0.4 }
                }
              >
                <Disc3 className="h-7 w-7 text-amber-bright md:h-9 md:w-9" strokeWidth={1.3} />
              </motion.div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line/70 px-5 py-4 md:px-7 md:py-5">
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

              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5 md:px-7">
                <p className="text-sm leading-relaxed text-sand/90 md:text-base">
                  {localize(work.emphasis)}
                </p>
                {work.description ? (
                  <p className="text-sm leading-relaxed text-smoke md:text-[0.95rem]">
                    {localize(work.description)}
                  </p>
                ) : null}

                <div className="relative overflow-hidden border border-line/80 bg-gradient-to-br from-amber/[0.07] via-ink/70 to-ink/90 p-4 md:p-5">
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-amber/20 blur-3xl"
                    animate={{
                      opacity: playing ? [0.25, 0.55, 0.25] : 0.12,
                      scale: playing ? [1, 1.25, 1] : 1,
                    }}
                    transition={
                      playing
                        ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.45 }
                    }
                  />

                  <div className="relative flex items-center gap-4 md:gap-5">
                    <div className="relative shrink-0">
                      {current ? (
                        <>
                          <motion.span
                            aria-hidden
                            className="absolute inset-0 rounded-full border border-amber/35"
                            animate={
                              playing
                                ? { scale: [1, 1.55], opacity: [0.55, 0] }
                                : { scale: [1, 1.35], opacity: [0.4, 0] }
                            }
                            transition={{
                              duration: playing ? 1.6 : 2.4,
                              repeat: Infinity,
                              ease: "easeOut",
                            }}
                          />
                          <motion.span
                            aria-hidden
                            className="absolute inset-0 rounded-full border border-amber-bright/25"
                            animate={
                              playing
                                ? { scale: [1, 1.85], opacity: [0.35, 0] }
                                : { scale: [1, 1.55], opacity: [0.28, 0] }
                            }
                            transition={{
                              duration: playing ? 1.6 : 2.4,
                              repeat: Infinity,
                              ease: "easeOut",
                              delay: 0.35,
                            }}
                          />
                        </>
                      ) : null}

                      <motion.button
                        type="button"
                        onClick={() => void togglePlay()}
                        disabled={!current}
                        whileHover={current ? { scale: 1.06 } : undefined}
                        whileTap={current ? { scale: 0.92 } : undefined}
                        className={cn(
                          "relative inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-amber/55 bg-gradient-to-br from-amber/30 via-amber/15 to-ink text-amber-bright disabled:cursor-not-allowed disabled:opacity-40",
                          playing
                            ? "shadow-[0_0_28px_4px_rgba(212,175,105,0.35)]"
                            : "shadow-[0_0_18px_0_rgba(212,175,105,0.18)]",
                        )}
                        aria-label={playing ? t.pause : t.play}
                      >
                        <motion.span
                          key={playing ? "pause" : "play"}
                          initial={{ scale: 0.55, opacity: 0 }}
                          animate={{ scale: playing ? 1 : [1, 1.1, 1], opacity: 1 }}
                          transition={
                            playing
                              ? { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                              : {
                                  scale: {
                                    duration: 1.8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  },
                                  opacity: { duration: 0.18 },
                                }
                          }
                          className={cn("inline-flex", !playing && "translate-x-0.5")}
                        >
                          {playing ? (
                            <Pause className="h-6 w-6" strokeWidth={1.5} fill="currentColor" />
                          ) : (
                            <Play className="h-6 w-6" strokeWidth={1.5} fill="currentColor" />
                          )}
                        </motion.span>
                      </motion.button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <p className="truncate text-sm text-parchment md:text-base">
                          {current?.title || t.noSampleYet}
                        </p>
                        {playing ? (
                          <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
                            {[0.55, 1, 0.7, 0.9].map((peak, index) => (
                              <motion.span
                                key={index}
                                className="w-[2px] rounded-full bg-amber-bright"
                                animate={{ height: ["4px", `${peak * 14}px`, "4px"] }}
                                transition={{
                                  duration: 0.55 + index * 0.12,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: index * 0.08,
                                }}
                              />
                            ))}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3">
                        <div className="relative flex h-8 items-center">
                          <div className="relative h-1.5 w-full rounded-full bg-line/70">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber via-amber-bright to-amber"
                              style={{ width: `${progressPct}%` }}
                            />
                            {playing ? (
                              <motion.div
                                aria-hidden
                                className="pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-parchment/35 to-transparent"
                                animate={{ left: ["-20%", "120%"] }}
                                transition={{
                                  duration: 1.8,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            ) : null}
                            <span
                              aria-hidden
                              className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-amber-bright/80 bg-parchment shadow-[0_0_12px_rgba(212,175,105,0.45)]"
                              style={{ left: `calc(${progressPct}% - 7px)` }}
                            />
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={duration > 0 ? duration : 1}
                            step={0.05}
                            value={duration > 0 ? progress : 0}
                            disabled={!current || duration <= 0}
                            onPointerDown={() => {
                              scrubbingRef.current = true;
                            }}
                            onPointerUp={(event) => {
                              scrubbingRef.current = false;
                              seekTo(Number(event.currentTarget.value));
                            }}
                            onPointerCancel={() => {
                              scrubbingRef.current = false;
                            }}
                            onInput={(event) => {
                              scrubbingRef.current = true;
                              setProgress(Number(event.currentTarget.value));
                            }}
                            onChange={(event) => {
                              seekTo(Number(event.currentTarget.value));
                            }}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                            aria-label="Seek"
                          />
                        </div>
                        <div className="mt-1 flex justify-between text-[0.65rem] uppercase tracking-[0.14em] text-smoke">
                          <span>{formatTime(progress)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <audio
                    ref={audioRef}
                    preload="auto"
                    onTimeUpdate={(event) => {
                      if (scrubbingRef.current) return;
                      setProgress(event.currentTarget.currentTime);
                    }}
                    onLoadedMetadata={(event) => {
                      const next = event.currentTarget.duration;
                      setDuration(Number.isFinite(next) && next > 0 ? next : 0);
                    }}
                    onDurationChange={(event) => {
                      const next = event.currentTarget.duration;
                      setDuration(Number.isFinite(next) && next > 0 ? next : 0);
                    }}
                    onEnded={() => {
                      if (queueIndex < queue.length - 1) {
                        setQueueIndex((value) => value + 1);
                      } else {
                        setPlaying(false);
                      }
                    }}
                    onPlaying={() => setPlaying(true)}
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

                {work.highlights?.length ? (
                  <ul className="space-y-2 border-t border-line/60 pt-5">
                    {work.highlights.map((item, index) => (
                      <li
                        key={`${work.id}-highlight-${index}`}
                        className="flex gap-3 text-sm text-sand/90"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber" />
                        <span>{localize(item)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {gallery.length > 1 ? (
                  <div className="grid grid-cols-3 gap-2 pb-1">
                    {gallery.slice(0, 3).map((src) => (
                      <div
                        key={src}
                        className="relative aspect-[4/5] overflow-hidden border border-line/70"
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {platforms.length > 0 ? (
                  <div className="pb-2">
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
