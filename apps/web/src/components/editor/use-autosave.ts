import { useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

// Debounces `value` changes and calls `save`, tracking a small status
// indicator ("Enregistré…") instead of an explicit Save button.
// `onLiveChange`, if given, fires immediately (not debounced) on every
// change — used to keep the live preview in sync while typing.
export function useAutosave<T>(
  value: T,
  save: (value: T) => Promise<void>,
  delayMs = 800,
  onLiveChange?: (value: T) => void
) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const isFirstRun = useRef(true);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    onLiveChange?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setStatus("saving");
    const timeout = setTimeout(async () => {
      try {
        await save(valueRef.current);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, delayMs);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  return status;
}
