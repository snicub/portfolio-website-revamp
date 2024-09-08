import HomeCard from "../Home/HomeCard";
import { useNavigate } from "react-router-dom";
import useDevice from "../../Hooks/useDevice";

export default function Navbar2() {
  const navigate = useNavigate();
  const handleRouterClick = (page: string) => {
    navigate(page);
  };

  const [isMobile] = useDevice();

  return (
    <div className="entire-navbar">
      <div
        className="homecard-wrapper"
        style={{
          position: "fixed",
          top: "0",
          zIndex: 2,
        }}
      >
        <HomeCard />
      </div>
      <div
        className="experience-wrapper"
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          margin: isMobile ? "10px" : "20px",
          display: "flex",
          textAlign: isMobile ? "right" : undefined,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "1px" : "10px",
          zIndex: 2,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        <div
          className="education-wrapper"
          onClick={() => handleRouterClick("/about")}
          style={{
            transition: "background-color 0.3s ease",
            cursor: "pointer", // Change cursor to pointer to indicate it's clickable
          }}
        >
          [ About ]
        </div>
        <div
          className="exit-wrapper"
          onClick={() => handleRouterClick("/")}
          style={{
            transition: "background-color 0.3s ease",
            cursor: "pointer", // Change cursor to pointer to indicate it's clickable
          }}
        >
          [ Exit ]
        </div>
      </div>
    </div>
  );
}
