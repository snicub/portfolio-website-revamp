import Marquee from "react-fast-marquee";
import "../../fonts.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useDevice from "../../Hooks/useDevice";
import useScrollToTop from "../../Hooks/useTop";

interface EnterPageProps {
  images: ImageObject[] | undefined; //an array of image objects
  duration?: number;
}

//each image object has a source String and desktopString
interface ImageObject {
  mobileSrc: string;
  desktopSrc?: string;
}

function EnterPage({ images, duration = 3500 }: EnterPageProps) {
  useScrollToTop();
  const [isMobile] = useDevice();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // change the current index every duration milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images!.length);
    }, duration);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images?.length ?? 0, duration]);

  //simulate page load by using a timeout or loading images
  useEffect(() => {
    const loadImages = async () => {
      const promises = images!.map(
        (image) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src =
              isMobile || !image.desktopSrc
                ? image.mobileSrc
                : image.desktopSrc!;
            img.onload = resolve;
            img.onerror = resolve; //force resolve
          })
      );
      await Promise.all(promises);
      setIsPageLoaded(true); //set pages - laoded when all loaded
    };

    loadImages();
  }, [images, isMobile]);

  return (
    <div
      className="enter-page-main"
      style={{
        position: "relative",
        height: "100vh",
        opacity: isPageLoaded ? 1 : 0,
        transition: "opacity 1s ease-in-out",
      }}
    >
      <Marquee
        className="marquee"
        style={{
          fontFamily: "favorit",
          padding: 0,
          margin: 0,
          color: "rgba(0, 0, 0, 0.85)",
          fontSize: "1rem",
          lineHeight: 0.25,
          fontVariationSettings: "'slnt' 0",
          letterSpacing: 0,
          position: "absolute",
          backgroundColor: "white",
          zIndex: 2,
          cursor: "pointer",
        }}
        autoFill={true}
      >
        <p>
          Daniel Han is a passionate software engineer based in New Jersey. He
          is currently a web developer at Nespresso focusing on making the best
          user experience ☕ He gets it done with quality.&nbsp;
        </p>
      </Marquee>
      <div
        className="enter"
        onClick={() => navigate("/home")}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "rgba(0,0,0,1)",
          fontSize: "2rem",
          alignItems: "center",
          fontFamily:
            '"Helvetica Neue", Helvetica, sans-serif, "Helvetica Neue Regular", Icons',
          fontStyle: "normal",
          fontWeight: "bold",
          letterSpacing: "0.1em",
          background: "rgb(255, 255, 255, 0.3)",
          zIndex: 2,
          cursor: "pointer",
        }}
      >
        [ enter ]
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {images!.map((image, index) => (
          <img
            onClick={() => navigate("/home")}
            key={index}
            src={
              isMobile || !image.desktopSrc ? image.mobileSrc : image.desktopSrc
            }
            alt="need no alt"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: currentIndex === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default EnterPage;
