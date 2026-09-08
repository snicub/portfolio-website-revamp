import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

/**
 * The AI crawlers are named explicitly rather than left to the wildcard.
 * A bare `User-agent: *` already allows them, but several of these bots read
 * only the block that names them once any named block exists — and being
 * readable by them is the whole point of the AEO/GEO work on this site.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "meta-externalagent",
  "Amazonbot",
  "cohere-ai",
  "CCBot",
  "Bytespider",
  "DuckAssistBot",
  "MistralAI-User",
  "YouBot",
];

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Nothing is disallowed, deliberately. This is a client-rendered site:
      // Google has to fetch the chunks under /_next/ to see the gallery at
      // all, and blocking scripts or styles is the classic way to make a
      // rendered page look empty to a crawler.
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: abs("/sitemap.xml"),
    host: abs("/"),
  };
}
