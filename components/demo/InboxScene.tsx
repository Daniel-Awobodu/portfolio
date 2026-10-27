import type { CSSProperties, ReactNode } from "react";
import { easeOut, reveal, span } from "@/components/demo/anim";
import { Window } from "@/components/demo/AppScenes";
import type { Demo, InboxEmail } from "@/lib/demos/types";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" fill="#ea4335" />
      <path d="m3 7 9 6 9-6" fill="none" stroke="#fff" strokeWidth="1.8" />
    </svg>
  );
}

function Row({
  email,
  unread,
  narrow,
  className = "",
  style,
  chip,
}: {
  email: InboxEmail;
  unread?: boolean;
  narrow: boolean;
  className?: string;
  style?: CSSProperties;
  chip?: boolean;
}) {
  return (
    <div
      className={`flex h-[clamp(30px,6.4cqh,44px)] items-center gap-3 border-b border-[#f1f3f4] px-3 text-[clamp(11px,1.5cqw,14px)] ${className}`}
      style={style}
    >
      {!narrow ? (
        <span aria-hidden="true" className="text-[#c4c7c5]">
          ☆
        </span>
      ) : null}
      <span
        className={`w-[30%] shrink-0 truncate ${unread ? "font-bold text-[#202124]" : "text-[#3c4043]"}`}
      >
        {email.from}
      </span>
      <span className="min-w-0 flex-1 truncate text-[#5f6368]">
        {chip ? (
          <span className="mr-1.5 rounded bg-[#e6f4ea] px-1.5 py-0.5 text-[0.85em] font-semibold text-[#188038]">
            order
          </span>
        ) : null}
        <span
          className={unread ? "font-bold text-[#202124]" : "text-[#202124]"}
        >
          {email.subject}
        </span>
        {!narrow ? <span> · {email.snippet}</span> : null}
      </span>
      <span
        className={`shrink-0 text-[0.9em] ${unread ? "font-bold text-[#202124]" : "text-[#5f6368]"}`}
      >
        {email.time}
      </span>
    </div>
  );
}

/**
 * Gmail. "arrive": a new order email lands at the top of the inbox. "match":
 * the order search picks out the orders and ignores everything else. "pile":
 * a long inbox of past orders scrolling by. "open": one order email, read.
 */
