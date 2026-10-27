import type { ReactNode } from "react";
import { easeOut, span } from "@/components/demo/anim";
import type { Demo, Output } from "@/lib/demos/types";

/** When the reading starts and finishes, as progress through the beat. */
const READ_FROM = 0.1;
const READ_TO = 0.72;

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2c.6 4.8 2.6 7.4 8 8.5v1C14.6 12.6 12.6 15.2 12 20h-.1c-.6-4.8-2.6-7.4-8-8.5v-1c5.4-1.1 7.4-3.7 8-8.5h.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Email({
  email,
  reading,
  narrow,
}: {
  email: { from: string; subject: string; time: string; body: Output };
  /** The body line being read, or -1. */
  reading: number;
  narrow: boolean;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl bg-white text-[#202124] shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      <div
        className={`${narrow ? "hidden" : "flex"} items-center gap-2 border-b border-[#e3e6e8] bg-[#f1f3f4] px-3 py-2 text-[12px] text-[#3c4043]`}
      >
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 truncate">Gmail</span>
      </div>
      <div className={narrow ? "px-3 py-2.5" : "p-[clamp(12px,2.2cqw,22px)]"}>
        <p className="truncate text-[clamp(13px,1.9cqw,18px)] leading-snug font-medium">
          {email.subject}
        </p>
        <p
          className={`mt-1 justify-between gap-3 text-[clamp(10px,1.3cqw,12px)] text-[#5f6368] ${narrow ? "hidden" : "flex"}`}
        >
          <span className="truncate">{email.from}</span>
          <span className="shrink-0">{email.time}</span>
        </p>
        <div
          className={`grid grid-cols-[auto_1fr] gap-x-4 text-[clamp(11px,1.5cqw,14px)] ${narrow ? "mt-1.5 gap-y-0" : "mt-[clamp(8px,2cqh,16px)] gap-y-[clamp(2px,0.7cqh,6px)]"}`}
        >
          {email.body.map(([label, value], i) => {
            const on = i === reading;
            return (
              <div key={label} className="contents">
                <span
                  className={`rounded-l px-1 transition-colors duration-150 ${on ? "bg-[#fff1b8]" : ""} text-[#5f6368]`}
                >
                  {label}
                </span>
                <span
                  className={`truncate rounded-r px-1 font-medium transition-colors duration-150 ${on ? "bg-[#fff1b8]" : ""} ${value ? "" : "text-[#b3261e] italic"}`}
                >
                  {value || "not given"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrderCard({
  title,
  rows,
  shown,
  failed = -1,
  narrow,
  children,
}: {
  title: string;
  rows: Output;
  /** How many rows have been filled in. */
  shown: number;
  failed?: number;
  narrow: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl bg-[#111413] text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
      <p
        className={`flex items-center gap-2 border-b border-white/10 px-3 text-[11px] font-semibold tracking-wide text-[#a3a9a6] uppercase ${narrow ? "py-1" : "py-2"}`}
      >
        <Sparkle className="h-3.5 w-3.5 text-[#8ab4f8]" />
        {title}
      </p>
      <div
        className={`grid grid-cols-[auto_1fr] gap-x-4 font-mono text-[clamp(11px,1.45cqw,14px)] ${narrow ? "gap-y-0.5 px-3 py-2" : "gap-y-[clamp(2px,0.8cqh,7px)] p-[clamp(10px,2cqw,18px)]"}`}
      >
        {rows.map(([key, value], i) => {
          const visible = i < shown;
          const bad = i === failed;
          return (
            <div
              key={key}
              className="contents transition-opacity duration-200"
              style={{ opacity: visible ? 1 : 0 }}
            >
              <span
                className="text-[#8ab4f8] transition-opacity duration-200"
                style={{ opacity: visible ? 1 : 0 }}
              >
                {key}
              </span>
              <span
                className={`truncate transition-opacity duration-200 ${bad ? "text-[#ff8a80]" : "text-white"}`}
                style={{ opacity: visible ? 1 : 0 }}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}

/**
 * The AI reading an order email into a clean record, the way a person
 * would: each line of the email lights up as it's read, and the matching
 * field fills in on the right. "check" shows the record passing its check
 * and being saved; "invalid" shows one that fails and goes to review.
 */
export default function ExtractScene({
  demo,
  t,
  narrow,
  mode,
}: {
  demo: Demo;
  t: number;
  narrow: boolean;
  mode: "read" | "check" | "invalid";
}) {
  const x = demo.extract!;
  const invalid = mode === "invalid";
  const email = invalid ? x.invalid.email : demo.inbox!.open!;
  const rows = invalid ? x.invalid.rows : x.rows;
  const lines = email.body.length;

  const progress = mode === "check" ? 1 : span(t, READ_FROM, READ_TO);
  const reading =
    progress > 0 && progress < 1 ? Math.floor(progress * lines) : -1;
  const shown = Math.round(progress * rows.length);

  const verdictAt = invalid ? 0.78 : 0.18;
  const verdict = easeOut(span(t, verdictAt, verdictAt + 0.1));
  const savedAt = 0.52;
  const saved = mode === "check" && t >= savedAt;

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#22302a,#0b100e)]">
      <div
        className={`absolute inset-x-[4cqw] flex ${
          narrow
            ? "top-[9cqh] flex-col gap-0"
            : "top-[12cqh] items-center gap-[2.5cqw]"
        }`}
      >
        <div className={narrow ? "" : "w-[47%]"}>
          <Email email={email} reading={reading} narrow={narrow} />
        </div>

        {/* The AI at work between the two */}
        <div
          className={`relative z-10 flex shrink-0 items-center justify-center ${narrow ? "-my-2" : "flex-col"}`}
          aria-hidden="true"
        >
          <span
            className={`flex items-center justify-center rounded-full bg-[#1e2a4a] text-[#8ab4f8] ring-1 ring-[#8ab4f8]/40 ${narrow ? "h-7 w-7" : "h-9 w-9"}`}
            style={{
              transform: `${narrow ? "rotate(90deg) " : ""}scale(${reading >= 0 ? 1 + 0.08 * Math.sin(t * 60) : 1})`,
            }}
          >
            <Sparkle className="h-4 w-4" />
          </span>
          {!narrow ? (
            <span className="mt-1.5 text-[10px] font-semibold tracking-wide text-[#8ab4f8] uppercase">
              AI
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <OrderCard
            title={x.title}
            rows={rows}
            shown={shown}
            failed={invalid && progress >= 1 ? x.invalid.failed : -1}
            narrow={narrow}
          >
            {mode !== "read" ? (
              <div
                className={`border-t px-3 text-[clamp(11px,1.45cqw,14px)] font-semibold ${narrow ? "py-1" : "py-2"} ${
                  invalid
                    ? "border-[#ff8a80]/30 bg-[#3a1614] text-[#ffb4ab]"
                    : "border-[#4cc995]/30 bg-[#0f2a20] text-[#7ee0b3]"
                }`}
                style={{ opacity: verdict }}
              >
                {invalid ? `✕ ${x.invalid.reason}` : `✓ ${x.check}`}
              </div>
            ) : null}
            {saved ? (
              <p
                className={`demo-fade bg-[#4cc995] px-3 text-[clamp(11px,1.45cqw,14px)] font-semibold text-[#0b100e] ${narrow ? "py-1" : "py-2"}`}
              >
                {x.saved}
              </p>
            ) : null}
          </OrderCard>
        </div>
      </div>
    </div>
  );
}
