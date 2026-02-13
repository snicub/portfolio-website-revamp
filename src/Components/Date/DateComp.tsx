import { useEffect, useState } from "react";

const DateComp: React.FC = () => {
  // state to track if screen is mobile size
  const [isMobile, setIsMobile] = useState(false);

  // effect to update isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // initial check on component mount

    return () => window.removeEventListener("resize", handleResize); // cleanup
  }, []);

  // get current date
  const currentDate = new Date();

  // options to format date as "weekday month day year"
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
  };

  // format date and remove commas
  const formattedDate = currentDate
    .toLocaleDateString("en-US", options)
    .replace(/,/g, "");

  // render date with smaller font if mobile
  return (
    <div style={{ fontSize: isMobile ? ".75rem" : undefined }}>
      {formattedDate}
    </div>
  );
};

export default DateComp;
