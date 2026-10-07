import { useEffect, useRef, type RefObject } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * How far the page has scrolled through `target`, from 0 to 1, reported once per
 * frame while it changes, from the target's top reaching the top of the viewport.
 * "pinned": until the target's first child, which is sticky, lets go (a sticky story
 * that ends as soon as its panel starts scrolling away). "past": until the target's
 * bottom reaches the top (a section scrolling away).
 *
 * The target's position is measured only on load and when something resizes; while
 * scrolling, only scrollY is read. Measuring on every scroll event (as motion's
 * useScroll does) forces the browser to restyle and lay out the page each time,
 * which phones cannot keep up with.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  kind: "pinned" | "past",
  onProgress: (progress: number) => void,
  enabled = true,
) {
  const callback = useRef(onProgress);
  useEffect(() => { callback.current = onProgress; });

  useEffect(() => {
    const element = target.current;
    if (!enabled || !element) return;
    const pin = kind === "pinned" ? element.firstElementChild as HTMLElement | null : null;
    let top = 0, span = 1, frame = 0, last = NaN, pinned = 0;
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
      // A sticky panel lets go when the target's bottom reaches the panel's bottom.
      // The panel can change height with what it shows; taking the tallest it has
      // been keeps a change of step from moving the progress back across its own
      // threshold (and flipping between the two steps).
      if (pin) pinned = Math.max(pinned, pin.offsetHeight + parseFloat(getComputedStyle(pin).top));
      span = Math.max(1, height - pinned);
      last = NaN;
      report();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(report); };
    measure();
    const observer = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = 0; measure(); });
    observer.observe(element);
    if (pin) observer.observe(pin);
    observer.observe(document.documentElement);
    addEventListener("scroll", schedule, { passive: true });
    // A new viewport lays the panel out anew: start over from its current height.
    const resize = () => { pinned = 0; measure(); };
    addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, [target, kind, enabled]);
}
