"use client";

import { useState, useEffect } from "react";
import useDevice from "@/hooks/useDevice";

const formatTime = (d: Date) =>
  d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export default function Clock() {
  const [isMobile] = useDevice();
  const [ctime, setTime] = useState("");

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (timerId !== null) return;
      setTime(formatTime(new Date()));
      timerId = setInterval(() => setTime(formatTime(new Date())), 1000);
    };
    const stop = () => {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (!ctime) return null;

  return (
    <div style={{ fontSize: isMobile ? ".75rem" : undefined }}>{ctime}</div>
  );
}
