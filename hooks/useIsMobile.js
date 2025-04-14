// hooks/useIsMobile.js
import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth <= 768); // adjust as needed
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isMobile;
};
