import type { Metadata } from "next";
import {
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  SITE_URL,
  OG_IMAGE,
  SITE_NAME,
  personEntity,
  websiteEntity,
  siteNavigation,
} from "@/lib/seo";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Daniel Han",
    "snicub",
    "software engineer",
    "frontend engineer",
    "React",
    "TypeScript",
    "Nespresso",
    "Rutgers",
    "New Jersey",
    "portfolio",
  ],
  authors: [{ name: "Daniel Han" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Daniel Han — portfolio",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description:
      "Software engineer based in New Jersey, currently building Nespresso.com.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo192.png",
  },
  manifest: "/manifest.json",
  other: {
    "geo.region": "US-NJ",
    "geo.placename": "New Jersey",
    "theme-color": "#F1F0EA",
    "color-scheme": "light",
  },
};

const globalJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    personEntity(),
    websiteEntity(),
    siteNavigation(),
  ],
};

const MOTION_GATE = `(function(){try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("anime")}}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The motion gate writes a class onto <html> before React hydrates.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link
          rel="preconnect"
          href="https://firebaseinstallations.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://firebaseinstallations.googleapis.com"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
        {/* Marks the document as animatable before first paint. Elements that
            start hidden are hidden by CSS behind this class, so a visitor who
            prefers reduced motion — or has JS off — gets the finished page. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_GATE }} />
      </head>
      <body suppressHydrationWarning>
        <AnalyticsTracker />
        <CustomCursor />
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
