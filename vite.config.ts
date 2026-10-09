import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { fileURLToPath, URL } from "node:url";

// The build prerenders /en/ with <html lang="en"> (scripts/prerender.mjs), and the app
// takes its language from that attribute (main.tsx). The dev server serves the one
// index.html for every path, so it gives /en/ its language here.
const devLocale: Plugin = {
  name: "dev-locale",
  apply: "serve",
  transformIndexHtml: (html, { originalUrl }) =>
    /^\/en(\/|\?|$)/.test(originalUrl ?? "") ? html.replace('<html lang="es">', '<html lang="en">') : html,
};

// The landing ships under a strict CSP (img-src/style-src 'self'): every asset must
// be a real file, never an inlined data: URI.
export default defineConfig({
  plugins: [react(), tailwindcss(), devLocale],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: { assetsInlineLimit: 0, sourcemap: false, modulePreload: { polyfill: false } },
  server: { host: "127.0.0.1", port: 5174, strictPort: true },
});
