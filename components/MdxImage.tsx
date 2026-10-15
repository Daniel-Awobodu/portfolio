import Image from "next/image";

/**
 * `![alt](/case-studies/slug/shot.jpg)` inside an MDX body renders through
 * next/image so case study screenshots are optimised like everything else.
 * Intrinsic ratio is corrected by `h-auto`, so any source dimensions work.
 */
export default function MdxImage({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  if (!src) return null;

  // Workflow screenshots are too detailed to read at column width, so each
  // one opens at full size in a new tab. The badge says so on every image,
  // instead of a "click to enlarge" line repeated in the captions.
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      title="Open full size"
      className="group/zoom relative block cursor-zoom-in"
    >
      <Image
        src={src}
        alt={alt ?? ""}
        width={1600}
        height={1000}
        sizes="(max-width: 768px) 100vw, 680px"
        className="h-auto w-full"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card px-2.5 py-1 font-sans text-xs leading-none font-semibold text-ink shadow-sm transition-colors duration-150 group-hover/zoom:border-accent-strong group-hover/zoom:text-accent-strong"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
        Full size
      </span>
      <span className="sr-only"> (opens full size in a new tab)</span>
    </a>
  );
}
