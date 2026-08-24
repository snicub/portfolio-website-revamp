"use client";

import { useState, useEffect } from "react";

export default function DateComp() {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(
      new Date()
        .toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .replace(/,/g, ""),
    );
  }, []);

  if (!formattedDate) return null;
  return <span>{formattedDate}</span>;
}
