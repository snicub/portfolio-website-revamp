import { useState, useEffect } from "react";

const Clock = () => {
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
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const getTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const [ctime, setTime] = useState(getTime());

  useEffect(() => {
    const timerId = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div style={{ fontSize: isMobile ? ".75rem" : undefined }}>{ctime}</div>
  );
};

export default Clock;
