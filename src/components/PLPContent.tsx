"use client";

import { useState } from "react";
import Collage from "./Collage";
import Bottombar from "./Bottombar";
import useDevice from "@/hooks/useDevice";
import type { GalleryItem } from "@/lib/data";

interface PLPContentProps {
  item: GalleryItem;
}

export default function PLPContent({ item }: PLPContentProps) {
  const [isMobile] = useDevice();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <main>
      <div className="bottom-navbar-wrapper">
        <Bottombar slug={item.slug} />
      </div>

      <article className="entire-plp" style={{ marginTop: "50px" }}>
        <div
          className="info-card"
          style={{
            display: "flex",
            gap: "40px",
            flexDirection: "column",
            padding: "30px",
          }}
        >
          <h1
            className="title-wrapper"
            style={{
              justifyContent: "center",
              display: "flex",
              fontFamily: "favorit",
              fontSize: "2rem",
              fontStyle: "normal",
              fontWeight: "bold",
              textAlign: "center",
              margin: 0,
            }}
          >
            {item.title}
          </h1>
          <div className="content-wrapper">
            <div
              className="image-and-info-wrapper"
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                className={`shimmer${imageLoaded ? " is-loaded" : ""}`}
                style={{
                  width: isMobile ? "100%" : "50%",
                  aspectRatio: "1 / 1",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  className="mainImage"
                  src={item.img}
                  alt={item.altText}
                  loading="eager"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: imageLoaded ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                    zIndex: 2,
                  }}
                />
              </div>
              <div
                className="info-wrapper"
                style={{
                  fontFamily: "favorit",
                  fontSize: "1rem",
                  fontStyle: "normal",
                  flex: 1,
                }}
              >
                {item.info}
              </div>
            </div>
          </div>
          <Collage plpImages={item.plpImages} />
        </div>
      </article>
    </main>
  );
}
