import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Figtree } from "next/font/google";
import { LocaleProvider } from "@/components/locale-provider";
import { PwaRegister } from "@/components/pwa-register";
import { ToastProvider } from "@/components/toast-provider";
import { getRequestLocale } from "@/lib/i18n/server";
import { brandMonogram } from "@/lib/media";
import "./globals.css";

const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Isaac Odiana",
    template: "%s · Isaac Odiana",
  },
  description:
    "Official home of Isaac Odiana — music, beats, jazz, books, podcasts, merchandise and tutoring.",
  applicationName: "Isaac Odiana Studio",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Isaac Odiana",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: brandMonogram, type: "image/png" },
    ],
    apple: [{ url: brandMonogram }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getRequestLocale();

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-ink text-parchment">
        <LocaleProvider initialLocale={locale}>
          <ToastProvider>
            {children}
            <PwaRegister />
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
