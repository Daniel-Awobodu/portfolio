import { easeOut, reveal, span } from "@/components/demo/anim";
import { Window } from "@/components/demo/AppScenes";
import type { Demo } from "@/lib/demos/types";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em]" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" fill="#5f6368" />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        fill="none"
        stroke="#5f6368"
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * A request form on the client's own website: the fields fill in one by
 * one, the request is sent, and the reference number shows on screen.
 */
export default function WebFormScene({
  demo,
  t,
  narrow,
}: {
  demo: Demo;
  t: number;
  narrow: boolean;
}) {
  const form = demo.webform!;
  const typingEnd = 0.62;
  // The long request takes as long as all the short fields together.
  const short = (typingEnd - 0.06) / 2 / form.fields.length;
  const startOf = (i: number) => 0.06 + i * short;
  const endOf = (i: number) =>
    i < form.fields.length ? startOf(i) + short * 0.85 : typingEnd;
  const pressed = t >= 0.66;
  const thanks = easeOut(span(t, 0.74, 0.86));

  const field = (
    label: string,
    value: string,
    i: number,
    tall?: boolean,
    wide?: boolean,
    hidden?: boolean,
  ) => {
    const active = t >= startOf(i) && t < endOf(i) + 0.02;
    return (
      <div
        key={label}
        className={`min-w-0 ${wide ? "col-span-2" : ""} ${hidden ? "hidden" : ""}`}
      >
        <p className="font-mono text-[0.78em] tracking-[0.12em] text-[#33403a] uppercase">
          {label}
        </p>
        <p
          className={`mt-1 rounded-md border bg-[#f3f4f0] px-2 py-1.5 ${tall ? (narrow ? "min-h-[3.2em]" : "min-h-[4.6em]") : "truncate"} ${
            active
              ? "border-[#1d6b5c] ring-1 ring-[#1d6b5c]"
              : "border-[#d9dcd5]"
          }`}
        >
          {reveal(value, span(t, startOf(i), endOf(i))) || " "}
          {active ? (
            <span className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] bg-[#1d6b5c]" />
          ) : null}
        </p>
      </div>
    );
  };

  return (
    <Window title={form.site} icon={<LockIcon />}>
      <div className="flex h-full flex-col bg-[#f3f4f0] text-[clamp(10px,1.35cqw,13px)] text-[#1b211e]">
        <div className="flex items-center justify-between border-b border-[#d9dcd5] px-[clamp(10px,2.4cqw,24px)] py-2">
          <p className="font-serif text-[1.25em]">
            <span className="font-bold">{form.brand[0]}</span>{" "}
            <span className="text-[#1d6b5c]">{form.brand[1]}</span>
          </p>
          {!narrow ? (
            <span className="rounded-full bg-[#173a33] px-3 py-1 font-semibold text-white">
              {form.cta}
            </span>
          ) : null}
        </div>

        <div
          className={`flex min-h-0 flex-1 gap-[clamp(10px,3cqw,32px)] px-[clamp(10px,2.4cqw,24px)] py-[clamp(8px,2cqh,18px)] ${narrow ? "flex-col" : ""}`}
        >
          <div className={narrow ? "" : "w-[36%] shrink-0"}>
            <p
              className={`font-mono text-[0.8em] tracking-[0.18em] uppercase ${narrow ? "hidden" : ""}`}
            >
              {form.kicker}
            </p>
            <p className="mt-1 font-serif text-[clamp(18px,3cqw,30px)] leading-tight font-bold">
              {form.heading}
            </p>
            {!narrow ? (
              <p className="mt-2 leading-snug text-[#3d4743]">{form.intro}</p>
            ) : null}
          </div>

          <div className="relative min-h-0 flex-1 rounded-xl border border-[#d9dcd5] bg-white p-[clamp(10px,2cqw,20px)]">
            <div
              className={`flex h-full flex-col ${narrow ? "gap-1.5" : "gap-[clamp(6px,1.4cqh,12px)]"}`}
              style={{ opacity: 1 - thanks }}
            >
              <div
                className={`grid grid-cols-2 gap-x-3 ${narrow ? "gap-y-1.5" : "gap-y-3"}`}
              >
                {form.fields.map(([label, value], i) =>
                  field(
                    label,
                    value,
                    i,
                    false,
                    // An odd field out fills its row; an optional one is left
                    // off narrow screens to make room for the request.
                    i === form.fields.length - 1 && i % 2 === 0,
                    narrow && /optional/i.test(label),
                  ),
                )}
              </div>
              {field(
                form.request[0],
                form.request[1],
                form.fields.length,
                true,
              )}
              <p
                className={`mx-auto mt-auto rounded-lg px-5 py-1.5 font-semibold text-white transition-transform ${pressed ? "scale-95 bg-[#124e43]" : "bg-[#1d6b5c]"}`}
              >
                {pressed ? "Sending…" : form.button}
              </p>
            </div>

            {thanks > 0 ? (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center"
                style={{
                  opacity: thanks,
                  transform: `translateY(${(1 - thanks) * 8}px)`,
                }}
              >
                <span className="flex h-[2.6em] w-[2.6em] items-center justify-center rounded-full bg-[#1d6b5c] text-[1.4em] text-white">
                  ✓
                </span>
                <p className="font-serif text-[1.5em] font-bold">
                  {form.thanks.title}
                </p>
                <p className="leading-snug text-[#3d4743]">
                  {form.thanks.body}
                </p>
                {form.thanks.reference ? (
                  <p className="mt-1 rounded-md border border-dashed border-[#1d6b5c] bg-[#eef6f3] px-3 py-1.5 font-mono text-[1.1em] font-semibold text-[#124e43]">
                    {form.thanks.reference}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Window>
  );
}
