import { useState, useEffect } from "react";

const Clock = () => {
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

  // function to get current time formatted as HH:MM:SS
  const getTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // state to store current time
  const [ctime, setTime] = useState(getTime());

  // effect to update time every second
  useEffect(() => {
    const timerId = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(timerId); // cleanup interval
  }, []);

  // render time with smaller font if mobile
  return (
    <div style={{ fontSize: isMobile ? ".75rem" : undefined }}>{ctime}</div>
  );
};

export default Clock;
