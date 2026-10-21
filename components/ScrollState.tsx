"use client";

import { useEffect } from "react";

// Toggles html.scrolled once the page moves, which switches the header to its dark state.
export function ScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => root.classList.toggle("scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
