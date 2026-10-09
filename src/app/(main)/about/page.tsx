import type { Metadata } from "next";
import AboutContent from "./AboutContent";
import Data from "@/lib/data";
import { aboutGraph, jsonLd, pageMetadata, PERSON } from "@/lib/seo";

const DESCRIPTION =
  "Daniel Han is a software engineer at The New York Times, Rutgers CS + Korean alum, previously at Nestle Nespresso and Colgate-Palmolive. Contact, experience, and education.";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About",
  description: DESCRIPTION,
  type: "profile",
});

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            aboutGraph({
              skills: PERSON.knowsAbout,
              experience: Data.aboutMeSection.experience,
            }),
          ),
        }}
      />
      <AboutContent />
    </>
  );
}
