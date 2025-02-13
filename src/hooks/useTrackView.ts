import { useEffect, useRef } from "react";

const SCROLL_DEBOUNCE = 500; // Debounce scroll events

export const useTrackView = (postId: number) => {
  const scrollRef = useRef<number>(0);
  const timeSpentRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const isTrackingRef = useRef<boolean>(false);

  const trackView = async (scrollDepth: number) => {
    // Prevent concurrent tracking requests
    if (isTrackingRef.current) return;

    try {
      isTrackingRef.current = true;
      const now = Date.now();
      timeSpentRef.current = Math.round((now - startTimeRef.current) / 1000);

      const response = await fetch("/api/track-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          time_spent: timeSpentRef.current,
          scroll_depth: scrollDepth,
          timestamp: now,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to track view");
      }
    } catch (error) {
      console.error("Error tracking view:", error);
    } finally {
      isTrackingRef.current = false;
    }
  };

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const trackScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const scrollPercentage = Math.round(
          (scrollTop / (documentHeight - windowHeight)) * 100
        );
        const newScrollDepth = Math.max(scrollRef.current, scrollPercentage);

        // Only track if scroll depth has increased
        if (newScrollDepth > scrollRef.current) {
          scrollRef.current = newScrollDepth;
          trackView(newScrollDepth);
        }
      }, SCROLL_DEBOUNCE);
    };

    // Track initial view with a slight delay to prevent duplicate entries
    const initialTrackTimeout = setTimeout(() => trackView(0), 1000);

    // Set up scroll tracking with passive option for better performance
    window.addEventListener("scroll", trackScroll, { passive: true });

    // Track on page hide/unmount
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        trackView(scrollRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(initialTrackTimeout);
      clearTimeout(scrollTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", trackScroll);
      trackView(scrollRef.current);
    };
  }, [postId]);
};
