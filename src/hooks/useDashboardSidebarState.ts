import { useState, useEffect } from "react";

export const useDashboardSidebarState = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMinimized(windowWidth < 1200);
  }, [windowWidth]);

  const toggleMinimized = () => setIsMinimized(!isMinimized);
  return { isMinimized, toggleMinimized };
};
