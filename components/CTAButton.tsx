import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-[0.9375rem] font-semibold transition-all duration-150 ease-out";

/**
 * `primary` uses accent-strong (#8F4E14) rather than accent (#B5641A) because
 * white text on accent is 4.37:1 — below AA for button-sized text. On
 * accent-strong it is 6.13:1.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-accent-strong text-white hover:bg-ink active:translate-y-px shadow-[0_1px_2px_rgba(28,27,24,0.12)]",
  secondary:
    "border border-hairline bg-card text-ink hover:border-accent hover:text-accent-strong active:translate-y-px",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">;

export default function CTAButton({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
  ...rest
}: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
