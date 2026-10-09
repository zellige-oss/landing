// Runs before first paint (external file: the CSP allows no inline scripts).
// Dark for everyone, unless the reader chose light with the header's switch.
(function () {
  var saved = null;
  try { saved = localStorage.getItem("zellige-theme"); } catch { /* storage blocked */ }
  var light = saved === "light";
  document.documentElement.classList.toggle("dark", !light);
  // The browser's bar takes the page's colour (index.html keeps both).
  var bar = document.querySelector('meta[name="theme-color"]');
  if (bar) bar.setAttribute("content", bar.getAttribute(light ? "data-light" : "data-dark"));
})();
