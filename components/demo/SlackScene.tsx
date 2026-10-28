import { easeOut, span } from "@/components/demo/anim";
import { Window } from "@/components/demo/AppScenes";
import type { Beat, Demo } from "@/lib/demos/types";

type SlackBeat = Extract<Beat, { scene: "slack" }>;

function SlackLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden="true">
      <rect x="9" y="2" width="3.5" height="9" rx="1.75" fill="#36c5f0" />
      <rect x="11.5" y="13" width="3.5" height="9" rx="1.75" fill="#2eb67d" />
      <rect x="2" y="11.5" width="9" height="3.5" rx="1.75" fill="#e01e5a" />
      <rect x="13" y="9" width="9" height="3.5" rx="1.75" fill="#ecb22e" />
    </svg>
  );
}

/**
 * Slack in dark mode, as the approval channel looks: the workspace side bar,
 * the channel, and the bot's message with every item, the subtotal, a preview
 * of the reply and the Approve and Reject buttons.
 */
export default function SlackScene({
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
  const slack = demo.slack!;
  const beat = demo.beats[beatIndex] as SlackBeat;
  const msg = slack.messages[beat.message];
  const arrive = easeOut(span(t, 0.06, 0.2));
  const pressed = beat.approve && t >= 0.62;
  const done = beat.approve ? easeOut(span(t, 0.68, 0.8)) : 0;
  const items = msg.items.slice(0, narrow ? 2 : 3);

  return (
    <Window
      title={`#${slack.channel} · ${slack.workspace} · Slack`}
      icon={<SlackLogo />}
    >
      <div className="flex h-full bg-[#1a1d21] text-[clamp(10px,1.3cqw,13px)] text-[#d1d2d3]">
        {!narrow ? (
          <div className="w-[20%] min-w-[110px] shrink-0 border-r border-white/10 bg-[#19171d] py-2">
            <p className="truncate px-3 pb-2 text-[1.1em] font-bold text-white">
              {slack.workspace}
            </p>
            {slack.channels.map((c) => (
              <p
                key={c}
                className={`truncate px-3 py-[3px] ${c === slack.channel ? "bg-[#1164a3] font-semibold text-white" : "text-[#9a9b9e]"}`}
              >
                # {c}
              </p>
            ))}
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="border-b border-white/10 px-3 py-2 font-bold text-white">
            # {slack.channel}
          </p>
          <div
            className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-3 pb-3"
            style={{
              opacity: arrive,
              transform: `translateY(${(1 - arrive) * 12}px)`,
            }}
          >
            <div className="flex gap-2.5">
              <span className="flex h-[2.4em] w-[2.4em] shrink-0 items-center justify-center rounded-md bg-[#2bac76] font-bold text-white">
                {slack.bot.charAt(0)}
              </span>
              <div className="min-w-0 flex-1 leading-snug">
                <p>
                  <span className="font-bold text-white">{slack.bot}</span>
                  <span className="ml-1.5 rounded-[3px] bg-white/15 px-1 text-[0.75em] font-semibold">
                    APP
                  </span>
                  <span className="ml-1.5 text-[0.85em] text-[#9a9b9e]">
                    {msg.time}
                  </span>
                </p>
                <p className="mt-0.5 font-bold text-white">{msg.title}</p>
                {msg.lead?.map((line) => (
                  <p key={line} className="font-semibold text-white">
                    {line}
                  </p>
                ))}
                {msg.meta.slice(0, narrow ? 1 : undefined).map(([k, v]) => (
                  <p key={k} className="truncate">
                    {k ? `${k}: ` : ""}
                    {v}
                  </p>
                ))}
                {msg.summary ? (
                  <p className="mt-1 font-semibold text-white">{msg.summary}</p>
                ) : null}
                {msg.status ? (
                  <p>
                    {msg.status.icon} {msg.status.text}
                  </p>
                ) : null}
                {msg.items.length ? (
                  <p className="mt-1 font-semibold text-white">Item Summary:</p>
                ) : null}
                {items.map((item, i) => (
                  <div key={item.asked} className="truncate">
                    <p className="truncate">
                      {i + 1}. {item.asked}
                    </p>
                    <p className="truncate pl-3 text-[#c5c6c8]">
                      → {item.matched}
                    </p>
                  </div>
                ))}
                {msg.more ? (
                  <p className="text-[#9a9b9e]">
                    + {msg.more + msg.items.length - items.length} more
                  </p>
                ) : null}
                {msg.preview && !narrow ? (
                  <div className="mt-1.5 rounded border border-white/15 bg-[#222529] px-2 py-1 font-mono text-[0.85em] text-[#c5c6c8]">
                    {msg.preview.map((line, i) => (
                      <p key={i} className="truncate">
                        {line || " "}
                      </p>
                    ))}
                  </div>
                ) : null}
                {msg.quote ? (
                  <p className="mt-1.5 border-l-4 border-white/30 pl-2.5 text-[#d1d2d3]">
                    {msg.quote}
                  </p>
                ) : null}
                {msg.link ? (
                  <p className="mt-1.5">
                    <span className="text-[#1d9bd1]">{msg.link[0]}</span> ·{" "}
                    {msg.link[1]}
                  </p>
                ) : null}
                {msg.footer ? (
                  <p className="text-[0.92em] text-[#9a9b9e] italic">
                    {msg.footer}
                  </p>
                ) : null}
                {msg.buttons ? (
                  <>
                    {!narrow ? (
                      <>
                        <p className="mt-1.5 text-[#1d9bd1]">
                          🔗 Open Gmail Draft to Edit
                        </p>
                        <p className="truncate text-[0.92em] text-[#9a9b9e]">
                          No reply in 2 days? The draft is not sent.
                        </p>
                      </>
                    ) : null}
                    <div className="mt-1.5 flex gap-2">
                      <span className="rounded border border-white/30 px-2.5 py-0.5 font-semibold">
                        Reject
                      </span>
                      <span
                        className={`rounded px-2.5 py-0.5 font-semibold text-white transition-transform duration-150 ${pressed ? "scale-95 bg-[#005e46] ring-2 ring-[#2bac76]" : "bg-[#007a5a]"}`}
                      >
                        Approve
                      </span>
                    </div>
                  </>
                ) : null}
                {beat.approve ? (
                  <p
                    className="mt-1.5 font-semibold text-[#2bac76]"
                    style={{ opacity: done }}
                  >
                    ✅ Approved by {slack.approvedBy}. Reply sent in the
                    customer&apos;s thread.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}
