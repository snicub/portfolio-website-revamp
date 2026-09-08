import { imageManifest } from "@/lib/imageManifest";

/* ==========================================================================
   Site constants
   ========================================================================== */

export const SITE_URL = "https://snicub.com";
export const SITE_NAME = "Daniel Han";
export const DEFAULT_TITLE = "Daniel Han — Software Engineer";
export const DEFAULT_DESCRIPTION =
  "Daniel Han is a software engineer based in New Jersey, currently building Nespresso.com. Portfolio of work, projects, and personal life.";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_ALT =
  "Daniel Han — software engineer based in New Jersey";
export const LOCALE = "en-US";

/** When this build was produced. Static export bakes it into the HTML. */
export const BUILD_DATE = new Date().toISOString();

/**
 * Absolute URL for a site-relative path.
 *
 * "/" resolves without a trailing slash, because that is the form Next emits
 * for the homepage's canonical link — and a canonical that disagrees with the
 * `url` in the page's own graph is a signal pointing two ways at once.
 */
export const abs = (path: string) =>
  path.startsWith("http") ? path : path === "/" ? SITE_URL : `${SITE_URL}${path}`;

/* ==========================================================================
   Stable node identifiers

   Every entity the site describes gets one `@id` and is defined exactly once
   per page graph; everything else references it. That is what lets a crawler
   — or a language model reading the page — resolve "Daniel Han the person",
   "the site", and "this particular page" as three linked things rather than
   as three unrelated bags of text repeated on every route.
   ========================================================================== */

export const ID = {
  person: `${SITE_URL}/#person`,
  website: `${SITE_URL}/#website`,
  nav: `${SITE_URL}/#navigation`,
  logo: `${SITE_URL}/#logo`,
  gallery: `${SITE_URL}/home#collection`,
  page: (path: string) => `${abs(path)}#webpage`,
  breadcrumb: (path: string) => `${abs(path)}#breadcrumb`,
  image: (src: string) => `${abs(src)}#image`,
} as const;

const ref = (id: string) => ({ "@id": id });

export const PERSON_REF = ref(ID.person);
export const WEBSITE_REF = ref(ID.website);

/* ==========================================================================
   The person
   ========================================================================== */

export const PERSON = {
  name: "Daniel Han",
  alternateName: "Dan Han",
  jobTitle: "Software Engineer",
  worksFor: "Nestle Nespresso",
  alumniOf: "Rutgers University",
  location: "New Jersey, United States",
  email: "daniel.hangb@gmail.com",
  /** Profiles that identify the same person elsewhere. The single strongest
   *  signal for tying this site to a specific "Daniel Han" — there are many. */
  sameAs: [
    "https://github.com/snicub",
    "https://www.linkedin.com/in/danielhan17/",
    "https://www.instagram.com/daniel.hannn/",
    "https://www.youtube.com/@danhantbell",
  ],
  knowsAbout: [
    "Software Engineering",
    "Frontend Development",
    "React",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Python",
    "Java",
    "SQL",
    "Swift",
    "Salesforce Marketing Cloud",
    "Embedded C",
  ],
  description: DEFAULT_DESCRIPTION,
} as const;

/* ==========================================================================
   Images

   Dimensions come from the generated manifest, so an ImageObject can never
   disagree with the file it points at. Google treats width/height on an
   ImageObject as a licensing/indexing hint for Google Images.
   ========================================================================== */

export function imageObject(args: {
  src: string;
  caption: string;
  name?: string;
}) {
  const m = imageManifest[args.src];
  return {
    "@type": "ImageObject",
    "@id": ID.image(args.src),
    url: abs(args.src),
    contentUrl: abs(args.src),
    name: args.name ?? args.caption,
    caption: args.caption,
    ...(m ? { width: m.w, height: m.h } : {}),
    creator: PERSON_REF,
    copyrightHolder: PERSON_REF,
    creditText: PERSON.name,
    // No `license` / `acquireLicensePage`: Google's image-licensing markup
    // wants a real licensing document behind those, and pointing them at the
    // homepage would be claiming one that does not exist.
  };
}

