import { easeOut, span } from "@/components/demo/anim";
import { Window } from "@/components/demo/AppScenes";
import type { Demo } from "@/lib/demos/types";

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#ff7a59" />
      <circle cx="12" cy="10" r="3.2" fill="#fff" />
      <path d="M6.5 18a6 6 0 0 1 11 0" fill="#fff" />
    </svg>
  );
}

/**
 * A CRM contact record. "lead": the lead as the sequence runs, its emails in
 * the activity feed. "responded": their reply lands, the status changes, and
 * a follow-up task appears for the agent.
 */
export default function CrmScene({
  demo,
  t,
  narrow,
  mode,
}: {
  demo: Demo;
  t: number;
  narrow: boolean;
  mode: "lead" | "responded";
}) {
  const crm = demo.crm!;
  const responded = mode === "responded";
  const reply = easeOut(span(t, 0.12, 0.24));
  const changed = responded && t >= 0.34;
  const task = easeOut(span(t, 0.55, 0.66));
  const activity: { text: string; time: string; isReply: boolean }[] =
    !responded
      ? []
      : responded
        ? [
            { ...crm.reply, isReply: true },
            ...crm.activity.map((a) => ({ ...a, isReply: false })),
          ]
        : crm.activity.map((a) => ({ ...a, isReply: false }));

  return (
    <Window title={`${crm.name} · ${crm.app}`} icon={<ContactIcon />}>
      <div className={`flex h-full text-[#33475b] ${narrow ? "flex-col" : ""}`}>
        {/* The contact */}
        <div
          className={`shrink-0 border-[#dfe3eb] bg-[#f5f8fa] p-[clamp(10px,2cqw,20px)] ${narrow ? "border-b" : "w-[40%] border-r"}`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-[clamp(32px,6cqh,48px)] w-[clamp(32px,6cqh,48px)] shrink-0 items-center justify-center rounded-full bg-[#00a4bd] text-[clamp(12px,1.8cqw,16px)] font-semibold text-white">
              {crm.initials}
            </span>
            <p className="text-[clamp(14px,2.1cqw,20px)] leading-tight font-semibold text-[#33475b]">
              {crm.name}
            </p>
          </div>
          <dl
            className={`mt-[clamp(8px,2cqh,16px)] grid grid-cols-[auto_1fr] gap-x-3 text-[clamp(11px,1.45cqw,14px)] ${narrow ? "gap-y-0.5" : "gap-y-[clamp(3px,0.9cqh,7px)]"}`}
          >
            {crm.fields.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-[#7c98b6]">{k}</dt>
                <dd className="truncate">{v}</dd>
              </div>
            ))}
            <dt className="text-[#7c98b6]">{crm.status.label}</dt>
            <dd>
              <span
                className={`rounded px-1.5 py-0.5 font-semibold transition-colors duration-300 ${
                  changed
                    ? "bg-[#d6f5e8] text-[#00875a]"
                    : "bg-[#eaf0f6] text-[#33475b]"
                }`}
              >
                {changed ? crm.status.to : crm.status.from}
              </span>
            </dd>
          </dl>
        </div>

        {/* Activity and tasks */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col p-[clamp(10px,2cqw,20px)]">
          <p className="text-[11px] font-semibold tracking-wide text-[#7c98b6] uppercase">
            Activity
          </p>
          {activity.length === 0 ? (
            <p className="mt-2 text-[clamp(11px,1.45cqw,14px)] text-[#7c98b6]">
              New lead · first email being written
            </p>
          ) : null}
          <ul className="mt-2 space-y-[clamp(4px,1cqh,8px)] text-[clamp(11px,1.45cqw,14px)]">
            {activity.slice(0, narrow ? 1 : 4).map((a) => (
              <li
                key={a.text}
                className={`flex items-start gap-2 rounded-md px-2 py-1 ${a.isReply ? "bg-[#fff3e8] ring-1 ring-[#ff7a59]/40" : ""}`}
                style={
                  a.isReply
                    ? {
                        opacity: reply,
                        transform: `translateY(${(1 - reply) * -8}px)`,
                      }
                    : undefined
                }
              >
                <span aria-hidden="true">{a.isReply ? "↩" : "✉"}</span>
                <span className="min-w-0 flex-1 truncate">{a.text}</span>
                <span className="shrink-0 text-[#7c98b6]">{a.time}</span>
              </li>
            ))}
          </ul>
          {responded ? (
            <div
              className="mt-auto shrink-0 rounded-lg border border-[#dfe3eb] bg-white p-[clamp(8px,1.6cqw,14px)] shadow-sm"
              style={{
                opacity: task,
                transform: `translateY(${(1 - task) * 10}px)`,
              }}
            >
              <p className="text-[11px] font-semibold tracking-wide text-[#7c98b6] uppercase">
                New task
              </p>
              <p className="mt-1 flex items-center gap-2 text-[clamp(12px,1.6cqw,15px)] font-medium">
                <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[#7c98b6]" />
                {crm.task}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Window>
  );
}
