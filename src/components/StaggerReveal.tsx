"use client";
import { useEffect, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  delayMs?: number;
}

/**
 * Wraps a section so it fades/slides in after a short delay, used to
 * sequence the results page (verdict -> match -> gaps -> letter/interview)
 * instead of dumping every card on screen simultaneously. The delay is
 * intentionally short (not a loading state) -- purely a reveal choreography.
 */
export default function StaggerReveal({ children, delayMs = 0 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease"
      }}
    >
      {children}
    </div>
  );
}