/* ==========================================================================
   Core entities — defined once, in the graph on every page
   ========================================================================== */

export function personEntity() {
  return {
    "@type": "Person",
    "@id": ID.person,
    name: PERSON.name,
    alternateName: PERSON.alternateName,
    url: SITE_URL,
    jobTitle: PERSON.jobTitle,
    description:
      "Software engineer based in New Jersey, currently building Nespresso.com.",
    disambiguatingDescription:
      "Software engineer at Nestle Nespresso; Rutgers University graduate in Computer Science and Korean; based in New Jersey.",
    email: `mailto:${PERSON.email}`,
    image: {
      "@type": "ImageObject",
      "@id": ID.logo,
      url: OG_IMAGE,
      contentUrl: OG_IMAGE,
      width: 1200,
      height: 630,
      caption: OG_IMAGE_ALT,
    },
    worksFor: {
      "@type": "Organization",
      name: "Nestle Nespresso",
      url: "https://www.nespresso.com/",
      sameAs: "https://en.wikipedia.org/wiki/Nespresso",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Rutgers University",
      url: "https://www.rutgers.edu/",
      sameAs: "https://en.wikipedia.org/wiki/Rutgers_University",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: "Bachelor of Science in Computer Science",
        recognizedBy: {
          "@type": "CollegeOrUniversity",
          name: "Rutgers University",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: "Bachelor of Arts in Korean",
        recognizedBy: {
          "@type": "CollegeOrUniversity",
          name: "Rutgers University",
        },
      },
    ],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Software Engineer",
        description:
          "Making the Nespresso website fast, functional, and user friendly.",
        occupationLocation: {
          "@type": "State",
          name: "New Jersey",
        },
        skills: [...PERSON.knowsAbout],
      },
    ],
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressRegion: "NJ",
        addressCountry: "US",
      },
    },
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressRegion: "NJ",
        addressCountry: "US",
      },
    },
    nationality: { "@type": "Country", name: "United States" },
    knowsAbout: [...PERSON.knowsAbout],
    knowsLanguage: [
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Korean", alternateName: "ko" },
    ],
    sameAs: [...PERSON.sameAs],
    mainEntityOfPage: WEBSITE_REF,
  };
}

export function websiteEntity() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: ["snicub", "snicub.com", "Daniel Han portfolio"],
    description: "Daniel Han's personal portfolio.",
    publisher: PERSON_REF,
    creator: PERSON_REF,
    author: PERSON_REF,
    inLanguage: LOCALE,
    copyrightHolder: PERSON_REF,
    copyrightYear: 2024,
    about: PERSON_REF,
  };
}

export function siteNavigation() {
  return {
    "@type": "SiteNavigationElement",
    "@id": ID.nav,
    name: ["Enter", "Gallery", "About"],
    url: [`${SITE_URL}/`, `${SITE_URL}/home`, `${SITE_URL}/about`],
  };
}

/* ==========================================================================
   Page-level scaffolding
   ========================================================================== */

