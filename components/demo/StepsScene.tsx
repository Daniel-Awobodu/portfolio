import { easeInOut, span } from "@/components/demo/anim";
import { NODE_COLORS, NodeGlyph } from "@/components/demo/icons";
import type { Beat, Demo } from "@/lib/demos/types";

type StepsBeat = Extract<Beat, { scene: "steps" }>;

/**
 * A workflow as a short list of plain steps, for builds whose node names
 * aren't shown: each step lights up as the run reaches it, with what it
 * found. Readable without knowing n8n, and still the real sequence.
 */
export default function StepsScene({
  demo,
  beatIndex,
  t,
  narrow,
}: {
  demo: Demo;
  beatIndex: number;
  t: number;
  narrow: boolean;
}) {
  const beat = demo.beats[beatIndex] as StepsBeat;
  const flow = demo.steps![beat.flow ?? "main"];
  const earlier = demo.beats
    .slice(0, beatIndex)
    .filter(
      (b): b is StepsBeat =>
        b.scene === "steps" && (b.flow ?? "main") === (beat.flow ?? "main"),
    );
  const prev = earlier.length ? earlier[earlier.length - 1].step : -1;
  const moving = beat.step > prev;
  const travel = moving && prev >= 0 ? easeInOut(span(t, 0, 0.25)) : 1;
  const runEnd = 0.6;
  const working = t < runEnd;
  const rows = beat.output ?? [];
  const icon = "h-[clamp(22px,3.4cqw,30px)] w-[clamp(22px,3.4cqw,30px)]";

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#22302a,#0b100e)]">
      <div
        className={`absolute inset-x-0 mx-auto rounded-xl border border-white/10 bg-[#141917]/95 shadow-[0_20px_50px_rgba(0,0,0,0.45)] ${
          narrow
            ? "top-[9cqh] w-[92cqw] px-3 py-3"
            : "top-[10cqh] w-[min(640px,64cqw)] px-[clamp(14px,2.4cqw,26px)] py-[clamp(12px,2.4cqh,22px)]"
        }`}
      >
        <p className="mb-[clamp(8px,1.6cqh,14px)] text-[11px] font-semibold tracking-wide text-[#a3a9a6] uppercase">
          {flow.title}
        </p>
        <ol>
          {flow.items.map((item, i) => {
            const done = i < beat.step || (i === beat.step && !working);
            const active = i === beat.step && working;
            const waiting = i > beat.step;
            const last = i === flow.items.length - 1;
            return (
              <li
                key={item.title}
                className={`relative flex gap-3 ${last ? "" : narrow ? "pb-1.5" : "pb-[clamp(6px,1.4cqh,12px)]"}`}
              >
                {!last ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-[clamp(22px,3.4cqw,30px)] bottom-0 left-[calc(clamp(22px,3.4cqw,30px)/2-1px)] w-[2px] bg-[#2c3330]"
                  >
                    <span
                      className="absolute inset-x-0 top-0 bg-[#4cc995]"
                      style={{
                        height:
                          i < beat.step - 1 || (i < beat.step && !moving)
                            ? "100%"
                            : i === beat.step - 1
                              ? `${travel * 100}%`
                              : "0%",
                      }}
                    />
                  </span>
                ) : null}
                <span
                  className={`relative flex ${icon} shrink-0 items-center justify-center rounded-full border-2 ${
                    done
                      ? "border-[#4cc995] bg-[#4cc995]"
                      : active
                        ? "border-[#4cc995] bg-[#0b100e]"
                        : "border-[#3a423e] bg-[#0b100e]"
                  }`}
                >
                  {done ? (
                    <svg
                      viewBox="0 0 16 16"
                      className="h-[60%] w-[60%]"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 8.5 6.5 11.5 12.5 4.5"
                        fill="none"
                        stroke="#0b100e"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : active ? (
                    <span
                      className="h-[45%] w-[45%] rounded-full bg-[#4cc995]"
                      style={{
                        opacity: 0.45 + 0.55 * Math.abs(Math.sin(t * 14)),
                      }}
                    />
                  ) : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`flex items-center gap-2 leading-tight ${narrow ? "text-[12.5px]" : "text-[clamp(12px,1.6cqw,16px)]"} ${waiting ? "text-[#7d8682]" : "font-semibold text-white"}`}
                    style={{ minHeight: "clamp(22px,3.4cqw,30px)" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[1.15em] w-[1.15em] shrink-0"
                      style={{ opacity: waiting ? 0.5 : 1 }}
                      aria-hidden="true"
                    >
                      <NodeGlyph kind={item.kind} />
                    </svg>
                    <span className={narrow ? "min-w-0" : "truncate"}>
                      {item.title}
                    </span>
                    {active ? (
                      <span className="ml-auto shrink-0 text-[0.8em] font-normal text-[#4cc995]">
                        working…
                      </span>
                    ) : null}
                  </p>
                  {i === beat.step && rows.length ? (
                    <div className="demo-fade mt-1.5 rounded-md bg-black/40 px-2.5 py-1.5 font-mono text-[clamp(11px,1.3cqw,13px)] leading-relaxed">
                      {rows.map(([key, value], r) => (
                        <p
                          key={key}
                          className={`flex gap-3 transition-opacity duration-200 ${t >= 0.2 + (r * 0.35) / rows.length ? "opacity-100" : "opacity-0"}`}
                        >
                          <span
                            className="w-[7em] shrink-0"
                            style={{ color: NODE_COLORS[item.kind] }}
                          >
                            {key}
                          </span>
                          <span className="min-w-0 truncate text-white">
                            {value}
                          </span>
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
