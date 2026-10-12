// A frame meter, shown only with ?perf in the address (locale.js loads it then).
// It answers on the phone in your hand what a desktop cannot: how many frames the
// page's script cost while it loaded and while it scrolled, and when.
// It counts frames of the main thread. Browsers run transform and opacity animations
// apart from it, so a stutter you can see while these numbers stay clean comes from
// the layers themselves (their size, their filters), not from the script.
(function () {
  /** Once the page is live, the hero's entrance still has this long to play. */
  const ENTRANCE = 2000;
  /** If the app never says it is live, the load stops being read here. */
  const GIVE_UP = 30000;
  /** Scrolling counts until this long after its last event. */
  const SCROLL_TAIL = 150;
  /** How many of the longest waits between frames each line names. */
  const NAMED = 2;

  const ranged = "ScrollTimeline" in window && CSS.supports("animation-range", "0px 1px");
  /** Waits between frames, as [when it began, how long], in ms since the page was requested. */
  const load = [];
  let scroll = [];
  /** The latest waits, whatever the page was doing: the screen's pace is read from them. */
  const recent = [];
  let last = 0;
  let shown = 0;
  let liveAt = 0;
  let scrollUntil = 0;

  const panel = document.createElement("div");
  panel.setAttribute("aria-hidden", "true");
  // Set through the CSSOM: the CSP allows no style attribute in the markup.
  const look = {
    position: "fixed",
    left: "8px",
    bottom: "calc(8px + env(safe-area-inset-bottom))",
    "z-index": "2147483647",
    "max-width": "calc(100vw - 16px)",
    overflow: "hidden",
    padding: "6px 8px",
    "border-radius": "8px",
    background: "rgb(0 0 0 / 0.85)",
    color: "#fff",
    font: "11px/1.45 ui-monospace, Menlo, Consolas, monospace",
    "white-space": "pre",
  };
  for (const [property, value] of Object.entries(look)) panel.style.setProperty(property, value);

  const mark = (name) => performance.getEntriesByName(name)[0]?.startTime ?? 0;
  const seconds = (ms) => `${(ms / 1000).toFixed(2)}s`;
  const when = (ms) => (ms ? seconds(ms) : "–");

  /** One frame of this screen, in ms: the mean of the latest waits that are a single
   *  frame. The clock rounds them (to 1 ms in Safari), and a long wait is several frames. */
  function pace() {
    if (recent.length < 12) return 1000 / 60;
    const sorted = [...recent].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const single = sorted.filter((gap) => gap > median / 1.5 && gap < median * 1.5);
    return single.reduce((sum, gap) => sum + gap, 0) / single.length;
  }

  function line(name, gaps, frame) {
    let lost = 0;
    for (const [, gap] of gaps) lost += Math.max(0, Math.round(gap / frame) - 1);
    const worst = gaps.filter(([, gap]) => gap > frame * 1.5).sort((a, b) => b[1] - a[1]).slice(0, NAMED);
    const named = worst.map(([at, gap]) => `${Math.round(gap)}ms@${seconds(at)}`).join(" ");
    return `${name} ${lost}/${gaps.length + lost} lost${named ? ` · ${named}` : ""}`;
  }

  function show() {
    const frame = pace();
    const rate = Math.round(1000 / frame);
    liveAt ||= mark("zellige:ready");
    // The dev server sends every module apart and runs React's slow development build.
    const dev = document.querySelector('script[src*="@vite/client"]');
    const text = [
      `perf · ${dev ? "DEV SERVER, slower than the real site" : "build"}`,
      `${rate} fps${rate <= 40 ? " (throttled: low power mode?)" : ""} · scroll-timeline ${ranged ? "yes" : "no"}`,
      `paint ${when(mark("first-contentful-paint"))} · script ${when(mark("zellige:script"))} · ready ${when(liveAt)}`,
      line("load  ", load, frame),
      line("scroll", scroll, frame),
      "tap to reset scroll",
    ].join("\n");
    if (text !== panel.textContent) panel.textContent = text;
    if (!panel.isConnected && document.body) document.body.append(panel);
  }

  function tick(now) {
    if (last) {
      const gap = [last, now - last];
      recent.push(gap[1]);
      if (recent.length > 120) recent.shift();
      if (now < (liveAt ? liveAt + ENTRANCE : GIVE_UP)) load.push(gap);
      if (now < scrollUntil) scroll.push(gap);
    }
    last = now;
    if (now - shown >= 500) {
      shown = now;
      show();
    }
    requestAnimationFrame(tick);
  }

  addEventListener("scroll", () => { scrollUntil = performance.now() + SCROLL_TAIL; }, { passive: true });
  // A hidden page gets no frames: the wait until it returns is not a slow frame.
  document.addEventListener("visibilitychange", () => { last = 0; });
  panel.addEventListener("click", () => { scroll = []; show(); });
  requestAnimationFrame(tick);
})();
