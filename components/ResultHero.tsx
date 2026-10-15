import Image from "next/image";
import FullSizeBadge from "@/components/FullSizeBadge";
import ImageLightbox from "@/components/ImageLightbox";

/**
 * The build's best result, right under the title, so a visitor sees what it
 * produces before reading how it works. Shows the card's result crop and
 * opens the full screenshot over the page.
 */
export default function ResultHero({
  src,
  href,
  caption,
  title,
}: {
  src: string;
  href: string;
  caption: string;
  title: string;
}) {
  return (
    <figure className="mt-10 max-w-4xl">
      <ImageLightbox
        href={href}
        alt={caption}
        className="group/zoom relative block cursor-zoom-in overflow-hidden rounded-md border border-hairline bg-paper shadow-sm"
      >
        <Image
          src={src}
          alt={`Result from ${title}`}
          width={1600}
          height={1000}
          priority
          sizes="(max-width: 960px) 100vw, 896px"
          className="h-auto w-full"
        />
        <FullSizeBadge />
      </ImageLightbox>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        <span className="font-semibold text-ink">The result.</span> {caption}
      </figcaption>
    </figure>
  );
}
