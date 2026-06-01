export interface ImageObject {
  mobileSrc: string;
  desktopSrc?: string;
}

export interface GalleryItem {
  slug: string;
  img: string;
  plpImages: { src: string }[];
  altText: string;
  title: string;
  info: string;
}

const Data = {
  enterPageSection: [
    {
      mobileSrc: "/images/enterpage/sniblap.webp",
      desktopSrc: "/images/enterpage/desktopAndTablet/sniblapDAT.webp",
    },
    {
      mobileSrc: "/images/enterpage/danandmom.webp",
    },
    {
      mobileSrc: "/images/enterpage/rock.webp",
      desktopSrc: "/images/enterpage/desktopAndTablet/rockDesktop.webp",
    },
    {
      mobileSrc: "/images/enterpage/bid.webp",
      desktopSrc: "/images/enterpage/desktopAndTablet/bidDesktop.webp",
    },
    {
      mobileSrc: "/images/enterpage/hand.webp",
      desktopSrc: "/images/enterpage/desktopAndTablet/handDesktop.webp",
    },
    {
      mobileSrc: "/images/enterpage/orna.webp",
      desktopSrc: "/images/enterpage/desktopAndTablet/ornaDesktop.webp",
    },
    {
      mobileSrc: "/images/enterpage/cake.webp",
    },
    {
      mobileSrc: "/images/enterpage/jcdan.webp",
    },
    {
      mobileSrc: "/images/enterpage/babydan.webp",
      desktopSrc: "/images/enterpage/desktopAndTablet/babyDanDesktop.webp",
    },
    {
      mobileSrc: "/images/enterpage/sheis.webp",
      desktopSrc: "/images/enterpage/desktopAndTablet/sheistyDanDesktop.webp",
    },
    {
      mobileSrc: "/images/enterpage/korean.webp",
      desktopSrc: "/images/enterpage/desktopAndTablet/danKoreanDesktop.webp",
    },
    {
      mobileSrc: "/images/enterpage/danMomSubway.webp",
      desktopSrc: "/images/enterpage/desktopAndTablet/danTrainDesktop.webp",
    },
    {
      mobileSrc: "/images/enterpage/danAsher.webp",
      desktopSrc: "/images/enterpage/desktopAndTablet/danAsherDesktop.webp",
    },
  ] as ImageObject[],

  galleryCardInfo: [
    {
      slug: "ultimate-frisbee",
      img: "/images/gallery/frisbee.webp",
      plpImages: [
        { src: "/images/plp/frisbee/frisbee1.webp" },
        { src: "/images/plp/frisbee/frisbee2.webp" },
        { src: "/images/plp/frisbee/frisbee4.webp" },
        { src: "/images/plp/frisbee/frisbee5.webp" },
        { src: "/images/plp/frisbee/frisbee6.webp" },
        { src: "/images/plp/frisbee/frisbee7.webp" },
        { src: "/images/plp/frisbee/frisbee8.webp" },
        { src: "/images/plp/frisbee/frisbee9.webp" },
        { src: "/images/plp/frisbee/frisbee11.webp" },
        { src: "/images/plp/frisbee/frisbee12.webp" },
        { src: "/images/plp/frisbee/frisbee13.webp" },
        { src: "/images/plp/frisbee/frisbee14.webp" },
      ],
      altText: "frisbee",
      title: "ultimate frisbee",
      info: "In college, I played ultimate frisbee for the Rutgers club team as a handler and it was super fun. I've played since high school and on club teams. I guess all those backhands at the family cookout paid off.",
    },
    {
      slug: "in-the-lab",
      img: "/images/gallery/cooking.webp",
      plpImages: [
        { src: "/images/plp/cooking/noodle.webp" },
        { src: "/images/plp/cooking/soup.webp" },
        { src: "/images/plp/cooking/sushi.webp" },
        { src: "/images/plp/cooking/food4.webp" },
        { src: "/images/plp/cooking/rolls.webp" },
        { src: "/images/plp/cooking/bak1.webp" },
        { src: "/images/plp/cooking/bowl.webp" },
        { src: "/images/plp/cooking/bowl2.webp" },
        { src: "/images/plp/cooking/bowl3.webp" },
      ],
      altText: "dan han cooking",
      title: "in the lab",
      info: "In my free time, I enjoy cooking different recipes and learning new techniques. I also love feeding my friends and family. Some of my best memories come from breaking bread with others and I want to be able to provide that for those around me.",
    },
    {
      slug: "big-family-guy",
      img: "/images/plp/fam/aurassert.webp",
      plpImages: [
        { src: "/images/plp/fam/lucas.webp" },
        { src: "/images/plp/fam/lucas2.webp" },
        { src: "/images/plp/fam/danFamEat.webp" },
        { src: "/images/plp/fam/DanGrampFam.webp" },
        { src: "/images/plp/fam/fam3.webp" },
        { src: "/images/plp/fam/fam4.webp" },
        { src: "/images/plp/fam/fam5.webp" },
        { src: "/images/plp/fam/fam7.webp" },
        { src: "/images/plp/fam/fam8.webp" },
        { src: "/images/plp/fam/fam9.webp" },
        { src: "/images/plp/fam/fam10.webp" },
        { src: "/images/gallery/danfam.webp" },
        { src: "/images/plp/fam/fam12.webp" },
      ],
      altText: "family values",
      title: "big family guy",
      info: "I love spending quality time with my family, whether it's going on trips, celebrating holidays, or just hanging out at home. Yes, I'm the youngest, the favorite, and have two older sisters!",
    },
    {
      slug: "kickback",
      img: "/images/gallery/twon.webp",
      plpImages: [
        { src: "/images/plp/friends/alan.webp" },
        { src: "/images/plp/friends/point.webp" },
        { src: "/images/plp/friends/pointban.webp" },
        { src: "/images/plp/friends/vish.webp" },
        { src: "/images/plp/friends/danAlanPack.webp" },
        { src: "/images/plp/friends/friend1.webp" },
        { src: "/images/plp/friends/friend2.webp" },
        { src: "/images/plp/friends/dhan.webp" },
        { src: "/images/plp/friends/montreal1.webp" },
        { src: "/images/plp/friends/montreal2.webp" },
        { src: "/images/plp/friends/montreal3.webp" },
        { src: "/images/plp/friends/montreal4.webp" },
        { src: "/images/plp/friends/phili_friends.webp" },
        { src: "/images/plp/friends/bid.webp" },
      ],
      altText: "hanging out with friends ",
      title: "kickback",
      info: "Never forget your roots.",
    },
    {
      slug: "humble-beginnings",
      img: "/images/gallery/tbell.webp",
      plpImages: [
        { src: "/images/plp/tacobell/tbell1.webp" },
        { src: "/images/plp/tacobell/tbell2.webp" },
        { src: "/images/plp/tacobell/tbell3.webp" },
        { src: "/images/plp/tacobell/tbell4.webp" },
        { src: "/images/plp/tacobell/tbell5.webp" },
        { src: "/images/plp/tacobell/tbell6.webp" },
      ],
      altText: "working at tbell",
      title: "humble beginnings",
      info: "My first job was working at Taco Bell as a steamer on the line. It holds a special place as the Taco Bell Foundation has funded my college education. Don't forget to live mas.",
    },
    {
      slug: "sourdough",
      img: "/images/gallery/dough.webp",
      plpImages: [
        { src: "/images/plp/sourdough/sour1.webp" },
        { src: "/images/plp/sourdough/sour2.webp" },
        { src: "/images/plp/sourdough/sour3.webp" },
        { src: "/images/plp/sourdough/sour4.webp" },
        { src: "/images/plp/sourdough/sour5.webp" },
        { src: "/images/plp/sourdough/sour6.webp" },
        { src: "/images/plp/sourdough/sour7.webp" },
        { src: "/images/plp/sourdough/sour8.webp" },
        { src: "/images/plp/sourdough/sour9.webp" },
        { src: "/images/plp/sourdough/sour10.webp" },
        { src: "/images/plp/sourdough/sour11.webp" },
        { src: "/images/plp/sourdough/sour12.webp" },
        { src: "/images/plp/sourdough/sour13.webp" },
        { src: "/images/plp/sourdough/sour14.webp" },
        { src: "/images/plp/sourdough/sour15.webp" },
        { src: "/images/plp/sourdough/sour16.webp" },
      ],
      altText: "sourdough baking",
      title: "sourdough",
      info: "I got into sourdough baking this past summer! I love the process of making a loaf from start to finish. And no, I haven't named my starter yet.. lol. Sourdough bread making is super appealing to me and such a rewarding process. I'm trying to make homemade croissants next!!",
    },
  ] as GalleryItem[],

  aboutSection: {
    card1: {
      title: "About Me",
      content:
        "Hi! I'm Dan, a software engineer based in New Jersey. Currently building Nespresso.com. I have a passion for creating platforms and services that make people's lives easier. ",
    },
  },

  programmingSection: [
    { img: "/images/programmingmarquee/java.webp" },
    { img: "/images/programmingmarquee/pythonnew.webp" },
    { img: "/images/programmingmarquee/sql.webp" },
    { img: "/images/programmingmarquee/typescript.webp" },
    { img: "/images/programmingmarquee/html.webp" },
    { img: "/images/programmingmarquee/css.webp" },
    { img: "/images/programmingmarquee/js.webp" },
    { img: "/images/programmingmarquee/swift.webp" },
    { img: "/images/programmingmarquee/React.webp" },
    { img: "/images/programmingmarquee/sfmc.webp" },
  ],

  aboutMeSection: {
    contact: {
      email: "daniel.hangb@gmail.com",
    },
    experience: [
      {
        title: "Nestle Nespresso",
        position: "Software Engineer",
        date: "Present",
        description:
          "Making the Nespresso website fast, functional, and user friendly.",
      },
      {
        title: "Colgate-Palmolive",
        position: "Software Engineer Intern",
        date: "January 2023 - November 2023",
        description:
          "Worked on an embedded c project connecting a Bosch BME688 gas sensor with a Silicon Labs EFR32BG22 micro controller. Also worked on writing Python scripts for Salesforce Marketing cloud, and creating API endpoints for an internal Django web application. ",
      },
    ],
    education: [
      {
        title: "Rutgers University",
        date: "September 2021 - May 2025",
        majors: {
          major1: {
            title: "Computer Science",
            courses: [
              "Intro to CS",
              "Discrete Structures",
              "Linear Algebra",
              "Data Structures and Algorithms",
              "Software Methodology",
              "Computer Architecture",
              "Design and Analysis of Algorithms",
              "Data Science",
              "Database Management",
              "Internet Technology",
              "Numerical Analysis & Computing",
              "Minds, Machines, and Persons",
            ],
          },
          major2: {
            title: "Korean",
            courses: [
              "Elementary Korean 1",
              "Elementary Korean 2",
              "Intermediate Korean 1",
              "Intermediate Korean 2",
              "Advanced Korean 1",
              "Advanced Korean 2",
              "Advanced Readings in Korean",
              "Intro to Korean Culture",
              "Intro to Korean Literature in Translation",
              "Korean Translation",
              "Korean Politics @UMich",
              "Everyday Life in the Neoliberal City",
              "Seminar on East Asian Societies",
            ],
          },
        },
      },
    ],
  },
};

export default Data;

export function getGalleryItem(slug: string): GalleryItem | undefined {
  return Data.galleryCardInfo.find((item) => item.slug === slug);
}

export function getAllSlugs(): string[] {
  return Data.galleryCardInfo.map((item) => item.slug);
}

export function getAdjacentSlugs(currentSlug: string) {
  const items = Data.galleryCardInfo;
  const index = items.findIndex((item) => item.slug === currentSlug);
  if (index === -1) return null;
  const total = items.length;
  return {
    prev: items[(index + total - 1) % total].slug,
    next: items[(index + 1) % total].slug,
  };
}
