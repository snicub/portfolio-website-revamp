import React, { useState, useEffect } from "react";
import Data from "../../dataFile";
import GalleryCard from "./GalleryCard";

function FadeInSection(props: any) {
  const [isVisible, setVisible] = React.useState(false);
  const domRef = React.useRef<HTMLDivElement>(null!);
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    });
    observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);
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
  const [columns, setColumns] = useState("repeat(3, 1fr)"); // Default to 3 columns

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 482) {
        //iphone 14 pro max is 481px wide
        setColumns("1fr"); // 1 column on small screens (mobile)
      } else if (window.innerWidth < 1024) {
        setColumns("repeat(2, 1fr)"); // 3 columns on tablet
      } else {
        setColumns("repeat(3, 1fr)"); // 3 columns on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
