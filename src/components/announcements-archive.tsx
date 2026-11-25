"use client";

import { AnnouncementArchiveCard } from "@/components/announcement-cards";
import { useLocale } from "@/components/locale-provider";
import { useLocalized } from "@/components/localized";
import type { AnnouncementsBundle } from "@/lib/cms/types";

export function AnnouncementsArchive({
  content,
}: {
  content: AnnouncementsBundle;
}) {
  const t = useLocalized();
  const { t: ui } = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
      <p className="max-w-2xl text-base leading-relaxed text-smoke md:text-lg">
        {t(content.body)}
      </p>

      <div className="mt-12 space-y-10">
        {content.items.map((item) => (
          <AnnouncementArchiveCard key={item.id} item={item} />
        ))}
        {content.items.length === 0 ? (
          <p className="border border-dashed border-line px-4 py-10 text-center text-smoke">
            {ui.pages.announcements.empty}
          </p>
        ) : null}
      </div>
    </section>
  );
}
