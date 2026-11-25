"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type UiButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  icon?: LucideIcon;
  tone?: "primary" | "amber" | "ghost" | "line";
};

export function UiButton({
  className,
  loading,
  disabled,
  icon: Icon,
  tone = "primary",
  children,
  type = "button",
  ...props
}: UiButtonProps) {
  const tones = {
    primary:
      "bg-parchment text-ink hover:bg-amber-bright disabled:opacity-50",
    amber: "bg-amber text-ink hover:bg-amber-bright disabled:opacity-50",
    ghost: "text-smoke hover:text-parchment disabled:opacity-40",
    line: "border border-line text-sand hover:border-amber hover:text-amber-bright disabled:opacity-40",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 px-5 py-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] transition disabled:cursor-not-allowed",
        tones[tone],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : Icon ? (
        <Icon className="h-3.5 w-3.5" aria-hidden />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
