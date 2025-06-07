import { useEffect, useState } from "react";

const DateComp: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const currentDate = new Date();
  //format the date as "day, month, year"
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
  };

  const formattedDate = currentDate
    .toLocaleDateString("en-US", options)
    .replace(/,/g, "");

  return (
    <div style={{ fontSize: isMobile ? ".75rem" : undefined }}>
      {formattedDate}
    </div>
  );
};

export default DateComp;
