import type { Metadata } from "next";
import HomeContent from "./HomeContent";
import Data from "@/lib/data";
import { homeGraph, jsonLd, pageMetadata } from "@/lib/seo";

const DESCRIPTION =
  "Daniel Han's portfolio gallery — ultimate frisbee, cooking, sourdough, family, friends, and the journey from Taco Bell to software engineering.";

export const metadata: Metadata = pageMetadata({
  path: "/home",
  title: "Gallery",
  description: DESCRIPTION,
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(homeGraph(Data.galleryCardInfo)),
        }}
      />
      <HomeContent />
    </>
  );
}
