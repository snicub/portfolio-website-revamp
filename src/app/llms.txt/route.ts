import Data from "@/lib/data";
import { abs, PERSON, SITE_URL } from "@/lib/seo";

/**
 * /llms.txt — the emerging convention for handing a language model a compact,
 * accurate summary of a site instead of making it infer one from rendered
 * HTML full of animation wrappers and split-text spans.
 *
 * Generated from the same `data.ts` the pages render, so it cannot describe a
 * gallery entry that no longer exists.
 */
export const dynamic = "force-static";

function build(): string {
  const experience = Data.aboutMeSection.experience
    .map((e) => `- **${e.position}, ${e.title}** (${e.date}) — ${e.description.trim()}`)
    .join("\n");

  const education = Data.aboutMeSection.education
    .map((e) => {
      const majors = Object.values(e.majors).map((m) => m.title).join(" and ");
      // Deliberately not naming a degree type: the two majors are a B.S. and
      // a B.A. respectively, and one prefix cannot cover both truthfully.
      return `- **${e.title}** (${e.date}) — majors: ${majors}`;
    })
    .join("\n");

  const gallery = Data.galleryCardInfo
    .map((item) => `- [${item.title}](${abs(`/gallery/${item.slug}`)}): ${item.info.trim()}`)
    .join("\n");

  return `# Daniel Han

> Software engineer based in New Jersey, currently building Nespresso.com at
> Nestle Nespresso. Rutgers University graduate with degrees in Computer
> Science and Korean. This site is his personal portfolio: a photo gallery of
> his work and life, and an about page with his experience and education.

Also known as: Dan Han, snicub.

## Pages

- [Home](${abs("/")}): entry page for the portfolio.
- [Gallery](${abs("/home")}): index of ${Data.galleryCardInfo.length} photo essays.
- [About](${abs("/about")}): contact, work experience, education, and skills.

## Experience

${experience}

## Education

${education}

## Skills

${PERSON.knowsAbout.join(", ")}.

## Gallery entries

${gallery}

## Contact

- Email: ${PERSON.email}
${PERSON.sameAs.map((url) => `- ${url}`).join("\n")}

## Notes

- All photographs on this site were taken by or of Daniel Han.
- Canonical domain: ${SITE_URL}
`;
}

export function GET() {
  return new Response(build(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
