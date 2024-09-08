import Clock from "../Clock/Clock";
import DateComp from "../Date/DateComp";
import { useNavigate } from "react-router-dom";
import useDevice from "../../Hooks/useDevice";

function HomeCard() {
  const navigate = useNavigate();
  const handleExperienceClick = (page: string) => {
    navigate(page);
  };

  const [isMobile] = useDevice();

  return (
    <div
      style={{
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        margin: "10px",
      }}
    >
      <div
        style={{
          fontSize: isMobile ? "1.25rem" : "3rem",
          cursor: "pointer", // Change cursor to pointer to indicate it's clickable
        }}
        onClick={() => handleExperienceClick("/home")}
      >
        Daniel Han
      </div>
      <DateComp />
      <Clock />
    </div>
  );
}

export default HomeCard;
