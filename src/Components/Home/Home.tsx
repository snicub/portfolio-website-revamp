import { useState, useEffect } from "react";
import Gallery from "./Gallery";
import Marquee from "react-fast-marquee";
import Data from "../../dataFile";
import ProgrammingTile from "../Programming/ProgrammingTile";
import "../../fonts.css";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Example for image assets
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

        // Additional resource loading can go here

        setLoading(false); // Loading done
      } catch (error) {
        console.error("Error loading assets:", error);
        setLoading(false); // Fail gracefully
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
        [ Please wait<span className="dots"></span> ]
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
        marginTop: "150px",
      }}
    >
      <div className="stick-bar-and-marquee-close-gap">
        <div
          className="navbar-wrapper-and-name-sticky-filler"
          style={{ height: "100px" }}
        >
          <Marquee
            className="marquee"
            style={{
              padding: 0,
              margin: 0,
              fontSize: "1rem",
              backgroundColor: "white",
            }}
            autoFill={true}
          >
            {Data.programmingSection.map((tile, index) => (
              <ProgrammingTile key={index} img={tile.img} />
            ))}
          </Marquee>
        </div>
      </div>

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
        }}
        className="bottom-message"
      >
        designed & developed by Daniel Han
      </div>
    </div>
  );
}

export default Home;
