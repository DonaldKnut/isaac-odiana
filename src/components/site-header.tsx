"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarHeart,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  Megaphone,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { BookCtaModal } from "@/components/book-cta-modal";
import { BrandLogo } from "@/components/brand-logo";
import { useCart } from "@/components/cart-provider";
import { siteNavIcons } from "@/components/illustrations";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/components/locale-provider";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { StudioPreviewModal } from "@/components/studio-preview-modal";
import { studioMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

type StudioPreview = "announcements" | "tutoring" | null;

export function SiteHeader({ adminOffset = false }: { adminOffset?: boolean }) {
  const { count, openDrawer, drawerOpen } = useCart();
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [studioPreview, setStudioPreview] = useState<StudioPreview>(null);
  const [cartReady, setCartReady] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaCloseTimer = useRef<number | null>(null);

  useEffect(() => {
    setCartReady(true);
  }, []);

  function openMega() {
    if (megaCloseTimer.current) {
      window.clearTimeout(megaCloseTimer.current);
      megaCloseTimer.current = null;
    }
    setMegaOpen(true);
  }

  function scheduleCloseMega() {
    if (megaCloseTimer.current) window.clearTimeout(megaCloseTimer.current);
    megaCloseTimer.current = window.setTimeout(() => {
      setMegaOpen(false);
      megaCloseTimer.current = null;
    }, 140);
  }

  useEffect(() => {
    return () => {
      if (megaCloseTimer.current) window.clearTimeout(megaCloseTimer.current);
    };
  }, []);

  const links = [
    { href: "/music", label: t.nav.music },
    { href: "/books", label: t.nav.books },
    { href: "/podcast", label: t.nav.podcast },
    { href: "/shop", label: t.nav.shop },
  ];

  const mobileLinks = [
    { href: "/music", label: t.nav.music, icon: siteNavIcons.music },
    { href: "/books", label: t.nav.books, icon: siteNavIcons.books },
    { href: "/podcast", label: t.nav.podcast, icon: siteNavIcons.podcast },
    { href: "/shop", label: t.nav.shop, icon: siteNavIcons.shop },
  ];

  const mobileStudio = [
    {
      key: "announcements" as const,
      label: t.nav.announcements,
      icon: Megaphone,
    },
    {
      key: "tutoring" as const,
      label: t.nav.tutoring,
      icon: siteNavIcons.tutoring,
    },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!megaRef.current?.contains(event.target as Node)) {
        setMegaOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMegaOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function openBook() {
    setMenuOpen(false);
    setMegaOpen(false);
    setBookOpen(true);
  }

  const hideBottomNav =
    menuOpen || bookOpen || drawerOpen || Boolean(studioPreview);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 z-50 transition-all duration-500",
          adminOffset ? "top-10" : "top-0",
          scrolled || menuOpen || megaOpen
            ? "border-b border-line bg-ink/90 py-0 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 min-[360px]:px-4 sm:px-6 sm:py-4 md:px-10 md:py-5">
          <BrandLogo
            size="lg"
            priority
            className="min-w-0"
            onClick={() => {
              setMenuOpen(false);
              setMegaOpen(false);
            }}
          />

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="site-link text-[0.7rem] font-medium uppercase tracking-[0.22em] text-sand/80 transition-colors hover:text-parchment"
              >
                {link.label}
              </Link>
            ))}

            <div
              ref={megaRef}
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={scheduleCloseMega}
              onFocusCapture={openMega}
              onBlurCapture={(event) => {
                if (!megaRef.current?.contains(event.relatedTarget as Node)) {
                  scheduleCloseMega();
                }
              }}
            >
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-haspopup="true"
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.22em] transition-colors",
                  megaOpen
                    ? "text-amber-bright"
                    : "text-sand/80 hover:text-parchment",
                )}
              >
                {t.nav.studio}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    megaOpen && "rotate-180",
                  )}
                  strokeWidth={1.6}
                />
              </button>

              <AnimatePresence>
                {megaOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 top-full z-50 w-[min(92vw,34rem)] -translate-x-1/2 border border-line bg-ink/98 p-5 pt-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl before:absolute before:inset-x-0 before:-top-5 before:h-5 before:content-['']"
                  >
                    <p className="text-[0.6rem] uppercase tracking-[0.22em] text-amber">
                      {t.nav.studio}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMegaOpen(false);
                          setStudioPreview("announcements");
                        }}
                        className="group cursor-pointer border border-line bg-ink-soft/50 p-4 text-left transition hover:border-amber/40"
                      >
                        <Megaphone
                          className="h-4 w-4 text-amber"
                          strokeWidth={1.6}
                        />
                        <p className="mt-3 font-display text-xl text-parchment group-hover:text-amber-bright">
                          {t.nav.announcements}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-smoke">
                          {t.pages.announcements.description}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMegaOpen(false);
                          setStudioPreview("tutoring");
                        }}
                        className="group cursor-pointer border border-line bg-ink-soft/50 p-4 text-left transition hover:border-amber/40"
                      >
                        <Sparkles
                          className="h-4 w-4 text-amber"
                          strokeWidth={1.6}
                        />
                        <p className="mt-3 font-display text-xl text-parchment group-hover:text-amber-bright">
                          {t.nav.tutoring}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-smoke">
                          {t.pages.tutoring.description}
                        </p>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={openBook}
                      className="mt-4 inline-flex cursor-pointer items-center gap-2 border border-amber/40 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.18em] text-amber-bright transition hover:bg-amber/10"
                    >
                      <CalendarHeart className="h-3.5 w-3.5" strokeWidth={1.6} />
                      {t.nav.bookSession}
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 min-[360px]:gap-2 sm:gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            {adminOffset ? (
              <Link
                href="/admin"
                className="hidden items-center gap-1.5 border border-amber/35 px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-amber-bright transition hover:bg-amber/10 md:inline-flex"
              >
                <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={1.6} />
                Admin
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setMegaOpen(false);
                openDrawer();
              }}
              className="hidden cursor-pointer items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-sand/90 transition hover:text-parchment md:inline-flex"
              aria-haspopup="dialog"
            >
              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span className="hidden lg:inline">{t.nav.cart}</span>
              {cartReady && count > 0 ? (
                <span className="text-amber-bright">({count})</span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={openBook}
              className="hidden cursor-pointer items-center gap-2 border border-amber/40 px-3 py-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-amber-bright transition-colors hover:border-amber-bright hover:bg-amber/10 sm:inline-flex sm:px-4"
            >
              <CalendarHeart className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span className="hidden min-[420px]:inline">{t.nav.book}</span>
            </button>
            <button
              type="button"
              className={cn(
                "relative inline-flex h-9 w-9 cursor-pointer items-center justify-center border text-parchment transition duration-300 min-[360px]:h-10 min-[360px]:w-10 lg:hidden",
                menuOpen
                  ? "border-amber/50 bg-amber/10 text-amber-bright"
                  : "border-line hover:border-parchment/40",
              )}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span className="sr-only">{t.nav.menu}</span>
              <span className="relative block h-3.5 w-[18px]" aria-hidden>
                <span
                  className={cn(
                    "absolute left-0 block h-[1.5px] w-full origin-center rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    menuOpen ? "top-[6px] rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[6px] block h-[1.5px] w-full rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    menuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-[1.5px] w-full origin-center rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    menuOpen ? "top-[6px] -rotate-45" : "top-[12px]",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className={cn(
              "fixed inset-0 z-40 overflow-y-auto bg-ink/95 backdrop-blur-md lg:hidden",
              adminOffset ? "pt-[7.5rem]" : "pt-20",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <nav className="flex min-h-full flex-col gap-2 px-4 pb-28 min-[360px]:px-6">
              <div className="mb-4">
                <LanguageSwitcher />
              </div>
              {mobileLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 border-b border-line py-3.5 font-display text-2xl text-parchment min-[360px]:py-4 min-[360px]:text-3xl"
                    >
                      <Icon
                        className="h-5 w-5 shrink-0 text-amber"
                        strokeWidth={1.5}
                      />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <p className="mt-6 text-[0.65rem] uppercase tracking-[0.22em] text-amber">
                {t.nav.studio}
              </p>
              {mobileStudio.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * (mobileLinks.length + index) }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setStudioPreview(item.key);
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 border-b border-line py-3.5 text-left font-display text-2xl text-parchment min-[360px]:py-4 min-[360px]:text-3xl"
                    >
                      <Icon
                        className="h-5 w-5 shrink-0 text-amber"
                        strokeWidth={1.5}
                      />
                      {item.label}
                    </button>
                  </motion.div>
                );
              })}
              <button
                type="button"
                onClick={openBook}
                className="mt-6 inline-flex w-fit cursor-pointer border border-amber/40 px-5 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-amber-bright"
              >
                {t.nav.bookSession}
              </button>
              {adminOffset ? (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 inline-flex w-fit items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-amber-bright"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {t.admin.nav.overview}
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 inline-flex w-fit items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-sand/70 transition hover:text-amber-bright"
                >
                  <LogIn className="h-3.5 w-3.5" strokeWidth={1.6} />
                  {t.nav.login}
                </Link>
              )}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!hideBottomNav ? (
        <MobileBottomNav isAdmin={adminOffset} />
      ) : null}
      <BookCtaModal open={bookOpen} onClose={() => setBookOpen(false)} />

      <StudioPreviewModal
        open={studioPreview === "announcements"}
        onClose={() => setStudioPreview(null)}
        eyebrow={t.nav.studio}
        title={t.nav.announcements}
        body={t.pages.announcements.description}
        image={studioMedia.vinyl}
        primaryLabel={t.pages.announcements.viewAll}
        primaryHref="/announcements"
      />
      <StudioPreviewModal
        open={studioPreview === "tutoring"}
        onClose={() => setStudioPreview(null)}
        eyebrow={t.nav.studio}
        title={t.nav.tutoring}
        body={t.roomAims["/tutoring"]}
        image={studioMedia.mentorship}
        primaryLabel={t.nav.bookSession}
        onPrimary={() => setBookOpen(true)}
        secondaryLabel={t.openFullPage}
        secondaryHref="/tutoring"
      />
    </>
  );
}
