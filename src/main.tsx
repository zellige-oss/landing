import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { defaultLocale, isLocale, LocaleProvider } from "./i18n";
import "./styles.css";

// The build prerenders one page per locale; each declares its language on <html>.
const lang = document.documentElement.lang;
const locale = isLocale(lang) ? lang : defaultLocale;
const root = document.getElementById("root")!;
const app = <StrictMode><LocaleProvider locale={locale}><App /></LocaleProvider></StrictMode>;
// Read by the ?perf meter (public/perf.js): when the script took over the page.
performance.mark("zellige:script");
// Prerendered content works before (or without) JS; React then takes it over.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
