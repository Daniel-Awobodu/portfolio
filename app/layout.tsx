import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { site } from "@/lib/site-config";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

/**
 * Both are loaded as variable fonts — one file each, the full 400–600 range we
 * use, and Fraunces keeps its `opsz` axis so `font-optical-sizing: auto` in
 * globals.css actually does something at display sizes.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    // Replace /public/og.png (1200×630) with a real share card when you can.
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  /**
   * Declaring BOTH schemes is what stops Android Chrome and Samsung Internet
   * applying their "force dark" filter on top of our own dark theme — without
   * it they assume the page can't do dark and darken it themselves, which
   * stacks with ours and comes out near-black.
   */
  colorScheme: "light dark",

  /**
   * A single value, not a prefers-color-scheme pair: the visitor's OS setting
   * and the theme they actually chose can disagree, and a media-query pair
   * would tint the browser chrome to the OS setting while the page showed the
   * other theme. lib/theme.ts keeps this in sync with the live theme instead.
   */
  themeColor: "#FAF7F1",

  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the inline script below sets data-theme on
    // <html> before React hydrates, so the attribute legitimately differs from
    // the server-rendered markup. It is scoped to this element only.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <head>
        {/* Blocking and first in <head> — resolves the theme before anything
            paints, so there is no flash of the wrong theme on load. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
