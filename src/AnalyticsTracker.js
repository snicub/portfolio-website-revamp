// src/AnalyticsTracker.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "screen_view", {
        screen_name: location.pathname,
        screen_class: location.pathname,
      });
    }
  }, [location]);

  return null;
}
