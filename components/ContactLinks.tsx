import { contactLinks } from "@/lib/site-config";

/**
 * The four deep links (WhatsApp, Email, LinkedIn, X) as buttons.
 * Used on /contact, the home contact band and /about — edit the URLs in
 * lib/site-config.ts, never here.
 */
/**
 * `columns` is a prop rather than a className override because two competing
 * `lg:grid-cols-*` utilities resolve by stylesheet order, not string order —
 * the override silently loses.
 */
export default function ContactLinks({
  className = "",
  columns = 4,
}: {
  className?: string;
  columns?: 1 | 4;
}) {
  const layout =
    columns === 1 ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <ul
      className={`grid gap-3 ${layout} ${className}`}
      aria-label="Direct contact links"
    >
      {contactLinks.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group flex h-full items-center justify-between gap-3 rounded-sm border border-hairline bg-card px-5 py-4 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-accent"
          >
            <span>
              <span className="block text-[0.9375rem] font-semibold text-ink">
                {link.label}
              </span>
              <span className="mt-0.5 block text-sm text-muted">
                {link.hint}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-accent-strong transition-transform duration-150 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
