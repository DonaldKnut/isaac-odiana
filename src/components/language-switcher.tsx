"use client";

import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 border border-line/80 p-0.5 text-[0.65rem] uppercase tracking-[0.16em]",
        className,
      )}
      aria-label={t.language}
    >
      {(["en", "fr"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={cn(
            "cursor-pointer px-2 py-1 transition",
            locale === code
              ? "bg-amber text-ink"
              : "text-smoke hover:text-parchment",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
