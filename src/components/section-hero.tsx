import Image from "next/image";
import type { LucideIcon } from "lucide-react";

type SectionHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  align?: "left" | "center";
  icon?: LucideIcon;
};

export function SectionHero({
  eyebrow,
  title,
  description,
  image,
  align = "left",
  icon: Icon,
}: SectionHeroProps) {
  return (
    <section className="relative isolate min-h-[52svh] overflow-hidden border-b border-line pt-24 md:min-h-[58svh] md:pt-28">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(11,10,9,0.82),rgba(11,10,9,0.45)_55%,rgba(11,10,9,0.75))]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(198,161,91,0.18),transparent_50%)]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,165,116,0.16),transparent_50%),linear-gradient(180deg,#14110f,#0b0a09)]" />
      )}
      <div className="grain opacity-25" />

      <div
        className={`relative z-10 mx-auto flex min-h-[40svh] max-w-7xl flex-col justify-end px-6 py-16 md:min-h-[46svh] md:px-10 md:py-24 ${
          align === "center" ? "items-center text-center" : ""
        }`}
      >
        <p className="animate-rise inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
          {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={1.7} /> : null}
          {eyebrow}
        </p>
        <h1 className="animate-rise-delay-1 mt-4 max-w-4xl font-display text-5xl tracking-tight text-parchment md:text-7xl lg:text-8xl">
          {title}
        </h1>
        <p
          className={`animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-sand/90 md:text-lg ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
