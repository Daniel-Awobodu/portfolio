import Image from "next/image";

export type PhoneTile = { src: string; width: number; height: number };

const SIZES = {
  md: { frame: "w-[272px]", screen: "h-[min(520px,68svh)]", image: "252px" },
  lg: { frame: "w-[300px]", screen: "h-[min(580px,62svh)]", image: "280px" },
};

/**
 * A phone whose screen scrolls through a full-length mobile screenshot.
 * Presentational only (no file access), so both the MDX `PhoneScroll` and the
 * client-side landing page gallery can use it. Callers pass each tile's real
 * size, so space is reserved before the image loads and nothing jumps.
 */
export default function PhoneFrame({
  tiles,
  alt,
  size = "md",
}: {
  tiles: PhoneTile[];
  alt: string;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];

  return (
    <div
      className={`relative ${s.frame} rounded-[2.75rem] bg-device p-[10px] shadow-lift ring-1 ring-edge`}
    >
      {/* Side buttons, purely decorative. */}
      <span
        aria-hidden="true"
        className="absolute top-28 -left-[3px] h-12 w-[3px] rounded-l-sm bg-device"
      />
      <span
        aria-hidden="true"
        className="absolute top-24 -right-[3px] h-16 w-[3px] rounded-r-sm bg-device"
      />

      <div className="overflow-hidden rounded-[2.1rem] bg-white">
        <div className="flex h-8 items-center justify-center">
          <span
            aria-hidden="true"
            className="h-5 w-20 rounded-full bg-device"
          />
        </div>
        {/* Focusable so keyboard users can scroll it too. The scrollbar is
            hidden to keep the phone look; callers say that it scrolls. */}
        <div
          tabIndex={0}
          role="region"
          aria-label={`${alt} Scrollable.`}
          className={`${s.screen} overflow-y-auto [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-strong [&::-webkit-scrollbar]:hidden`}
        >
          {tiles.map(({ src, width, height }, index) => (
            <Image
              key={src}
              src={src}
              alt={index === 0 ? alt : ""}
              width={width}
              height={height}
              sizes={s.image}
              loading={index < 2 ? "eager" : "lazy"}
              className="block h-auto w-full rounded-none border-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** The line under a phone telling visitors the screen scrolls. */
export function ScrollHint() {
  return (
    <span className="flex items-center gap-1.5 font-semibold text-ink">
      <span aria-hidden="true">↕</span> Scroll inside the phone
    </span>
  );
}
