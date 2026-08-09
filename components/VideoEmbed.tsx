/**
 * Responsive 16:9 walkthrough embed (Loom, YouTube, Vimeo — anything with an
 * embed URL). Renders nothing when `src` is absent.
 */
export default function VideoEmbed({
  src,
  title = "Walkthrough video",
}: {
  src?: string;
  title?: string;
}) {
  if (!src) return null;

  return (
    <figure className="my-10">
      <div className="relative w-full overflow-hidden rounded-md border border-hairline bg-ink pt-[56.25%]">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        A short walkthrough of how this system actually runs.
      </figcaption>
    </figure>
  );
}
