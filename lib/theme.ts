export type Theme = "light" | "dark";

/** The one localStorage key this site uses. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Browser-chrome tint per theme. Must match --color-paper in globals.css.
 * Applied to <meta name="theme-color"> whenever the theme changes, so the
 * address bar always matches the page rather than the OS setting.
 */
export const THEME_COLORS: Record<Theme, string> = {
  light: "#FAF7F1",
  dark: "#17140F",
};

/**
 * Runs as a blocking <script> in <head>, before anything paints.
 *
 * It resolves the theme — an explicit saved choice if there is one, otherwise
 * the OS preference — and stamps it on <html> as data-theme. Doing this before
 * first paint is what prevents a flash of the wrong theme, and it means CSS
 * can key on [data-theme] alone rather than also handling "no attribute yet".
 *
 * It also syncs <meta name="theme-color">, creating the tag if the metadata
 * one has not been parsed yet (script order in <head> is not guaranteed).
 *
 * Kept as a string because it must be inlined; it cannot be bundled and still
 * run early enough. It is stringified verbatim, so keep it ES5-plain and
 * dependency-free.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  var COLORS = ${JSON.stringify(THEME_COLORS)};
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", COLORS[theme]);
  }
  try {
    var saved = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    apply(
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
    );
  } catch (e) {
    /* Private mode, disabled storage, no matchMedia — fall back to light. */
    apply("light");
  }
})();
`.trim();
