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
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12 md:py-16">
          <div className="max-w-sm">
            <p className="font-display text-xl leading-tight font-semibold text-ink">
              {site.name}
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              {site.tagline} {site.role} for teams that want to understand what
              they own.
            </p>
          </div>

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

          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    /* The glyph carries no text, so the link needs an explicit
                       accessible name — and a title for sighted hover. */
                    aria-label={link.label}
                    title={link.label}
                    /* No hover text colour here — the glyph carries its own
                       brand colour, so the ring does the hover work instead. */
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-accent"
                  >
                    <SocialIcon name={link.icon} />
                  </a>
                </li>
              ))}
            </ul>
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
