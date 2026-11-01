"use client";

import { useEffect, useState } from "react";

/** Read the clock outside render (keeps React's purity rules happy). */
const now = () => Date.now();

/**
 * While an AI works: waving dots, a calm label, and the REAL elapsed time.
 * Never fake progress steps ("Analyzing… ✓ Reading… ✓") when the server does everything in one call.
 */
export function ThinkingIndicator({ label = "Thinking", since }: { label?: string; since: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const tick = () => setElapsed(Math.max(0, Math.round((now() - since) / 1000)));
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [since]);
  return (
    <span className="uv-thinking" role="status">
      <span className="uv-thinking__dots" aria-hidden><i /><i /><i /></span>
      <span className="uv-shimmer">{label}</span>
      <span className="uv-thinking__time">{elapsed}s</span>
    </span>
  );
}
