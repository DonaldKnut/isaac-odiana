"use client";

import { Disc3 } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

export function MusicPageChrome() {
  const { t } = useLocale();

  return (
    <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-amber">
          <Disc3 className="h-3.5 w-3.5" strokeWidth={1.6} />
          {t.selectedWorks}
        </p>
        <h2 className="mt-3 font-display text-3xl text-parchment md:text-4xl">
          {t.visualSetList}
        </h2>
      </div>
      <p className="max-w-md text-sm leading-relaxed text-smoke">
        {t.musicIntro}
      </p>
    </div>
  );
}
