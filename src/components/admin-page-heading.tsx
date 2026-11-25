import type { LucideIcon } from "lucide-react";

export function AdminPageHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-amber">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
        Admin
      </p>
      <h1 className="mt-3 font-display text-4xl text-parchment">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm text-smoke">{description}</p>
      ) : null}
    </div>
  );
}
