import Image from "next/image";
import Link from "next/link";
import { brandLogo } from "@/lib/media";
import { cn } from "@/lib/utils";

const sizes = {
  sm: {
    className: "h-6 w-auto max-w-[40vw] min-[360px]:h-7 sm:h-8 md:h-9",
    width: 200,
    height: 52,
  },
  md: {
    className: "h-7 w-auto max-w-[44vw] min-[360px]:h-9 sm:h-11 md:h-12",
    width: 280,
    height: 74,
  },
  lg: {
    className: "h-8 w-auto max-w-[42vw] min-[360px]:h-10 sm:h-12 md:h-14 lg:h-16",
    width: 340,
    height: 90,
  },
} as const;

export function BrandLogo({
  href = "/",
  size = "md",
  className,
  priority,
  onClick,
}: {
  href?: string | null;
  size?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}) {
  const dim = sizes[size];
  const image = (
    <Image
      src={brandLogo}
      alt="Isaac Odiana"
      width={dim.width}
      height={dim.height}
      priority={priority}
      className={cn(dim.className, "object-contain object-left", className)}
    />
  );

  if (!href) return image;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex min-w-0 max-w-full shrink items-center"
      aria-label="Isaac Odiana"
    >
      {image}
    </Link>
  );
}
