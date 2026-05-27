export const SITE_URL = "https://snicub.com";
export const SITE_NAME = "Daniel Han";
export const DEFAULT_TITLE = "Daniel Han — Software Engineer";
export const DEFAULT_DESCRIPTION =
  "Daniel Han is a software engineer based in New Jersey, currently building Nespresso.com. Portfolio of work, projects, and personal life.";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const PERSON = {
  name: "Daniel Han",
  alternateName: "Dan Han",
  jobTitle: "Software Engineer",
  worksFor: "Nestle Nespresso",
  alumniOf: "Rutgers University",
  location: "New Jersey, United States",
  email: "daniel.hangb@gmail.com",
  sameAs: ["https://www.youtube.com/@danhantbell"],
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

export const PERSON_REF = { "@id": `${SITE_URL}/#daniel-han` };
export const WEBSITE_REF = { "@id": `${SITE_URL}/#website` };

export function personEntity() {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#daniel-han`,
    name: PERSON.name,
    alternateName: PERSON.alternateName,
    url: SITE_URL,
    jobTitle: PERSON.jobTitle,
    description:
      "Software engineer based in New Jersey, currently building Nespresso.com.",
    email: `mailto:${PERSON.email}`,
    image: OG_IMAGE,
    worksFor: {
      "@type": "Organization",
      name: "Nestle Nespresso",
      url: "https://www.nespresso.com/",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Rutgers University",
      url: "https://www.rutgers.edu/",
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
      },
      {
        "@type": "Occupation",
        name: "Software Engineer Intern",
        description:
          "Worked on embedded C, Python scripts for Salesforce Marketing Cloud, and Django API endpoints.",
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
    nationality: {
      "@type": "Country",
      name: "United States",
    },
    knowsAbout: [...PERSON.knowsAbout],
    knowsLanguage: ["English", "Korean"],
    sameAs: [...PERSON.sameAs],
    mainEntityOfPage: { "@id": `${SITE_URL}/#website` },
  };
}

export function websiteEntity() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: "Daniel Han's personal portfolio.",
    publisher: PERSON_REF,
    inLanguage: "en-US",
    copyrightHolder: PERSON_REF,
    copyrightYear: new Date().getFullYear(),
  };
}

export function siteNavigation() {
  return {
    "@type": "SiteNavigationElement",
    name: "Main Navigation",
    url: SITE_URL,
    hasPart: [
      {
        "@type": "WebPage",
        name: "Enter",
        url: `${SITE_URL}/`,
      },
      {
        "@type": "WebPage",
        name: "Gallery",
        url: `${SITE_URL}/home`,
      },
      {
        "@type": "WebPage",
        name: "About",
        url: `${SITE_URL}/about`,
      },
    ],
  };
}

export function breadcrumb(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function speakable(cssSelectors: string[]) {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: cssSelectors,
  };
}

export function collectionPage(args: {
  items: Array<{ title: string; image: string; url: string; description: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/home#collection`,
    name: "Daniel Han — Portfolio Gallery",
    description:
      "Daniel Han's portfolio gallery — ultimate frisbee, cooking, sourdough, family, friends, and the journey from Taco Bell to software engineering.",
    url: `${SITE_URL}/home`,
    isPartOf: WEBSITE_REF,
    about: PERSON_REF,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: args.items.length,
      itemListElement: args.items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.title,
        description: item.description,
        url: item.url,
        image: {
          "@type": "ImageObject",
          contentUrl: `${SITE_URL}${item.image}`,
          name: item.title,
        },
      })),
    },
    speakable: speakable([".gallery-wrapper", ".bottom-message"]),
  };
}

export function imageGallery(items: Array<{ title: string; image: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Daniel Han — Portfolio Gallery",
    url: `${SITE_URL}/home`,
    about: PERSON_REF,
    image: items.map((i) => ({
      "@type": "ImageObject",
      name: i.title,
      contentUrl: `${SITE_URL}${i.image}`,
    })),
  };
}

export function creativeWork(args: {
  slug: string;
  title: string;
  description: string;
  image: string;
  galleryImages?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: args.title,
    headline: args.title,
    description: args.description,
    url: `${SITE_URL}/gallery/${args.slug}`,
    image: {
      "@type": "ImageObject",
      contentUrl: `${SITE_URL}${args.image}`,
      name: args.title,
    },
    ...(args.galleryImages?.length
      ? {
          associatedMedia: args.galleryImages.map((src, idx) => ({
            "@type": "ImageObject",
            contentUrl: `${SITE_URL}${src}`,
            position: idx + 1,
          })),
        }
      : {}),
    author: PERSON_REF,
    creator: PERSON_REF,
    isPartOf: { "@id": `${SITE_URL}/home#collection` },
    mainEntityOfPage: `${SITE_URL}/gallery/${args.slug}`,
    speakable: speakable([".title-wrapper", ".info-wrapper"]),
  };
}

export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#page`,
    url: `${SITE_URL}/about`,
    name: "About Daniel Han",
    description:
      "Daniel Han is a software engineer at Nespresso, Rutgers CS + Korean alum, with experience at Colgate-Palmolive. Contact, experience, and education.",
    isPartOf: WEBSITE_REF,
    mainEntity: PERSON_REF,
    speakable: speakable([
      ".contact-wrapper",
      ".about-section h3",
      ".about-section h4",
      ".about-section h5",
    ]),
  };
}

export function faqSchema(
  items: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function skillsList(skills: readonly string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Technical Skills",
    description: "Programming languages and technologies Daniel Han is proficient in.",
    numberOfItems: skills.length,
    itemListElement: skills.map((skill, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: skill,
      item: {
        "@type": "DefinedTerm",
        name: skill,
        inDefinedTermSet: "Programming Languages & Technologies",
      },
    })),
  };
}