export function speakable(cssSelectors: string[]) {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: cssSelectors,
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumb(path: string, items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": ID.breadcrumb(path),
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/**
 * The node describing *this URL*, as opposed to the person or the site.
 *
 * `isPartOf` ties it to the WebSite, `about` to the Person, and `breadcrumb`
 * to the trail — so a crawler landing on any single page can walk out to the
 * whole model without having to fetch another one.
 */
export function webPage(args: {
  type?: string;
  path: string;
  name: string;
  description: string;
  primaryImage?: string;
  crumbs: Crumb[];
  speakableSelectors?: string[];
  extra?: Record<string, unknown>;
}) {
  return {
    "@type": args.type ?? "WebPage",
    "@id": ID.page(args.path),
    url: abs(args.path),
    name: args.name,
    description: args.description,
    isPartOf: WEBSITE_REF,
    about: PERSON_REF,
    author: PERSON_REF,
    inLanguage: LOCALE,
    dateModified: BUILD_DATE,
    breadcrumb: ref(ID.breadcrumb(args.path)),
    ...(args.primaryImage
      ? { primaryImageOfPage: ref(ID.image(args.primaryImage)) }
      : {}),
    ...(args.speakableSelectors
      ? { speakable: speakable(args.speakableSelectors) }
      : {}),
    ...args.extra,
  };
}

/**
 * Wrap a set of nodes as one linked graph. One script tag per page.
 *
 * Nodes are de-duplicated by `@id`: a photograph can legitimately be both a
 * page's hero and a member of its gallery, and defining the same `@id` twice
 * is the one way to make a graph ambiguous about what it describes.
 */
export function graph(nodes: unknown[]) {
  const seen = new Set<string>();
  const unique: unknown[] = [];

  for (const node of [
    personEntity(),
    websiteEntity(),
    siteNavigation(),
    ...nodes,
  ]) {
    const id = (node as { "@id"?: string })?.["@id"];
    if (id) {
      if (seen.has(id)) continue;
      seen.add(id);
    }
    unique.push(node);
  }

  return { "@context": "https://schema.org", "@graph": unique };
}

/** Serialise for `dangerouslySetInnerHTML`, neutralising any `</script>`. */
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/* ==========================================================================
   Page graphs

   One builder per route. Each returns the complete graph for that URL, so a
   page component never assembles schema by hand and no two routes can drift
   apart in how they describe the same entity.
   ========================================================================== */

const HOME_CRUMBS: Crumb[] = [{ name: "Home", path: "/" }];

/** `/` — the entry page, and the canonical home of the Person. */
export function rootGraph() {
  return graph([
    breadcrumb("/", HOME_CRUMBS),
    webPage({
      path: "/",
      name: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      crumbs: HOME_CRUMBS,
      speakableSelectors: [".enter__meta", ".enter__ticker"],
      extra: {
        // On a personal site the homepage *is* the person's page. This is the
        // strongest single statement of that available in schema.org.
        mainEntity: PERSON_REF,
        significantLink: [`${SITE_URL}/home`, `${SITE_URL}/about`],
      },
    }),
  ]);
}

export type GalleryEntry = {
  slug: string;
  title: string;
  info: string;
  img: string;
  altText: string;
};

/** `/home` — the gallery index. */
export function homeGraph(items: GalleryEntry[]) {
  const crumbs: Crumb[] = [
    ...HOME_CRUMBS,
    { name: "Gallery", path: "/home" },
  ];

  return graph([
    breadcrumb("/home", crumbs),
    webPage({
      type: "CollectionPage",
      path: "/home",
      name: "Gallery — Daniel Han",
      description:
        "Daniel Han's portfolio gallery — ultimate frisbee, cooking, sourdough, family, friends, and the journey from Taco Bell to software engineering.",
      primaryImage: items[0]?.img,
      crumbs,
      speakableSelectors: [".masthead__lede", ".gallery-wrapper"],
      extra: {
        mainEntity: {
          "@type": "ItemList",
          "@id": ID.gallery,
          name: "Daniel Han — Portfolio Gallery",
          numberOfItems: items.length,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: items.map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: abs(`/gallery/${item.slug}`),
            name: item.title,
          })),
        },
      },
    }),
    ...items.map((item) =>
      imageObject({ src: item.img, caption: item.altText, name: item.title }),
    ),
  ]);
}

