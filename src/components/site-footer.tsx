"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { siteNavIcons } from "@/components/illustrations";
import { useLocale } from "@/components/locale-provider";
import { useLocalized } from "@/components/localized";
import { studioMedia } from "@/lib/media";
import type { SiteSettings } from "@/lib/cms/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { t } = useLocale();
  const localize = useLocalized();

  const links = [
    { href: "/music", label: t.nav.music, icon: siteNavIcons.music },
    { href: "/books", label: t.nav.books, icon: siteNavIcons.books },
    { href: "/podcast", label: t.nav.podcast, icon: siteNavIcons.podcast },
    { href: "/shop", label: t.nav.shop, icon: siteNavIcons.shop },
    { href: "/tutoring", label: t.nav.tutoring, icon: siteNavIcons.tutoring },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <Image
        src={studioMedia.vinyl}
        alt=""
        fill
        className="object-cover opacity-20"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/80" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-3 py-8 pb-28 min-[360px]:gap-8 min-[360px]:px-5 min-[360px]:py-10 md:flex-row md:items-center md:justify-between md:px-10 md:pb-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <BrandLogo size="md" />
          <span className="text-[0.6rem] uppercase tracking-[0.28em] text-brass">
            {localize(settings.brandTagline)}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.65rem] uppercase tracking-[0.2em] text-smoke">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 transition hover:text-parchment"
              >
                <Icon className="h-3 w-3 text-brass/70" strokeWidth={1.6} />
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            className="text-sand/60 transition hover:text-amber-bright"
          >
            {t.nav.admin}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
