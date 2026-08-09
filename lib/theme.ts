export type Theme = "light" | "dark";

/** The one localStorage key this site uses. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Runs as a blocking <script> in <head>, before anything paints.
 *
 * It resolves the theme — an explicit saved choice if there is one, otherwise
 * the OS preference — and stamps it on <html> as data-theme. Doing this before
 * first paint is what prevents a flash of the wrong theme, and it means CSS
 * can key on [data-theme] alone rather than also handling "no attribute yet".
 *
 * Kept as a string because it must be inlined; it cannot be bundled and still
 * run early enough. It is stringified verbatim, so keep it ES5-plain and
 * dependency-free.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var theme =
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    /* Private mode, disabled storage, no matchMedia — fall back to light. */
    document.documentElement.dataset.theme = "light";
  }
})();
`.trim();
