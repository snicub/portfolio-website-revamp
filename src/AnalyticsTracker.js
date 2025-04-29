// src/AnalyticsTracker.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logEvent, setUserProperties } from "firebase/analytics";
import { analytics } from "./firebase";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!analytics) return;

    // Gather values
    const screenName = location.pathname;
    const screenClass = location.pathname;
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android/i.test(ua);
    const deviceType = isMobile ? "mobile" : "desktop";

    // Set user property
    setUserProperties(analytics, { device_type: deviceType });

    // Log Firebase event
    logEvent(analytics, "screen_view", {
      screen_name: screenName,
      screen_class: screenClass,
      device_type: deviceType,
      user_agent: ua,
    });
  }, [location]);

  return null;
}
