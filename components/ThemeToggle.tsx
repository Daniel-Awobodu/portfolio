"use client";

import { useState } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/**
 * Light/dark switch for the top nav.
 *
 * The current theme lives on <html data-theme>, written before first paint by
 * the blocking script in app/layout.tsx. This component reads it from the DOM
 * on click rather than holding it as render state, so:
 *   - the server and client render identical markup (no hydration mismatch),
 *   - the correct icon shows on first paint, driven by CSS in globals.css,
 *   - client-side navigation keeps the theme, since <html> is never remounted.
 *
 * The only state here is for the accessible label, which starts generic and
 * becomes specific once the visitor has interacted.
 */
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [theme, setTheme] = useState<Theme | null>(null);

  function toggle() {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";

    // Cross-fade only for the duration of the switch.
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 200);

    root.dataset.theme = next;
    setTheme(next);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies). The theme
      // still applies for this page view; it just won't survive a reload.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // 44px square to match the mobile menu button beside it and give a
      // comfortable touch target.
      className={`inline-flex h-11 w-11 items-center justify-center rounded-sm text-muted transition-colors duration-150 hover:bg-hairline hover:text-ink ${className}`}
      aria-label={
        theme === null
          ? "Switch between light and dark theme"
          : `Switch to ${theme === "dark" ? "light" : "dark"} theme`
      }
      title="Switch theme"
    >
      {/* Moon — shown in light mode, i.e. "switch to dark". */}
      <svg
        className="theme-icon-moon h-[18px] w-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>

      {/* Sun — shown in dark mode, i.e. "switch to light". */}
      <svg
        className="theme-icon-sun h-[18px] w-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2v2.2M12 19.8V22M4.22 4.22l1.56 1.56M18.22 18.22l1.56 1.56M2 12h2.2M19.8 12H22M4.22 19.78l1.56-1.56M18.22 5.78l1.56-1.56" />
      </svg>
    </button>
  );
}