/** `/about` — a ProfilePage, the type Google documents for person profiles. */
export function aboutGraph(args: {
  skills: readonly string[];
  experience: Array<{ title: string; position: string; date: string; description: string }>;
}) {
  const crumbs: Crumb[] = [...HOME_CRUMBS, { name: "About", path: "/about" }];

  return graph([
    breadcrumb("/about", crumbs),
    webPage({
      type: "ProfilePage",
      path: "/about",
      name: "About Daniel Han",
      description:
        "Daniel Han is a software engineer at Nespresso, Rutgers CS + Korean alum, with experience at Colgate-Palmolive. Contact, experience, and education.",
      crumbs,
      speakableSelectors: [
        ".masthead__lede",
        ".about__block h2",
        ".timeline__title",
      ],
      extra: {
        mainEntity: PERSON_REF,
        // The page's own subject matter, spelled out as terms. This is what an
        // answer engine reaches for when asked "what does Daniel Han know?".
        mentions: args.skills.map((skill) => ({
          "@type": "DefinedTerm",
          name: skill,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "Programming languages and technologies",
          },
        })),
        hasPart: args.experience.map((exp) => ({
          "@type": "EmployeeRole",
          roleName: exp.position,
          description: exp.description,
          ...(exp.date === "Present"
            ? {}
            : { name: `${exp.position}, ${exp.title} (${exp.date})` }),
        })),
      },
    }),
  ]);
}

/** `/gallery/[slug]` — one photo essay. */
export function galleryItemGraph(item: {
  slug: string;
  title: string;
  info: string;
  img: string;
  altText: string;
  imageAlt: string;
  plpImages: { src: string }[];
}) {
  const path = `/gallery/${item.slug}`;
  const crumbs: Crumb[] = [
    ...HOME_CRUMBS,
    { name: "Gallery", path: "/home" },
    { name: item.title, path },
  ];

  const photos = item.plpImages.map((photo, idx) =>
    imageObject({
      src: photo.src,
      caption: `${item.imageAlt} — photo ${idx + 1} of ${item.plpImages.length}`,
      name: `${item.title} — ${idx + 1}`,
    }),
  );

  return graph([
    breadcrumb(path, crumbs),
    // A stub for the gallery index, so `isPartOf` below resolves inside this
    // page's own graph. Partial descriptions of the same @id merge with the
    // full one on /home rather than contradicting it.
    {
      "@type": "CollectionPage",
      "@id": ID.page("/home"),
      url: abs("/home"),
      name: "Gallery — Daniel Han",
      isPartOf: WEBSITE_REF,
    },
    webPage({
      type: "ImageGallery",
      path,
      name: `${item.title} — Daniel Han`,
      description: item.info,
      primaryImage: item.img,
      crumbs,
      speakableSelectors: [".plp__title", ".plp__info"],
      extra: {
        isPartOf: [WEBSITE_REF, ref(ID.page("/home"))],
        mainEntity: {
          "@type": "ItemList",
          name: item.title,
          numberOfItems: photos.length,
          itemListElement: photos.map((photo, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            item: ref(photo["@id"]),
          })),
        },
        associatedMedia: photos.map((photo) => ref(photo["@id"])),
      },
    }),
    imageObject({ src: item.img, caption: item.altText, name: item.title }),
    ...photos,
  ]);
}

/* ==========================================================================
   Next.js metadata

   Canonicals are set per route rather than inherited from the root layout:
   an inherited canonical is worse than none, because every page that forgot
   to override it silently points somewhere else.
   ========================================================================== */

export function pageMetadata(args: {
  path: string;
  title: string;
  description: string;
  /** Site-relative path to a 1200×630 card. Defaults to the site-wide one. */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  /** Skip the `%s · Daniel Han` template — for a title that already names him. */
  absoluteTitle?: boolean;
}) {
  const url = abs(args.path);
  const image = args.image ? abs(args.image) : OG_IMAGE;
  const imageAlt = args.imageAlt ?? OG_IMAGE_ALT;
  const social = `${args.title} · ${SITE_NAME}`;

  return {
    title: args.absoluteTitle ? { absolute: args.title } : args.title,
    description: args.description,
    alternates: { canonical: url },
    openGraph: {
      type: args.type ?? ("website" as const),
      siteName: SITE_NAME,
      title: social,
      description: args.description,
      url,
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: social,
      description: args.description,
      images: [image],
    },
  };
}
