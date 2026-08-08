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

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={1600}
      height={1000}
      sizes="(max-width: 768px) 100vw, 680px"
      className="h-auto w-full"
    />
  );
}
