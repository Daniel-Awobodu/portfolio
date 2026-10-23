import Image from "next/image";
import FullSizeBadge from "@/components/FullSizeBadge";
import ImageLightbox from "@/components/ImageLightbox";
import { pngSize } from "@/lib/image-size";

/**
 * `<AdPreview>` in an MDX body: a screenshot of an ad, shown close to the
 * size it appears in a feed so its copy stays readable, rather than
 * stretched across the column like a workflow screenshot. Opens full size.
 */
export default function AdPreview({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const { width, height } = pngSize(src);

  return (
    <figure className="max-w-[440px]">
      <ImageLightbox
        href={src}
        alt={alt}
        className="group/zoom relative block cursor-zoom-in overflow-hidden rounded-md border-2 border-edge bg-white shadow-card"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 480px) 100vw, 440px"
          className="h-auto w-full rounded-none border-0"
        />
        {/* Top corner, over Facebook's menu icons, so the ad's own button
            stays visible. */}
        <FullSizeBadge top />
      </ImageLightbox>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
