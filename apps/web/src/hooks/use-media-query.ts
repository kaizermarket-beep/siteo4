"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a media query currently matches.
 *
 * Built on useSyncExternalStore rather than useState + useEffect: matchMedia
 * *is* an external store, and reading it into state inside an effect means a
 * synchronous setState on mount — a cascading render the compiler flags, and
 * one frame where the value is wrong.
 *
 * The server snapshot is false because the server cannot know the viewport.
 * Callers must therefore treat false as "not known yet" rather than as
 * "definitely narrow", and degrade to the mobile layout, which is the safe
 * direction.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
