import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://isaacodiana.com";

export function absoluteUrl(path = "/") {
  try {
    return new URL(path, appUrl).toString();
  } catch {
    return `${appUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }
}

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image: string;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} · Isaac Odiana`,
      description,
      siteName: "Isaac Odiana Studio",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Isaac Odiana`,
      description,
      images: [ogImage],
    },
  };
}
