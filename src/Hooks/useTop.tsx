import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//moves the scroll to top when url location changes
export default function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, [location]);
}
