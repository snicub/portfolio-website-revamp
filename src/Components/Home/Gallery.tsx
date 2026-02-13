import React, { useState, useEffect } from "react";
import Data from "../../dataFile";
import GalleryCard from "./GalleryCard";

// component to fade in its children when visible in viewport
function FadeInSection(props: any) {
  const [isVisible, setVisible] = React.useState(false); // state to track visibility
  const domRef = React.useRef<HTMLDivElement>(null!); // ref to DOM element

  // effect to observe intersection with viewport
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    });
    observer.observe(domRef.current); // start observing
    return () => observer.disconnect(); // cleanup
  }, []);

  // render children with fade-in effect
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20vh)",
        visibility: isVisible ? "visible" : "hidden",
        transition: "transform 1s ease-out, opacity 1s ease-out",
        willChange: "opacity, transform, visibility",
      }}
      ref={domRef}
    >
      {props.children}
    </div>
  );
}

const Gallery: React.FC = () => {
  const [columns, setColumns] = useState("repeat(3, 1fr)"); // default 3 columns

  // effect to adjust grid columns on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 482) {
        setColumns("1fr"); // 1 column on mobile
      } else if (window.innerWidth < 1024) {
        setColumns("repeat(2, 1fr)"); // 2 columns on tablet
      } else {
        setColumns("repeat(3, 1fr)"); // 3 columns on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // initial check

    return () => window.removeEventListener("resize", handleResize); // cleanup
  }, []);

  // render gallery grid
  return (
    <div className="gallery-comp">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: columns,
          overflow: "hidden",
          columnGap: "20px",
          rowGap: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        {Data.galleryCardInfo.map((item, index) => (
          <FadeInSection key={index}>
            <GalleryCard
              index={index}
              imageSrc={item.img}
              altText={item.altText}
              title={item.title}
              info={item.info}
              plpImages={item.plpImages}
            />
          </FadeInSection>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
