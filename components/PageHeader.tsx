import type { ReactNode } from "react";
import Container from "./Container";

/** Shared top-of-page block: eyebrow, single H1, optional lede. */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
  /** Less space around it, so the page's content starts higher. */
  compact?: boolean;
}) {
  return (
    <Container
      as="header"
      className={`border-b border-hairline ${compact ? "py-8 md:py-12" : "py-14 md:py-20"}`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.25rem,1.6rem+2.8vw,3.5rem)] leading-[1.08] font-semibold text-ink">
        {title}
      </h1>
      {lede ? (
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">
          {lede}
        </p>
      ) : null}
      {children}
    </Container>
  );
}
