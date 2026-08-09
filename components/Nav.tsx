"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/lib/site-config";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The drawer closes in the links' onClick rather than in an effect on
  // `pathname` — clicking a link is the only way to navigate out of it, and
  // setState inside an effect would cost an extra render on every route change.

  // Escape closes the drawer and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-display text-lg leading-none font-semibold tracking-tight text-ink transition-colors duration-150 hover:text-accent-strong md:text-xl"
          >
            {site.name}
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`relative py-2 text-[0.9375rem] transition-colors duration-150 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-150 hover:after:scale-x-100 ${
                      isActive(link.href)
                        ? "font-semibold text-ink after:scale-x-100"
                        : "font-medium text-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right-hand cluster: theme switch, then the mobile menu button.
              One toggle instance serves both breakpoints. */}
          <div className="flex items-center gap-1">
            <ThemeToggle className="-mr-1 md:mr-0" />

            {/* Mobile menu button */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-sm text-ink transition-colors duration-150 hover:bg-hairline md:hidden"
            >
            <span aria-hidden="true" className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-200 ${
                  open ? "top-2 rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute top-2 left-0 block h-px w-5 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-200 ${
                  open ? "top-2 -rotate-45" : "top-3.5"
                }`}
              />
              </span>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-hairline bg-paper md:hidden"
      >
        <nav aria-label="Main" className="px-5 py-2 sm:px-8">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-hairline last:border-0">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`flex items-center justify-between py-4 text-base transition-colors duration-150 ${
                    isActive(link.href)
                      ? "font-semibold text-accent-strong"
                      : "font-medium text-ink"
                  }`}
                >
                  {link.label}
                  <span aria-hidden="true" className="text-muted">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
