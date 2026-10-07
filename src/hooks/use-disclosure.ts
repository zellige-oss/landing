import { useEffect, useRef, useState, type SyntheticEvent } from "react";

/**
 * A <details> that opens without JavaScript and, with it, closes on Escape or a tap
 * outside. Spread `props` on the <details>; `close` shuts it (after choosing a link).
 */
export function useDisclosure() {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => { if (ref.current) ref.current.open = false; };
  useEffect(() => {
    if (!open) return;
    const shut = () => { if (ref.current) ref.current.open = false; };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") shut(); };
    const onPointer = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) shut(); };
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onPointer);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onPointer);
    };
  }, [open]);
  const props = { ref, onToggle: (event: SyntheticEvent<HTMLDetailsElement>) => setOpen(event.currentTarget.open) };
  return { open, close, props };
}
