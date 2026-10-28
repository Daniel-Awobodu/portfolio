import type { CSSProperties, ReactNode } from "react";
import { easeOut, reveal, span } from "@/components/demo/anim";
import { Window } from "@/components/demo/AppScenes";
import type { Attachment, Demo, InboxEmail } from "@/lib/demos/types";

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
  sorted = 0,
}: {
  email: InboxEmail;
  unread?: boolean;
  narrow: boolean;
  className?: string;
  style?: CSSProperties;
  chip?: boolean;
  /** How far the assistant's labels and star have appeared (0 to 1). */
  sorted?: number;
}) {
  const star = email.starred && sorted > 0.5;
  return (
    <div
      className={`flex h-[clamp(30px,6.4cqh,44px)] items-center gap-3 border-b border-[#f1f3f4] px-3 text-[clamp(11px,1.5cqw,14px)] ${className}`}
      style={style}
    >
      {!narrow ? (
        <span
          aria-hidden="true"
          className={star ? "text-[#1a73e8]" : "text-[#c4c7c5]"}
        >
          {star ? "★" : "☆"}
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
        {email.labels && sorted > 0
          ? email.labels.map((label) => (
              <span
                key={label}
                className="mr-1 rounded-[3px] border border-[#c4c7c5] bg-[#f1f3f4] px-1 text-[0.8em] text-[#444746]"
                style={{ opacity: sorted }}
              >
                {label}
              </span>
            ))
          : null}
        <span
          className={unread ? "font-bold text-[#202124]" : "text-[#202124]"}
        >
          {email.subject}
        </span>
        {email.attachment && !narrow ? (
          <span className="ml-1.5 rounded-full border border-[#dadce0] px-1.5 text-[0.8em] text-[#3c4043]">
            📎 {email.attachment.name}
          </span>
        ) : null}
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

const FILE_COLORS: Record<Attachment["kind"], string> = {
  pdf: "#ea4335",
  txt: "#4285f4",
  csv: "#0f9d58",
  xlsx: "#0f9d58",
  image: "#f4b400",
};

/** A Gmail attachment card: a page preview over the file's name. */
function AttachmentCard({
  file,
  shown,
  compact,
}: {
  file: Attachment;
  shown: number;
  compact?: boolean;
}) {
  return (
    <div
      className="overflow-hidden rounded border border-[#dadce0] bg-white"
      style={{ opacity: shown, transform: `translateY(${(1 - shown) * 6}px)` }}
    >
      <div
        className={`flex flex-col gap-[3px] bg-[#f8f9fa] px-2 pt-2 ${compact ? "hidden" : "h-[clamp(26px,7cqh,52px)]"}`}
      >
        {file.kind === "image" ? (
          <span className="h-full rounded-sm bg-[linear-gradient(135deg,#d7ccc8,#a1887f)] opacity-70" />
        ) : (
          [80, 60, 70, 45].map((w) => (
            <span
              key={w}
              className="h-[2px] rounded bg-[#c4c7c5]"
              style={{ width: `${w}%` }}
            />
          ))
        )}
      </div>
      <p className="flex items-center gap-1 border-t border-[#dadce0] px-1.5 py-1 text-[clamp(9px,1.15cqw,11px)]">
        <span
          className="shrink-0 rounded-[2px] px-0.5 text-[0.75em] font-bold text-white uppercase"
          style={{ background: FILE_COLORS[file.kind] }}
        >
          {file.kind === "image" ? "img" : file.kind}
        </span>
        <span className="truncate">{file.name}</span>
      </p>
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
  mode: "arrive" | "match" | "pile" | "open" | "thread" | "sort";
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
                {isNew && m.lines ? (
                  <div className="mt-1 text-[#3c4043]">
                    {m.lines.map((line, l) => (
                      <p
                        key={l}
                        className={`transition-opacity duration-300 ${line ? "" : "h-[0.6em]"} ${t >= 0.2 + (l * 0.45) / m.lines!.length ? "opacity-100" : "opacity-0"}`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-0.5 line-clamp-2 text-[#3c4043]">
                    {m.body}
                    {m.attachments ? (
                      <span className="ml-2 rounded bg-[#e8eaed] px-1.5 text-[0.85em] text-[#5f6368]">
                        📎 {m.attachments} attachments
                      </span>
                    ) : null}
                  </p>
                )}
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
        {open.text ? (
          <div className="mt-[clamp(8px,2cqh,16px)] text-[clamp(11px,1.45cqw,14px)] leading-snug">
            {(narrow ? (open.brief ?? open.text) : open.text).map((line, i) => (
              <p key={i} className={line ? "" : "h-[0.7em]"}>
                {line}
              </p>
            ))}
          </div>
        ) : null}
        {open.attachments ? (
          <div className="mt-[clamp(8px,2cqh,16px)] border-t border-dashed border-[#dadce0] pt-2">
            <p className="text-[clamp(11px,1.4cqw,13px)] font-semibold">
              {open.attachments.length}{" "}
              {open.attachments.length === 1 ? "Attachment" : "Attachments"}
              <span className="font-normal text-[#5f6368]">
                {" "}
                · Scanned by Gmail
              </span>
            </p>
            <div
              className={`mt-1.5 grid gap-[clamp(4px,0.8cqw,8px)] ${narrow ? "grid-cols-2" : "grid-cols-5"}`}
            >
              {open.attachments.map((a, i) => (
                <AttachmentCard
                  key={a.name}
                  file={a}
                  compact={narrow}
                  shown={easeOut(span(t, 0.12 + i * 0.08, 0.22 + i * 0.08))}
                />
              ))}
            </div>
          </div>
        ) : null}
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
  } else if (mode === "sort") {
    body = (
      <div className="h-full overflow-hidden">
        {inbox.emails.map((email, i) => (
          <Row
            key={email.subject}
            email={email}
            narrow={narrow}
            unread
            sorted={easeOut(span(t, 0.12 + i * 0.1, 0.24 + i * 0.1))}
          />
        ))}
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
            {inbox.labels ? (
              <>
                <p className="mt-3 px-3 py-1 font-medium">Labels</p>
                {inbox.labels.map((label) => (
                  <p key={label} className="truncate px-3 py-1 pl-5">
                    ▸ {label}
                  </p>
                ))}
              </>
            ) : null}
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className={`items-center gap-3 px-3 py-2 ${narrow && mode === "open" ? "hidden" : "flex"}`}
          >
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
