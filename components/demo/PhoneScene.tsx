import type { ReactNode } from "react";
import { easeOut, span } from "@/components/demo/anim";
import Receipt from "@/components/demo/Receipt";
import type { ChatMessage, ChatThread, Demo } from "@/lib/demos/types";

/** A phone sized to the stage height. Inside it, `cqw` is the phone's width. */
export function Phone({
  children,
  className = "absolute inset-0 flex items-start justify-center pt-[3cqh]",
  height = "h-[82cqh]",
}: {
  children: ReactNode;
  className?: string;
  height?: string;
}) {
  return (
    <div className={className}>
      <div
        className={`relative aspect-[9/19] ${height} rounded-[11%/5.2%] bg-[#141311] p-[2.6%] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 [container-type:size]`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[9%/4.3%] bg-black">
          {children}
          <span
            aria-hidden="true"
            className="absolute top-[1.4%] left-1/2 h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-[#141311]"
          />
        </div>
      </div>
    </div>
  );
}

function Ticks({ read }: { read: boolean }) {
  return (
    <svg
      viewBox="0 0 18 11"
      className="inline-block h-[0.75em] w-[1.2em]"
      aria-hidden="true"
    >
      <path
        d="M1 6l3 3 6-7M7 8l1 1 6-7"
        fill="none"
        stroke={read ? "#53bdeb" : "#8696a0"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Bubble({
  message,
  demo,
  variant,
  t,
}: {
  message: ChatMessage;
  demo: Demo;
  variant: "whatsapp" | "sms" | "web";
  t: number;
}) {
  const sms = variant === "sms";
  const web = variant === "web";
  const start = message.at ?? -1;
  const opacity =
    message.at === undefined ? 1 : easeOut(span(t, start, start + 0.08));
  const mine = message.from === "me";
  const read = message.at === undefined || t >= start + 0.4;

  if (message.typing) {
    if (t < start || t >= (message.until ?? 1)) return null;
    return (
      <div className="flex justify-start" style={{ opacity }}>
        <div className="flex gap-[1.2cqw] rounded-[2.2cqw] rounded-tl-none bg-white px-[3.5cqw] py-[3cqw] shadow-sm">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-[1.8cqw] w-[1.8cqw] rounded-full bg-[#8696a0]"
              style={{ opacity: 0.35 + 0.65 * Math.abs(Math.sin(t * 22 + i)) }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (message.at !== undefined && t < start) return null;

  return (
    <div
      className={`flex ${mine ? "justify-end" : "justify-start"}`}
      style={{ opacity, transform: `translateY(${(1 - opacity) * 8}px)` }}
    >
      <div
        className={
          web
            ? `max-w-[82%] rounded-[2.6cqw] px-[3.4cqw] py-[2.4cqw] shadow-sm ${mine ? "bg-[#10b39a] text-white" : "bg-white"}`
            : sms
              ? `max-w-[80%] rounded-[4cqw] px-[3.6cqw] py-[2.4cqw] ${mine ? "bg-[#0b57d0] text-white" : "bg-[#e9eef6]"}`
              : `max-w-[80%] rounded-[2.2cqw] px-[2.4cqw] pt-[1.6cqw] pb-[1.2cqw] shadow-sm ${
                  mine
                    ? "rounded-tr-none bg-[#d9fdd3]"
                    : "rounded-tl-none bg-white"
                }`
        }
      >
        {message.image ? (
          <div className="overflow-hidden rounded-[1.6cqw] bg-[#2b2f2d] p-[2.5cqw] text-[3cqw]">
            <div
              className="origin-top -rotate-2"
              style={message.blurry ? { filter: "blur(2.2px)" } : undefined}
            >
              <Receipt receipt={demo.receipt!} />
            </div>
          </div>
        ) : null}
        {message.voice ? (
          <div className="flex items-center gap-[2cqw] py-[1cqw] pr-[1cqw]">
            <span className="flex h-[8cqw] w-[8cqw] shrink-0 items-center justify-center rounded-full bg-[#00a884] text-[3.4cqw] text-white">
              ▶
            </span>
            <span
              className="flex h-[7cqw] items-center gap-[0.7cqw]"
              aria-hidden="true"
            >
              {Array.from({ length: 22 }, (_, i) => (
                <span
                  key={i}
                  className="w-[0.8cqw] rounded-full bg-[#8696a0]"
                  style={{
                    height: `${30 + 70 * Math.abs(Math.sin(i * 1.7 + 0.6))}%`,
                  }}
                />
              ))}
            </span>
            <span className="text-[3cqw] text-[#667781]">{message.voice}</span>
          </div>
        ) : null}
        {message.text ? (
          <p
            className={`${sms ? "text-[5cqw]" : "text-[4.3cqw]"} leading-snug whitespace-pre-line ${(sms || web) && mine ? "text-white" : "text-[#111b21]"}`}
          >
            {message.text}
          </p>
        ) : null}
        {sms || web ? null : (
          <p className="mt-[0.6cqw] flex items-center justify-end gap-[1cqw] text-[3cqw] text-[#667781]">
            {message.time}
            {mine ? <Ticks read={read} /> : null}
          </p>
        )}
      </div>
    </div>
  );
}

function Chat({
  demo,
  thread,
  messages,
  t,
}: {
  demo: Demo;
  thread: ChatThread;
  messages: ChatMessage[];
  t: number;
}) {
  if (thread.app === "web") {
    return (
      <div className="flex h-full flex-col bg-[#f2f3f7]">
        <div className="bg-[#12122e] px-[5cqw] pt-[13cqw] pb-[4cqw] text-white">
          <p className="text-[6cqw] leading-tight font-bold">
            {thread.contact}
          </p>
          {thread.status ? (
            <p className="mt-[1cqw] text-[3.6cqw] opacity-85">
              {thread.status}
            </p>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col justify-end gap-[2.2cqw] overflow-hidden px-[3cqw] py-[3cqw]">
          {messages.map((message, i) => (
            <Bubble key={i} message={message} demo={demo} variant="web" t={t} />
          ))}
        </div>
        <div className="flex items-center gap-[2cqw] border-t border-[#e3e6ee] bg-white px-[3cqw] py-[2.6cqw] pb-[6cqw]">
          <span className="flex-1 text-[3.8cqw] text-[#8a8fa3]">
            Type your message…
          </span>
          <span className="text-[4.4cqw] text-[#10b39a]">➤</span>
        </div>
      </div>
    );
  }

  if (thread.app === "sms") {
    const last = messages[messages.length - 1];
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center gap-[3cqw] border-b border-[#e3e6e8] px-[4cqw] pt-[13cqw] pb-[3cqw] text-[#1f1f1f]">
          <span aria-hidden="true" className="text-[5cqw]">
            ←
          </span>
          <span className="flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full bg-[#c2e7ff] text-[3.6cqw] font-semibold text-[#004a77]">
            {thread.initials}
          </span>
          <span className="block text-[4.6cqw] leading-tight font-semibold">
            {thread.contact}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-[2.2cqw] overflow-hidden px-[3cqw] py-[3cqw]">
          <p className="mx-auto text-[3cqw] text-[#5f6368]">
            Text message · {last?.time}
          </p>
          {messages.map((message, i) => (
            <Bubble key={i} message={message} demo={demo} variant="sms" t={t} />
          ))}
        </div>
        <div className="flex items-center gap-[2cqw] px-[3cqw] pb-[6cqw]">
          <span className="flex-1 rounded-full bg-[#f1f3f4] px-[4cqw] py-[2.6cqw] text-[3.8cqw] text-[#5f6368]">
            Text message
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#efeae2]">
      <div className="flex items-center gap-[3cqw] bg-[#008069] px-[4cqw] pt-[13cqw] pb-[3cqw] text-white">
        <span aria-hidden="true" className="text-[5cqw]">
          ←
        </span>
        <span className="flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full bg-[#dfe5e7] text-[3.6cqw] font-semibold text-[#54656f]">
          {thread.initials}
        </span>
        <span>
          <span className="block text-[4.6cqw] leading-tight font-semibold">
            {thread.contact}
          </span>
          {thread.status ? (
            <span className="block text-[3.2cqw] leading-tight opacity-85">
              {thread.status}
            </span>
          ) : null}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-[2.2cqw] overflow-hidden px-[3cqw] py-[3cqw]">
        <p className="mx-auto rounded-[1.6cqw] bg-white/80 px-[2.4cqw] py-[0.8cqw] text-[3cqw] text-[#54656f]">
          Today
        </p>
        {messages.map((message, i) => (
          <Bubble
            key={i}
            message={message}
            demo={demo}
            variant="whatsapp"
            t={t}
          />
        ))}
      </div>
      <div className="flex items-center gap-[2cqw] px-[3cqw] pb-[6cqw]">
        <span className="flex-1 rounded-full bg-white px-[4cqw] py-[2.6cqw] text-[3.8cqw] text-[#8696a0]">
          Message
        </span>
        <span className="flex h-[10cqw] w-[10cqw] items-center justify-center rounded-full bg-[#008069] text-[4cqw] text-white">
          ➤
        </span>
      </div>
    </div>
  );
}

function Camera({ demo, t }: { demo: Demo; t: number }) {
  const flash = Math.max(0, 1 - Math.abs(t - 0.56) / 0.07);
  const preview = t >= 0.62;
  const press = t >= 0.86;
  return (
    <div className="relative h-full w-full bg-[#0d0d0d]">
      <div className="absolute inset-x-0 top-[9cqw] text-center text-[3.6cqw] font-semibold text-white/80">
        {preview ? `Send to ${demo.chat!.contact}` : "Photo"}
      </div>
      <div className="absolute inset-x-[6%] top-[20%] bottom-[24%] flex items-center justify-center overflow-hidden rounded-[2cqw] bg-[#3b3a36]">
        <div className="-rotate-3 text-[4.2cqw]">
          <Receipt receipt={demo.receipt!} />
        </div>
        {!preview
          ? [
              "top-[4%] left-[4%] border-t-2 border-l-2",
              "top-[4%] right-[4%] border-t-2 border-r-2",
              "bottom-[4%] left-[4%] border-b-2 border-l-2",
              "bottom-[4%] right-[4%] border-b-2 border-r-2",
            ].map((c) => (
              <span
                key={c}
                className={`absolute h-[10%] w-[14%] border-white/90 ${c}`}
              />
            ))
          : null}
      </div>
      {preview ? (
        <div className="absolute inset-x-[5%] bottom-[7%] flex items-center gap-[2.5cqw]">
          <span className="flex-1 rounded-full bg-white/15 px-[4cqw] py-[2.8cqw] text-[3.6cqw] text-white/70">
            Add a caption…
          </span>
          <span
            className="flex h-[12cqw] w-[12cqw] items-center justify-center rounded-full bg-[#25d366] text-[4.6cqw] text-[#0b141a] transition-transform"
            style={{ transform: press ? "scale(0.88)" : "none" }}
          >
            ➤
          </span>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-[7%] flex justify-center">
          <span className="h-[16cqw] w-[16cqw] rounded-full border-[1.2cqw] border-white bg-white/20" />
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: flash }}
      />
    </div>
  );
}

/** When a notified message opens in its thread, as progress through the beat. */
const OPEN_AT = 0.5;

/** The lock screen, with a new message dropping in as a notification. */
function LockScreen({
  thread,
  message,
  t,
}: {
  thread: ChatThread;
  message: ChatMessage;
  t: number;
}) {
  const drop = easeOut(span(t, 0.08, 0.2));
  return (
    <div className="flex h-full flex-col items-center bg-[linear-gradient(160deg,#1f3a5f,#0d1b2a_60%,#2a1f3d)] px-[5cqw] pt-[20cqw] text-white">
      <p className="text-[4cqw] opacity-80">Monday 2 November</p>
      <p className="text-[19cqw] leading-none font-light tracking-tight">
        {message.time}
      </p>
      <div
        className="mt-[8cqw] w-full rounded-[4cqw] bg-white/85 px-[4cqw] py-[3cqw] text-[#111] shadow-lg backdrop-blur"
        style={{
          opacity: drop,
          transform: `translateY(${(1 - drop) * -40}px)`,
        }}
      >
        <p className="flex items-center gap-[2cqw] text-[3.4cqw] text-[#555]">
          <span className="flex h-[5cqw] w-[5cqw] items-center justify-center rounded-[1.2cqw] bg-[#34c759] text-[3cqw] text-white">
            ✉
          </span>
          <span className="font-semibold tracking-wide uppercase">
            Messages
          </span>
          <span className="ml-auto">now</span>
        </p>
        <p className="mt-[1.5cqw] text-[4.2cqw] font-semibold">
          {thread.contact}
        </p>
        <p className="line-clamp-3 text-[4cqw] leading-snug">{message.text}</p>
      </div>
    </div>
  );
}

/** The phone scenes: the paper receipt, the camera, and the WhatsApp chat. */
export default function PhoneScene({
  demo,
  scene,
  messages,
  thread,
  notify = false,
  t,
}: {
  demo: Demo;
  scene: "object" | "camera" | "chat";
  messages: ChatMessage[];
  /** A key of the demo's `threads`; its `chat` when omitted. */
  thread?: string;
  /** Show the last message arriving on the lock screen first. */
  notify?: boolean;
  t: number;
}) {
  if (scene === "object") {
    const rise = easeOut(span(t, 0, 0.3));
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3cqh] bg-[radial-gradient(circle_at_50%_40%,#2b3a33,#0b100e)]">
        <p
          className="rounded-full bg-white/10 px-[1.4em] py-[0.4em] text-[clamp(11px,2.6cqh,15px)] font-semibold tracking-wide text-white/85"
          style={{ opacity: rise }}
        >
          ⛽ Fuel stop
        </p>
        <div
          className="text-[3.3cqh]"
          style={{
            opacity: rise,
            transform: `translateY(${(1 - rise) * 30}px) rotate(-3deg)`,
          }}
        >
          <Receipt receipt={demo.receipt!} />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#2b3a33,#0b100e)]">
      <Phone>
        {scene === "camera" ? (
          <Camera demo={demo} t={t} />
        ) : notify && t < OPEN_AT ? (
          <LockScreen
            thread={thread ? demo.threads![thread] : demo.chat!}
            message={messages[messages.length - 1]}
            t={t}
          />
        ) : (
          <Chat
            demo={demo}
            thread={thread ? demo.threads![thread] : demo.chat!}
            messages={
              notify
                ? messages.map((m) =>
                    m.at !== undefined ? { ...m, at: OPEN_AT } : m,
                  )
                : messages
            }
            t={t}
          />
        )}
      </Phone>
    </div>
  );
}
