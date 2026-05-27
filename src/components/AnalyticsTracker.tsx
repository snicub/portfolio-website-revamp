"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    let cancelled = false;
    const send = async () => {
      try {
        const [{ logEvent, setUserProperties }, { getFirebaseAnalytics }] =
          await Promise.all([
            import("firebase/analytics"),
            import("@/lib/firebase"),
          ]);
        if (cancelled) return;
        const analytics = getFirebaseAnalytics();
        if (!analytics) return;

        const ua = navigator.userAgent;
        const isMobile = /Mobi|Android/i.test(ua);
        const deviceType = isMobile ? "mobile" : "desktop";

        setUserProperties(analytics, { device_type: deviceType });
        logEvent(analytics, "screen_view" as string, {
          screen_name: pathname,
          screen_class: pathname,
          device_type: deviceType,
          user_agent: ua,
        });
      } catch {
        // analytics is best-effort
      }
    };

    const idle =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ||
      ((cb: () => void) => setTimeout(cb, 200));
    idle(send);

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
