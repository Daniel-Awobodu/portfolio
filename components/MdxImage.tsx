import Image from "next/image";
import FullSizeBadge from "@/components/FullSizeBadge";

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
      <FullSizeBadge />
    </a>
  );
}
