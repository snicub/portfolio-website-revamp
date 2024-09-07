import Marquee from "react-fast-marquee";
import "../../fonts.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useDevice from "../../Hooks/useDevice";

interface EnterPageProps {
  images: ImageObject[] | undefined;
  duration?: number; // Duration for each slide (in milliseconds)
}

interface ImageObject {
  src: string;
  desktopSrc?: string;
}

function EnterPage({ images, duration = 3500 }: EnterPageProps) {
  const [isMobile] = useDevice();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false); // State to track page load

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images!.length);
    }, duration);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images?.length ?? 0, duration]);

  // Simulate page load by using a timeout or loading images
  useEffect(() => {
    const loadImages = async () => {
      const promises = images!.map(
        (image) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src =
              isMobile || !image.desktopSrc ? image.src : image.desktopSrc!;
            img.onload = resolve;
            img.onerror = resolve; // Resolve even if there is an error loading the image
          })
      );
      await Promise.all(promises);
      setIsPageLoaded(true); // Set the page as loaded once all images are loaded
    };

    loadImages();
  }, [images, isMobile]);

  return (
    <div
      className="enter-page-main"
      style={{
        position: "relative",
        height: "100vh",
        opacity: isPageLoaded ? 1 : 0, // Control the opacity based on the loading state
        transition: "opacity 1s ease-in-out", // Fade-in transition
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
          cursor: "pointer", // Change cursor to pointer to indicate it's clickable
        }}
        pauseOnHover={true}
        autoFill={true}
      >
        <p>
          Daniel Han is a software engineer based in New Jersey. He is currently
          studying CS and Korean at Rutgers University.&nbsp;
        </p>
      </Marquee>
      <div
        className="enter"
        onClick={() => navigate("/home")}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%", // Center horizontally
          transform: "translate(-50%, -50%)", // Center both horizontally and vertically
          color: "rgba(0,0,0,1)", // Optional: Adjust text color for visibility
          fontSize: "2rem", // Optional: Adjust font size as needed
          alignItems: "center",
          fontFamily:
            '"Helvetica Neue", Helvetica, sans-serif, "Helvetica Neue Regular", Icons',
          fontStyle: "normal",
          fontWeight: "bold",
          letterSpacing: "0.1em",
          background: "rgb(255, 255, 255, 0.3)",
          zIndex: 2,
          cursor: "pointer", // Change cursor to pointer to indicate it's clickable
        }}
      >
        [ enter ]
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden", // Ensures that the image doesn't overflow the wrapper
        }}
      >
        {images!.map((image, index) => (
          <img
            key={index}
            src={isMobile || !image.desktopSrc ? image.src : image.desktopSrc}
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
