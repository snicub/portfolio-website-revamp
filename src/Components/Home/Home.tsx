import { useState, useEffect } from "react";
import Gallery from "./Gallery";
import Data from "../../dataFile";
import "../../fonts.css";
import useDevice from "../../Hooks/useDevice";

function Home() {
  const [loading, setLoading] = useState(true);
  const [isMobile] = useDevice();

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const imagePromises = Data.programmingSection.map(
          (tile) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = tile.img;
              img.onload = resolve;
              img.onerror = resolve;
            })
        );

        await Promise.all(imagePromises);

        const galleryImagesPromises = Data.galleryCardInfo.map(
          (tile) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = tile.img;
              img.onload = resolve;
              img.onerror = resolve;
            })
        );

        await Promise.all(galleryImagesPromises);

        setLoading(false);
      } catch (error) {
        console.error("Error loading assets:", error);
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily:
            '"Helvetica Neue", Helvetica, sans-serif, "Helvetica Neue Regular", Icons',
          fontStyle: "normal",
          fontWeight: "bold",
          letterSpacing: "0.1em",
        }}
      >
        <style>
          {`
          @keyframes dots {
            0%, 20% {
              content: '';
            }
            40% {
              content: '.';
            }
            60% {
              content: '..';
            }
            80%, 100% {
              content: '...';
            }
          }
          .dots::after {
            content: '';
            display: inline-block;
            animation: dots 1.5s steps(3, end) infinite;
          }
        `}
        </style>
        {}
      </div>
    );
  }

  return (
    <div
      className="home-main-wrapper"
      style={{
        display: "flex",
        gap: "20px",
        flexDirection: "column",
        marginBottom: "50px",
        marginTop: isMobile ? "100px" : "120px",
      }}
    >
      <div
        className="gallery-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Gallery />
      </div>
      <div
        style={{
          fontFamily: "monospace",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
        className="bottom-message"
      >
        designed & developed by Daniel Han
        <br />
        made in TypeScript React
        {/* <img src={require("../../Assets/reactGif.webp")} alt="loading..." /> */}
      </div>
    </div>
  );
}

export default Home;
