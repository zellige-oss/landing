import { useEffect, useRef, type RefObject } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * How far the page has scrolled through `target`, from 0 to 1, reported once per
 * frame while it changes. "through": from the target's top reaching the top of the
 * viewport until its bottom reaches the bottom (a sticky story). "past": until its
 * bottom reaches the top (a section scrolling away).
 *
 * The target's position is measured only on load and when something resizes; while
 * scrolling, only scrollY is read. Measuring on every scroll event (as motion's
 * useScroll does) forces the browser to restyle and lay out the page each time,
 * which phones cannot keep up with.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  kind: "through" | "past",
  onProgress: (progress: number) => void,
  enabled = true,
) {
  const callback = useRef(onProgress);
  useEffect(() => { callback.current = onProgress; });

  useEffect(() => {
    const element = target.current;
    if (!enabled || !element) return;
    let top = 0, span = 1, frame = 0, last = NaN;
    const report = () => {
      frame = 0;
      const progress = clamp((scrollY - top) / span);
      if (progress === last) return;
      last = progress;
      callback.current(progress);
    };
    const measure = () => {
      top = element.getBoundingClientRect().top + scrollY;
      const height = element.offsetHeight;
      span = Math.max(1, kind === "through" ? height - innerHeight : height);
      last = NaN;
      report();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(report); };
    measure();
    const observer = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = 0; measure(); });
    observer.observe(element);
    observer.observe(document.documentElement);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, [target, kind, enabled]);
}
