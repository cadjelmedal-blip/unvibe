"use client";

import { useCallback, useState } from "react";

/**
 * A popover that would overflow the right edge of the screen opens toward the left instead.
 * Measured when it mounts (a ref callback, before paint), so it never flashes off-screen.
 * Usage: const { ref, end } = useFlipToFit(); <div ref={ref} className={`uv-popover${end ? " is-end" : ""}`} style={end ? { right: 0, left: "auto" } : undefined}>
 */
export function useFlipToFit(margin = 8) {
  const [end, setEnd] = useState(false);
  const ref = useCallback((panel: HTMLElement | null) => {
    if (panel && panel.getBoundingClientRect().right > window.innerWidth - margin) setEnd(true);
  }, [margin]);
  const reset = useCallback(() => setEnd(false), []);
  return { ref, end, reset };
}
