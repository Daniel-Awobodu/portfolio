/**
 * Marks a build that runs in a live business rather than one built to a brief.
 * The dot reuses the WhatsApp green so it reads as a status light in both
 * themes without adding a second accent colour to the palette.
 */
export default function LiveBadge({
  className = "",
  compact = false,
}: {
  className?: string;
  /** Just "Live", for small spaces like card covers. */
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card px-2.5 py-1 text-xs font-semibold text-ink shadow-sm ${className}`}
    >
      <span aria-hidden="true" className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-whatsapp opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-whatsapp" />
      </span>
      {compact ? (
        <>
          Live<span className="sr-only"> in production</span>
        </>
      ) : (
        "Live in production"
      )}
    </span>
  );
}