export default function InboxScene({
  demo,
  t,
  narrow,
  mode,
  show = 0,
}: {
  demo: Demo;
  t: number;
  narrow: boolean;
  mode: "arrive" | "match" | "pile" | "open" | "thread";
  show?: number;
}) {
  const inbox = demo.inbox!;
  const searching = mode === "match";
  const search = searching
    ? reveal(inbox.search ?? "", span(t, 0.05, 0.3))
    : "";

  let body: ReactNode;
  if (mode === "thread" && inbox.thread) {
    const thread = inbox.thread;
    const messages = thread.messages.slice(0, show);
    const fresh = easeOut(span(t, 0.12, 0.26));
    body = (
      <div className="flex h-full flex-col overflow-hidden p-[clamp(10px,2.2cqw,22px)] text-[#202124]">
        <p className="text-[clamp(14px,2.2cqw,20px)] leading-snug">
          {thread.subject}
          <span className="ml-2 rounded bg-[#e8eaed] px-1.5 py-0.5 align-middle text-[0.6em] text-[#5f6368]">
            {messages.length} in this thread
          </span>
        </p>
        <div className="mt-[clamp(6px,1.6cqh,14px)] flex min-h-0 flex-1 flex-col justify-end gap-[clamp(5px,1.2cqh,10px)]">
          {messages.map((m, i) => {
            const isNew = i === messages.length - 1;
            return (
              <div
                key={i}
                className={`rounded-lg border px-3 py-[clamp(5px,1.1cqh,9px)] text-[clamp(11px,1.45cqw,14px)] ${isNew ? "border-[#1a73e8] bg-[#f2f6fc]" : "border-[#e3e6e8]"}`}
                style={
                  isNew
                    ? {
                        opacity: fresh,
                        transform: `translateY(${(1 - fresh) * 10}px)`,
                      }
                    : undefined
                }
              >
                <p className="flex items-center gap-2">
                  <span className="truncate font-semibold">{m.from}</span>
                  {m.note ? (
                    <span className="shrink-0 rounded bg-[#e6f4ea] px-1.5 text-[0.85em] font-medium text-[#188038]">
                      {m.note}
                    </span>
                  ) : null}
                  <span className="ml-auto shrink-0 text-[0.9em] text-[#5f6368]">
                    {m.time}
                  </span>
                </p>
                <p className="mt-0.5 line-clamp-2 text-[#3c4043]">{m.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (mode === "open" && inbox.open) {
    const open = inbox.open;
    body = (
      <div className="h-full overflow-hidden p-[clamp(12px,2.6cqw,24px)] text-[#202124]">
        <p className="text-[clamp(15px,2.4cqw,22px)] leading-snug">
          {open.subject}
        </p>
        <div className="mt-3 flex items-center gap-3 text-[clamp(11px,1.4cqw,13px)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7e57c2] text-[13px] font-semibold text-white">
            {open.from.charAt(0)}
          </span>
          <span className="min-w-0 flex-1 truncate font-semibold">
            {open.from}
          </span>
          <span className="text-[#5f6368]">{open.time}</span>
        </div>
        <div className="mt-[clamp(10px,2.4cqh,20px)] grid grid-cols-[auto_1fr] gap-x-6 gap-y-[clamp(2px,0.8cqh,6px)] text-[clamp(11px,1.5cqw,14px)]">
          {open.body.map(([label, value], i) => {
            const style = { opacity: t >= 0.1 + i * 0.05 ? 1 : 0 };
            return (
              <div key={label} className="contents">
                <span
                  className="text-[#5f6368] transition-opacity duration-300"
                  style={style}
                >
                  {label}
                </span>
                <span
                  className="truncate font-medium transition-opacity duration-300"
                  style={style}
                >
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (mode === "pile" && inbox.pile) {
    const rows = Array.from(
      { length: 26 },
      (_, i) => inbox.pile![i % inbox.pile!.length],
    );
    const shift = t * 9;
    body = (
      <div className="relative h-full overflow-hidden">
        <div
          style={{
            transform: `translateY(calc(-${shift} * clamp(30px,6.4cqh,44px)))`,
          }}
        >
          {rows.map((email, i) => (
            <Row key={i} email={email} narrow={narrow} unread={i % 3 === 0} />
          ))}
        </div>
        <p
          className="absolute right-3 bottom-3 rounded-full bg-[#202124] px-3 py-1.5 text-[clamp(11px,1.5cqw,14px)] font-semibold text-white shadow-md"
          style={{ opacity: easeOut(span(t, 0.25, 0.4)) }}
        >
          {inbox.count} order emails
        </p>
      </div>
    );
  } else {
    const fresh = inbox.newEmail;
    const land = easeOut(span(t, 0.22, 0.36));
    const showNew = mode === "match" || land > 0;
    const filtered = searching && t >= 0.36;
    body = (
      <div className="h-full overflow-hidden">
        {fresh && showNew ? (
          <Row
            email={fresh}
            narrow={narrow}
            unread
            chip={filtered}
            className={filtered ? "bg-[#e6f4ea]" : "bg-[#f2f6fc]"}
            style={
              mode === "arrive"
                ? {
                    opacity: land,
                    transform: `translateY(${(1 - land) * -12}px)`,
                  }
                : undefined
            }
          />
        ) : null}
        {inbox.emails.map((email) => {
          const dim = filtered && !email.order;
          return (
            <Row
              key={email.subject}
              email={email}
              narrow={narrow}
              chip={filtered && email.order}
              className={`transition-opacity duration-300 ${filtered && email.order ? "bg-[#e6f4ea]" : ""}`}
              style={{ opacity: dim ? 0.3 : 1 }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <Window title="Inbox · Gmail" icon={<MailIcon />}>
      <div className="flex h-full">
        {!narrow ? (
          <div className="w-40 shrink-0 p-3 text-[13px] text-[#3c4043]">
            <p className="mb-3 inline-block rounded-2xl bg-[#c2e7ff] px-4 py-3 font-medium">
              ✎ Compose
            </p>
            <p className="flex justify-between rounded-full bg-[#d3e3fd] px-3 py-1.5 font-bold">
              Inbox <span>{inbox.count}</span>
            </p>
            <p className="px-3 py-1.5">Starred</p>
            <p className="px-3 py-1.5">Sent</p>
            <p className="px-3 py-1.5">Drafts</p>
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 px-3 py-2">
            <p
              className={`flex min-w-0 flex-1 items-center gap-2 rounded-full px-4 py-[clamp(5px,1.2cqh,9px)] text-[clamp(11px,1.5cqw,14px)] ${
                searching ? "bg-white ring-1 ring-[#dadce0]" : "bg-[#eaf1fb]"
              }`}
            >
              <span aria-hidden="true">🔍</span>
              <span
                className={`truncate ${search ? "text-[#202124]" : "text-[#5f6368]"}`}
              >
                {search || "Search mail"}
              </span>
            </p>
            {!narrow && mode !== "thread" ? (
              <span className="shrink-0 text-[12px] text-[#5f6368]">
                1-50 of {inbox.count}
              </span>
            ) : null}
          </div>
          <div className="min-h-0 flex-1">{body}</div>
        </div>
      </div>
    </Window>
  );
}
