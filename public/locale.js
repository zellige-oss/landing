// The root "/" is the Spanish page; it sends other readers to the page in their browser's language.
// Runs before first paint (external file: the CSP allows no inline scripts).
// /es/ and /en/ are never redirected, so a language-specific link is respected.
// It also loads the frame meter when the address asks for it: nothing else runs this early.
(function () {
  // ?perf in the address adds a frame meter (perf.js), to read on a real phone what the page costs it.
  if (/[?&]perf\b/.test(location.search)) {
    var meter = document.createElement("script");
    meter.src = "/perf.js";
    document.head.appendChild(meter);
  }
  if (location.pathname !== "/") return;
  var supported = { es: "/es/", en: "/en/" };
  var wanted = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
  var target = "/en/"; // no supported match: English is the widest fallback
  for (var i = 0; i < wanted.length; i += 1) {
    var primary = String(wanted[i]).toLowerCase().split("-")[0];
    if (supported[primary]) { target = supported[primary]; break; }
  }
  // The root already is the Spanish page: only another language needs the trip, and
  // a second page load costs a phone the better part of a second.
  if (target === "/es/") return;
  location.replace(target + location.search + location.hash);
})();
