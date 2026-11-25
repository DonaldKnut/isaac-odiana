"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminPromoSlider } from "@/components/admin-promo-slider";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/components/locale-provider";

export function AdminLoginView() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-ink text-parchment">
      <aside className="relative hidden overflow-hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-[52%]">
        <AdminPromoSlider />
        <div className="relative z-10 flex h-full flex-col justify-between px-12 py-14 xl:px-16">
          <div className="flex items-center justify-between gap-4">
            <BrandLogo size="lg" priority />
            <LanguageSwitcher />
          </div>

          <div className="max-w-md">
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-amber">
              {t.auth.studioControl}
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-parchment xl:text-6xl">
              {t.auth.panelTitle}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-sand/85">
              {t.auth.panelBody}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-smoke">
              {t.auth.footerTags}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-amber-bright transition hover:text-amber"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t.auth.backHome}
            </Link>
          </div>
        </div>
      </aside>

      <section className="relative flex min-h-screen items-center justify-center px-3 py-10 min-[360px]:px-5 sm:px-8 md:px-12 lg:ml-[52%] lg:px-12 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(198,161,91,0.08),transparent_45%)]" />
        <div className="relative w-full max-w-md">
          <div className="mb-6 flex items-center justify-between gap-2 min-[360px]:mb-8 sm:mb-10 sm:gap-4">
            <Link
              href="/"
              className="inline-flex min-w-0 items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.16em] text-sand transition hover:text-amber-bright min-[360px]:gap-2 min-[360px]:text-[0.65rem] min-[360px]:tracking-[0.2em]"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{t.auth.backHome}</span>
            </Link>
            <LanguageSwitcher />
          </div>

          <div className="mb-6 min-[360px]:mb-8 lg:hidden">
            <BrandLogo size="md" priority />
          </div>

          <p className="text-[0.6rem] uppercase tracking-[0.24em] text-amber min-[360px]:text-[0.7rem] min-[360px]:tracking-[0.3em]">
            {t.auth.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-parchment min-[360px]:mt-4 min-[360px]:text-4xl md:text-5xl">
            {t.auth.signIn}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-smoke min-[360px]:mt-4">
            {t.auth.signInBody}
          </p>

          <AdminLoginForm />

          <p className="mt-8 text-xs leading-relaxed text-smoke/80 min-[360px]:mt-10">
            {t.auth.protectedNote}{" "}
            <Link
              href="/"
              className="text-sand underline-offset-4 transition hover:text-amber-bright hover:underline"
            >
              {t.auth.returnToSite}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
