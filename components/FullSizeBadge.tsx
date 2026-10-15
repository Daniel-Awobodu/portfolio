/**
 * Corner badge on an image link that opens the full-size screenshot. The
 * parent link carries `group/zoom` so the badge lights up on hover.
 */
export default function FullSizeBadge() {
  return (
    <>
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
      <span className="sr-only"> (opens full size)</span>
    </>
  );
}
