import { clamp, easeOut, reveal, span } from "@/components/demo/anim";
import { Phone } from "@/components/demo/PhoneScene";
import type { CallLine, Demo } from "@/lib/demos/types";

/** Characters a second, roughly the pace of speech. */
const PACE = 17;

const fmtClock = (seconds: number) => {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * A phone call. The caller's phone shows the call; beside it, what is said,
 * line by line, at the pace of speech. "outgoing" is a plain call being
 * placed, with nothing said yet.
 */
export default function CallScene({
  demo,
  mode,
  lines = [],
  clock = 0,
  t,
  duration,
  narrow,
}: {
  demo: Demo;
  mode: "ringing" | "live" | "outgoing";
  lines?: CallLine[];
  clock?: number;
  t: number;
  duration: number;
  narrow: boolean;
}) {
  const call = demo.call!;
  const elapsed = (t * duration) / 1000;
  // At the pace of speech, but always finished before the beat ends.
  const spoken = (line: CallLine) =>
    clamp(
      Math.max(
        ((t - line.at) * duration) / 1000 / (line.text.length / PACE),
        (t - line.at) / Math.max(0.05, 0.94 - line.at),
      ),
    );
  const started = lines.filter((line) => t >= line.at);
  const speaking = started.find((line) => spoken(line) < 1);
  const live = mode === "live";
  const labels = call.labels ?? { caller: "Caller", agent: "Agent" };

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#2b3a33,#0b100e)]">
      <Phone
        height={live && narrow ? "h-[44cqh]" : "h-[82cqh]"}
        className={
          live
            ? narrow
              ? "absolute inset-x-0 top-[3cqh] flex justify-center"
              : "absolute top-[3cqh] left-[9cqw] flex"
            : "absolute inset-0 flex items-start justify-center pt-[3cqh]"
        }
      >
        <div className="flex h-full flex-col items-center bg-[linear-gradient(180deg,#26332d,#0f1512)] px-[6cqw] pt-[22cqw] pb-[10cqw] text-white">
          <div className="relative">
            {mode !== "live"
              ? [0, 1].map((ring) => {
                  const p = (elapsed * 0.8 + ring * 0.5) % 1;
                  return (
                    <span
                      key={ring}
                      className="absolute inset-0 rounded-full border-2 border-[#4cc995]"
                      style={{
                        transform: `scale(${1 + p * 0.7})`,
                        opacity: 1 - p,
                      }}
                    />
                  );
                })
              : null}
            <span className="relative flex h-[26cqw] w-[26cqw] items-center justify-center rounded-full bg-[#3c5a4d] text-[9cqw] font-semibold">
              {call.initials}
            </span>
          </div>
          <p className="mt-[5cqw] text-center text-[6.5cqw] leading-tight font-semibold">
            {call.name}
          </p>
          <p className="mt-[1.5cqw] text-[4cqw] text-white/70 tabular-nums">
            {live ? fmtClock(clock + elapsed) : (call.sub ?? "Calling…")}
          </p>

          {/* Voice level */}
          <div className="mt-[8cqw] flex h-[12cqw] items-center gap-[1.6cqw]">
            {Array.from({ length: 9 }, (_, i) => {
              const level = speaking
                ? 0.3 + 0.7 * Math.abs(Math.sin(elapsed * 9 + i * 1.7))
                : 0.12;
              return (
                <span
                  key={i}
                  className={`w-[1.6cqw] rounded-full ${speaking?.who === "agent" ? "bg-[#4cc995]" : "bg-white/80"}`}
                  style={{ height: `${level * 100}%` }}
                />
              );
            })}
          </div>

          <div className="mt-auto grid w-full grid-cols-3 gap-y-[5cqw] text-center text-[3cqw] text-white/75">
            {["Mute", "Keypad", "Speaker"].map((name) => (
              <span
                key={name}
                className="flex flex-col items-center gap-[1.5cqw]"
              >
                <span className="h-[14cqw] w-[14cqw] rounded-full bg-white/12" />
                {name}
              </span>
            ))}
            <span className="col-start-2 flex justify-center">
              <span className="flex h-[16cqw] w-[16cqw] items-center justify-center rounded-full bg-[#e5484d] text-[6cqw]">
                ✆
              </span>
            </span>
          </div>
        </div>
      </Phone>

      {/* What is said */}
      {live ? (
        <div
          aria-hidden="true"
          className={`absolute flex flex-col rounded-xl border border-white/10 bg-[#111413]/95 p-[clamp(10px,2cqw,18px)] shadow-lg ${
            narrow
              ? "inset-x-[4cqw] top-[49cqh] max-h-[32cqh]"
              : "top-[42cqh] right-[6cqw] max-h-[64cqh] w-[46cqw] -translate-y-1/2"
          }`}
        >
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#a3a9a6] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e5484d]" />
            On the call
          </p>
          <div className="mt-2 flex min-h-0 flex-1 flex-col justify-end gap-[clamp(6px,1.4cqh,12px)] overflow-hidden">
            {started.map((line, i) => {
              const agent = line.who === "agent";
              return (
                <div
                  key={i}
                  style={{ opacity: easeOut(span(t, line.at, line.at + 0.04)) }}
                >
                  <p
                    className={`text-[clamp(10px,1.3cqw,12px)] font-semibold ${agent ? "text-[#4cc995]" : "text-[#c9cfcc]"}`}
                  >
                    {agent ? labels.agent : labels.caller}
                  </p>
                  <p className="text-[clamp(13px,1.8cqw,17px)] leading-snug text-white">
                    {reveal(line.text, spoken(line))}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
