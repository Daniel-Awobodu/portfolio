import Link from "next/link";

/**
 * One of the three home-page lane cards. Equal height in a 3-up grid via
 * flex column + `mt-auto` on the footer row; stacks on mobile.
 */
export default function LaneCard({
  eyebrow,
  title,
  description,
  stat,
  statLabel,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <article className="group relative flex h-full flex-col rounded-md border border-hairline bg-card p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_28px_-18px_rgba(28,27,24,0.45)] sm:p-7">
      <p className="eyebrow">{eyebrow}</p>

      <h3 className="mt-3 font-display text-2xl leading-tight font-semibold text-ink">
        {/* Stretched link makes the whole card clickable while keeping one
            real, keyboard-focusable anchor. */}
        <Link href={href} className="after:absolute after:inset-0">
          {title}
        </Link>
      </h3>

      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
        {description}
      </p>

      <div className="mt-auto pt-7">
        <p className="font-display text-[1.75rem] leading-none font-semibold text-accent">
          {stat}
        </p>
        <p className="mt-1.5 text-sm text-muted">{statLabel}</p>

        <p className="mt-5 flex items-center gap-1.5 border-t border-hairline pt-5 text-[0.9375rem] font-semibold text-accent-strong">
          {linkLabel}
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-1"
          >
            →
          </span>
        </p>
      </div>
    </article>
  );
}
