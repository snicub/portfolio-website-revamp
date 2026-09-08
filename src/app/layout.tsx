import type { Metadata, Viewport } from "next";
import {
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  SITE_URL,
  OG_IMAGE,
  OG_IMAGE_ALT,
  SITE_NAME,
  PERSON,
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
  applicationName: SITE_NAME,
  keywords: [
    "Daniel Han",
    "Dan Han",
    "snicub",
    "software engineer",
    "frontend engineer",
    "React",
    "TypeScript",
    "Next.js",
    "Nespresso",
    "Rutgers University",
    "New Jersey software engineer",
    "portfolio",
  ],
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  publisher: PERSON.name,
  category: "technology",
  // The about page is dense with date ranges and course names, which iOS
  // happily turns into tappable "phone numbers" and "addresses" — restyling
  // the copy and putting links in it that go nowhere useful.
  formatDetection: { telephone: false, address: false, email: false },
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
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
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
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  other: {
    "geo.region": "US-NJ",
    "geo.placename": "New Jersey",
  },
};

export const viewport: Viewport = {
  themeColor: "#F1F0EA",
  colorScheme: "light",
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
        {/* Machine-readable identity, the same claim `sameAs` makes in the
            page graph. Some crawlers and the IndieWeb toolchain read these
            and not JSON-LD. */}
        {PERSON.sameAs.map((href) => (
          <link key={href} rel="me" href={href} />
        ))}
        {/* Each route emits its own JSON-LD graph, which already carries the
            Person and WebSite nodes — a second copy here would define the
            same @ids twice on every page. */}
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
