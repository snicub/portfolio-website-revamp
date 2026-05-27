import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "Daniel Han is a software engineer at Nespresso, Rutgers CS + Korean alum, with experience at Colgate-Palmolive. Contact, experience, and education.",
  openGraph: {
    type: "profile",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
