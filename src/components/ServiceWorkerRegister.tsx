"use client";
import { useEffect } from "react";

/**
 * Registers the PWA service worker on mount. Kept as a tiny client component
 * so it doesn't block server rendering and fails silently in browsers or
 * environments without service worker support.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
    }
  }, []);

  return null;
}
