import Link from "next/link";
import { contactLinks, navLinks, site } from "@/lib/site-config";
import Container from "./Container";
import SocialIcon from "./SocialIcon";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    // No top margin: every page ends with its own padding, and a gap here
    // shows up as a stray band of paper between two white surfaces.
    <footer className="border-t border-hairline bg-card">
      <Container>
        <div className="py-14 md:py-16">
          {/* Brand block, centred on its own row above the two columns. */}
          <div className="mx-auto max-w-md text-center">
            <p className="font-display text-xl leading-tight font-semibold text-ink">
              {site.name}
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              {site.tagline} {site.role} for teams that want to understand what
              they own.
            </p>
          </div>

          {/* Pages hard left, Elsewhere hard right — the same arrangement at
              every width, not only on desktop. */}
          <div className="mt-12 flex items-start justify-between gap-6 sm:gap-12">
            <nav aria-label="Footer">
              <p className="eyebrow">Pages</p>
              <ul className="mt-4 space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.9375rem] text-muted transition-colors duration-150 hover:text-accent-strong"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0">
              <p className="eyebrow text-right">Elsewhere</p>
              {/* Below 360px there isn't room for four 44px targets beside the
                  Pages column, so the row is capped to two wide and wraps to a
                  tidy 2x2 instead of an accidental-looking 3+1. Shrinking the
                  targets instead would cost more than it saves. */}
              <ul className="mt-4 flex max-w-[98px] flex-wrap justify-end gap-2.5 min-[360px]:max-w-none">
                {contactLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      /* The glyph carries no text, so the link needs an
                         explicit accessible name — and a title for hover. */
                      aria-label={link.label}
                      title={link.label}
                      /* No hover text colour: the glyph carries its own brand
                         colour, so the ring does the hover work instead. */
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-accent"
                    >
                      <SocialIcon name={link.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-hairline py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p>Built with Next.js. Hosted on Vercel.</p>
        </div>
      </Container>
    </footer>
  );
}
