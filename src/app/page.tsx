import type { Metadata } from "next";
import EnterPage from "@/components/EnterPage";
import Data from "@/lib/data";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  jsonLd,
  pageMetadata,
  rootGraph,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(rootGraph()) }}
      />
      {/* The entry page is a photograph wall with no running text, so the
          document's one <h1> is here rather than in the visual design. */}
      <h1 className="sr-only">
        Daniel Han — software engineer based in New Jersey
      </h1>
      <EnterPage images={Data.enterPageSection} />
    </>
  );
}
