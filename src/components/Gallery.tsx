"use client";

import React, { useEffect, useRef, useState } from "react";
import Data from "@/lib/data";
import GalleryCard from "./GalleryCard";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

const FadeInSection: React.FC<{
  children: React.ReactNode;
  immediate?: boolean;
}> = ({ children, immediate = false }) => {
  const [isVisible, setVisible] = useState(immediate);
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (immediate || isVisible) return;
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion, immediate, isVisible]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: immediate || reduceMotion
          ? "none"
          : "transform 0.8s ease-out, opacity 0.8s ease-out",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

const Gallery: React.FC = () => {
  return (
    <div className="gallery-comp" style={{ width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
          padding: "0 20px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {Data.galleryCardInfo.map((item, index) => (
          <FadeInSection key={item.img} immediate={index < 4}>
            <GalleryCard
              slug={item.slug}
              index={index}
              imageSrc={item.img}
              altText={item.altText}
              title={item.title}
            />
          </FadeInSection>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
