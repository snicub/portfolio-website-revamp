"use client";

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 767px)";
const TABLET_QUERY = "(min-width: 768px) and (max-width: 1023px)";

type DeviceState = [isMobile: boolean, isTablet: boolean, isDesktop: boolean];

const SERVER_SNAPSHOT: DeviceState = [false, false, true];

const computeSnapshot = (): DeviceState => {
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  const isTablet = window.matchMedia(TABLET_QUERY).matches;
  return [isMobile, isTablet, !isMobile && !isTablet];
};

let cached: DeviceState | null = null;

const getSnapshot = (): DeviceState => {
  if (cached === null) cached = computeSnapshot();
  return cached;
};

const subscribe = (callback: () => void) => {
  const mobile = window.matchMedia(MOBILE_QUERY);
  const tablet = window.matchMedia(TABLET_QUERY);

  const handler = () => {
    cached = computeSnapshot();
    callback();
  };
  mobile.addEventListener("change", handler);
  tablet.addEventListener("change", handler);
  return () => {
    mobile.removeEventListener("change", handler);
    tablet.removeEventListener("change", handler);
  };
};

export default function useDevice(): DeviceState {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}
