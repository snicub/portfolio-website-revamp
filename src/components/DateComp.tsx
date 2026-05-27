"use client";

import { useState, useEffect } from "react";
import useDevice from "@/hooks/useDevice";

export default function DateComp() {
  const [isMobile] = useDevice();
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    };
    setFormattedDate(
      new Date().toLocaleDateString("en-US", options).replace(/,/g, "")
    );
  }, []);

  if (!formattedDate) return null;

  return (
    <div style={{ fontSize: isMobile ? ".75rem" : undefined }}>
      {formattedDate}
    </div>
  );
}
