import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";
import type { Testimonial } from "@/lib/testimonials";

/** Renders `**…**` as the emphasised line; everything else stays muted. */
function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className="font-semibold text-ink">
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * One testimonial: the quote, who said it, and a link to the original
 * WhatsApp message so a visitor can check it wasn't written for them.
 */
export default function TestimonialCard({
  testimonial,
  size = "full",
}: {
  testimonial: Testimonial;
  size?: "full" | "compact";
}) {
  const { name, role, link, photo, message, quote } = testimonial;

  return (
    <figure className="flex h-full flex-col rounded-md border-2 border-edge bg-card p-6 shadow-card sm:p-8">
      <svg
        aria-hidden="true"
        viewBox="0 0 32 24"
        className="h-6 w-8 text-gold"
        fill="currentColor"
      >
        <path d="M0 24V14.4C0 6.6 4.3 1.6 12.2 0l1.5 3.3C9.4 4.6 7.3 7.4 7 11h6v13H0Zm18.3 0V14.4C18.3 6.6 22.6 1.6 30.5 0L32 3.3c-4.3 1.3-6.4 4.1-6.7 7.7h6V24H18.3Z" />
      </svg>

      <blockquote
        className={`mt-5 mb-6 space-y-4 text-muted ${
          size === "full"
            ? "font-display text-[1.1875rem] leading-relaxed"
            : "font-display text-lg leading-relaxed"
        }`}
      >
        {quote.map((paragraph) => (
          <p key={paragraph}>
            <Emphasised text={paragraph} />
          </p>
        ))}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-4 border-t border-hairline pt-6">
        <Image
          src={photo}
          alt={`Photo of ${name}`}
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-full border border-hairline object-cover"
        />
        <div className="min-w-0">
          <p className="font-semibold text-ink">{name}</p>
          <p className="text-sm text-muted">
            {role}
            {link ? (
              <>
                {" · "}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-strong underline underline-offset-4"
                >
                  {link.label}
                </a>
              </>
            ) : null}
          </p>
          <ImageLightbox
            href={message}
            alt={`${name}’s original WhatsApp message`}
            className="mt-1 inline-block text-sm font-semibold text-accent-strong underline underline-offset-4"
          >
            See the original message
          </ImageLightbox>
        </div>
      </figcaption>
    </figure>
  );
}
