import { easeInOut, easeOut, reveal, span } from "@/components/demo/anim";
import { Phone } from "@/components/demo/PhoneScene";
import type { Demo } from "@/lib/demos/types";

/**
 * A buyer ordering on the landing page, on their phone: the order form fills
 * in field by field, the order is placed, then the thank-you page shows.
 */
export default function FormScene({
  demo,
  t,
  mode,
}: {
  demo: Demo;
  t: number;
  mode: "fill" | "thanks";
}) {
  const form = demo.form!;
  const typingEnd = 0.7;
  const slot = (typingEnd - 0.06) / form.fields.length;
  const ticked = t >= 0.74;
  const pressed = t >= 0.84;
  const scroll = easeInOut(span(t, 0.2, 0.72)) * 46;

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#2b3a33,#0b100e)]">
      <Phone>
        <div className="flex h-full flex-col bg-white text-[#1f2421]">
          {/* Browser bar */}
          <div className="bg-[#f1f3f4] px-[4cqw] pt-[12cqw] pb-[2.5cqw]">
            <p className="flex items-center gap-[1.5cqw] rounded-full bg-white px-[3.5cqw] py-[1.8cqw] text-[3.4cqw] text-[#3c4043]">
              <span aria-hidden="true">🔒</span>
              {form.site}
            </p>
          </div>

          {mode === "thanks" ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-[4cqw] px-[8cqw] text-center">
              <span
                className="flex h-[18cqw] w-[18cqw] items-center justify-center rounded-full bg-[#1e8e3e] text-[9cqw] text-white"
                style={{
                  transform: `scale(${0.6 + 0.4 * easeOut(span(t, 0, 0.25))})`,
                }}
              >
                ✓
              </span>
              <p className="text-[6cqw] leading-tight font-bold">
                {form.thanks.title}
              </p>
              <p className="text-[4cqw] leading-snug text-[#5f6368]">
                {form.thanks.body}
              </p>
            </div>
          ) : (
            <div className="relative flex-1 overflow-hidden">
              <div style={{ transform: `translateY(-${scroll}cqw)` }}>
                {/* Product */}
                <div className="bg-[linear-gradient(135deg,#7a4b2a,#c08a5b)] px-[5cqw] py-[6cqw] text-white">
                  <p className="text-[3.2cqw] font-semibold tracking-wide uppercase opacity-85">
                    Pay on delivery
                  </p>
                  <p className="mt-[1cqw] text-[6cqw] leading-tight font-bold">
                    {form.product}
                  </p>
                  <p className="mt-[1cqw] text-[5cqw] font-semibold">
                    {form.price}
                  </p>
                </div>

                <div className="px-[5cqw] pt-[4cqw]">
                  <p className="text-[4.4cqw] font-bold">
                    Fill in your details to order
                  </p>
                  {form.fields.map(([label, value], i) => {
                    const from = 0.06 + i * slot;
                    const p = span(t, from, from + slot * 0.85);
                    const active = t >= from && t < from + slot;
                    return (
                      <div key={label} className="mt-[3cqw]">
                        <p className="text-[3.2cqw] text-[#5f6368]">{label}</p>
                        <p
                          className={`mt-[1cqw] min-h-[8.5cqw] truncate rounded-[1.6cqw] border px-[2.5cqw] py-[1.8cqw] text-[3.8cqw] ${
                            active
                              ? "border-[#1a73e8] ring-1 ring-[#1a73e8]"
                              : "border-[#dadce0]"
                          }`}
                        >
                          {reveal(value, p)}
                          {active ? (
                            <span className="ml-px inline-block h-[3.8cqw] w-px translate-y-[0.5cqw] bg-[#1a73e8]" />
                          ) : null}
                        </p>
                      </div>
                    );
                  })}

                  <p className="mt-[4cqw] flex gap-[2cqw] text-[3.2cqw] leading-snug text-[#3c4043]">
                    <span
                      className={`mt-[0.3cqw] flex h-[4cqw] w-[4cqw] shrink-0 items-center justify-center rounded-[0.8cqw] border text-[3cqw] text-white ${
                        ticked
                          ? "border-[#1e8e3e] bg-[#1e8e3e]"
                          : "border-[#9aa0a6]"
                      }`}
                    >
                      {ticked ? "✓" : ""}
                    </span>
                    {form.agree}
                  </p>

                  <p
                    className="mt-[4cqw] rounded-[2cqw] bg-[#e8710a] py-[3cqw] text-center text-[4.4cqw] font-bold text-white transition-transform"
                    style={{ transform: pressed ? "scale(0.96)" : "none" }}
                  >
                    {pressed ? "Placing order…" : form.button}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Phone>
    </div>
  );
}
