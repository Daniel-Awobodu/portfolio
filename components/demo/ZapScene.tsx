import { easeInOut, span } from "@/components/demo/anim";
import { NODE_COLORS, NodeGlyph } from "@/components/demo/icons";
import type { Demo, Output } from "@/lib/demos/types";

/**
 * A Zapier zap: its steps stacked top to bottom, as in the editor. The run
 * moves down the arrow from step to step, and each step shows what it found
 * or sent.
 */
export default function ZapScene({
  demo,
  step,
  output,
  t,
  narrow,
}: {
  demo: Demo;
  step: number;
  output?: Output;
  t: number;
  narrow: boolean;
}) {
  const zap = demo.zap!;
  const travelEnd = step > 0 ? 0.25 : 0.3;
  const runEnd = 0.62;
  const travel = step > 0 ? easeInOut(span(t, 0, travelEnd)) : 1;
  const running = t >= travelEnd && t < runEnd;
  const done = t >= runEnd;
  const rows = output ?? [];
  const showOutput = rows.length > 0 && t >= travelEnd + 0.04;

  return (
    <div className="absolute inset-0 bg-[#f6f5f1] bg-[radial-gradient(#d9d6cc_1px,transparent_1px)] [background-size:22px_22px] text-[#2d2e2e]">
      {/* Editor bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-center pt-[clamp(40px,8cqh,60px)]">
        <p className="flex items-center gap-3 rounded-full border border-[#e2dfd6] bg-white px-4 py-1.5 text-[clamp(11px,1.5cqw,14px)] shadow-sm">
          <span className="font-semibold">{zap.title}</span>
          <span className="flex items-center gap-1.5 text-[#13795b]">
            <span className="h-2 w-2 rounded-full bg-[#13795b]" />
            Published
          </span>
        </p>
      </div>

      <div
        className={`absolute inset-x-0 flex ${
          narrow
            ? "top-[13cqh] flex-col items-center gap-[2cqh] px-[5cqw]"
            : "top-[20cqh] items-start justify-center gap-[4cqw] px-[4cqw]"
        }`}
      >
        {/* Steps */}
        <div
          className={`flex flex-col items-center ${narrow ? "w-full" : "w-[min(460px,50cqw)]"}`}
        >
          {zap.steps.map((s, i) => {
            const isActive = i === step;
            const isDone = i < step || (isActive && done);
            return (
              <div key={s.title} className="flex w-full flex-col items-center">
                {i > 0 ? (
                  <div
                    className={`relative w-[2px] bg-gradient-to-b from-[#c7c2ff] to-[#4f46e5] ${narrow ? "h-[4cqh]" : "h-[clamp(26px,7cqh,52px)]"}`}
                  >
                    <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-[#4f46e5]" />
                    {isActive && travel < 1 ? (
                      <span
                        className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#4cc995] shadow-[0_0_0_5px_rgba(76,201,149,0.25)]"
                        style={{ top: `${travel * 100}%` }}
                      />
                    ) : null}
                  </div>
                ) : null}
                <div
                  className={`relative w-full rounded-xl border-2 bg-white px-[clamp(10px,2cqw,18px)] shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition-colors ${
                    narrow ? "py-1.5" : "py-[clamp(8px,1.8cqh,14px)]"
                  } ${isActive ? "border-[#4f46e5]" : "border-transparent"}`}
                >
                  <div className="flex flex-wrap items-center gap-2 text-[clamp(11px,1.5cqw,14px)]">
                    <span className="flex items-center gap-1.5 rounded-lg border border-[#e2dfd6] px-2 py-1 font-semibold">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[1.2em] w-[1.2em]"
                        aria-hidden="true"
                      >
                        <NodeGlyph kind={s.kind} />
                      </svg>
                      {s.app}
                    </span>
                    {s.badge ? (
                      <span
                        className="flex items-center gap-1 rounded-lg border border-[#e2dfd6] bg-[#f0fadc] px-2 py-1 font-semibold"
                        style={{
                          transform:
                            isActive && t < travelEnd
                              ? `scale(${1 + 0.06 * Math.sin(t * 40)})`
                              : "none",
                        }}
                      >
                        ⏱ {s.badge}
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={`${narrow ? "mt-1" : "mt-2"} text-[clamp(13px,2cqw,19px)] font-semibold`}
                  >
                    {s.title}
                  </p>
                  <p
                    className={`${narrow ? "mt-0" : "mt-1"} h-[1.4em] text-[clamp(11px,1.4cqw,13px)] ${
                      isDone ? "text-[#13795b]" : "text-[#6b6b6b]"
                    }`}
                  >
                    {isActive && running
                      ? "Running…"
                      : isDone
                        ? "✓ Success"
                        : ""}
                  </p>
                  {isDone ? (
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#13795b] text-[12px] text-white">
                      ✓
                    </span>
                  ) : null}
                  {isActive && running ? (
                    <span className="absolute top-3 right-3 h-4 w-4 animate-spin rounded-full border-2 border-[#4f46e5] border-t-transparent" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* What this step found or sent */}
        {showOutput ? (
          <div
            aria-hidden="true"
            className={`demo-fade rounded-xl border border-[#e2dfd6] bg-white p-3 font-mono text-[12px] leading-relaxed shadow-[0_6px_18px_rgba(0,0,0,0.08)] ${
              narrow ? "w-full" : "mt-2 w-[min(340px,34cqw)]"
            }`}
          >
            <p className="mb-1.5 flex items-center gap-2 font-sans text-[11px] font-semibold tracking-wide text-[#6b6b6b] uppercase">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: NODE_COLORS[zap.steps[step].kind] }}
              />
              Data · step {step + 1}
            </p>
            {rows.map(([key, value], i) => {
              const shown = t >= travelEnd + 0.08 + (i * 0.4) / rows.length;
              return (
                <p
                  key={key}
                  className={`flex gap-3 transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
                >
                  <span className="w-[6.5rem] shrink-0 text-[#4f46e5]">
                    {key}
                  </span>
                  <span className="min-w-0 truncate">{value}</span>
                </p>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
