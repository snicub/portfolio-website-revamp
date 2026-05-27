import type { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Daniel Han's portfolio gallery — ultimate frisbee, cooking, sourdough, family, friends, and the journey from Taco Bell to software engineering.",
};

export default function HomePage() {
  return <HomeContent />;
}
