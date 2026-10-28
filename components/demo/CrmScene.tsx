import type { ReactNode } from "react";
import { easeOut, span } from "@/components/demo/anim";
import { Window } from "@/components/demo/AppScenes";
import type { Demo } from "@/lib/demos/types";

function Sprocket() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden="true">
      <g fill="none" stroke="#ff5c35" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="14" cy="14" r="4" />
        <path d="M14 10V5M17 17l3 3M10.6 11.6 6 8" />
      </g>
      <circle cx="14" cy="4" r="1.8" fill="#ff5c35" />
      <circle cx="5" cy="7.3" r="1.8" fill="#ff5c35" />
    </svg>
  );
}

const STAGE_PILL: Record<string, string> = {
  Lead: "bg-[#eaf0f6] text-[#33475b]",
  "In Sequence": "bg-[#7fd1de] text-[#213343]",
  Responded: "bg-[#00bda5] text-white",
};

/** Blurred placeholder, the way the real screenshots hide contact details. */
function Hidden({ width }: { width: string }) {
  return (
    <span
      className="inline-block h-[0.9em] rounded bg-[#9fb3c8] align-middle opacity-60 blur-[3px]"
      style={{ width }}
    />
  );
}

/**
 * HubSpot, as its index pages look: the object switcher, saved-view tabs,
 * the toolbar and quick filters, then the table. "lead": a new contact lands
 * at the top. "responded": the lead's lifecycle stage changes, then the
 * Tasks page shows the follow-up task created for the agent.
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
  const showTasks = responded && t >= 0.5;
  const arrive = responded ? 1 : easeOut(span(t, 0.12, 0.3));
  const changed = responded && t >= 0.22;
  const taskIn = easeOut(span(t, 0.58, 0.7));
  const stage = !responded
    ? crm.stages.lead
    : changed
      ? crm.stages.responded
      : crm.stages.sequence;

  const object = showTasks ? "Tasks" : "Contacts";
  const tabs = showTasks
    ? ["All tasks", "Due today", "Overdue", "Upcoming"]
    : ["All contacts", "My contacts", "Unassigned contacts"];
  const count = showTasks ? 1 : crm.contacts.length + (arrive > 0.5 ? 1 : 0);
  const filters = showTasks
    ? ["Assigned to", "Task type", "Task stage", "Due date"]
    : ["Contact owner", "Create date", "Last activity date", "Lead status"];

  const th =
    "border-b border-[#cbd6e2] px-2 py-[clamp(5px,1.2cqh,9px)] text-left text-[0.85em] font-semibold tracking-wide whitespace-nowrap uppercase";
  const td =
    "truncate border-b border-[#dfe3eb] px-2 py-[clamp(5px,1.3cqh,10px)]";
  const check = (
    <span className="inline-block h-[1.1em] w-[1.1em] rounded-[3px] border border-[#7c98b6] bg-white align-middle" />
  );
  const avatar = (initials: string) => (
    <span className="flex h-[1.9em] w-[1.9em] shrink-0 items-center justify-center rounded-full bg-[#eaf0f6] text-[0.82em] text-[#33475b]">
      {initials}
    </span>
  );
  const pill = (text: string, cls: string) => (
    <span
      className={`rounded-[3px] px-2 py-0.5 font-semibold whitespace-nowrap ${cls}`}
    >
      {text}
    </span>
  );

  const contactRow = (
    c: { name: string; initials: string },
    stageText: string,
    extra?: ReactNode,
    style?: React.CSSProperties,
    highlight?: boolean,
  ) => (
    <tr
      key={c.name}
      style={style}
      className={highlight ? "bg-[#e5f8f6]" : undefined}
    >
      <td className={`${td} w-9`}>{check}</td>
      <td className={td}>
        <span className="flex min-w-0 items-center gap-2">
          {avatar(c.initials)}
          <span className="truncate font-semibold text-[#0091ae]">
            {c.name}
          </span>
        </span>
      </td>
      {!narrow ? (
        <>
          <td className={td}>
            <Hidden width="80%" />
          </td>
          <td className={td}>
            <Hidden width="65%" />
          </td>
        </>
      ) : null}
      <td className={td}>
        {pill(stageText, STAGE_PILL[stageText] ?? STAGE_PILL.Lead)}
        {extra}
      </td>
    </tr>
  );

  return (
    <Window title={`${object} | HubSpot`} icon={<Sprocket />}>
      <div className="flex h-full text-[clamp(10px,1.3cqw,13px)] text-[#33475b]">
        {/* HubSpot's navigation rail */}
        {!narrow ? (
          <div className="flex w-[clamp(28px,4cqw,40px)] shrink-0 flex-col items-center gap-3 bg-[#213343] py-2.5">
            <Sprocket />
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-[1.1em] w-[1.1em] rounded-[3px] ${i === (showTasks ? 1 : 0) ? "bg-white/90" : "bg-white/35"}`}
              />
            ))}
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col bg-[#f5f8fa] p-[clamp(6px,1.2cqw,12px)]">
          {/* Object switcher, view tabs, Add button */}
          <div className="flex items-end gap-1 whitespace-nowrap">
            <span className="mb-1 rounded-[3px] border border-[#cbd6e2] bg-[#eaf0f6] px-2 py-1">
              {object} ▾
            </span>
            {tabs.slice(0, narrow ? 1 : tabs.length).map((tab, i) => (
              <span
                key={tab}
                className={`truncate rounded-t-[3px] border border-b-0 border-[#cbd6e2] px-3 py-1.5 ${
                  i === 0 ? "bg-white font-semibold" : "bg-[#eaf0f6]"
                }`}
              >
                {tab}
                {i === 0 ? (
                  <span className="ml-1.5 rounded-full bg-[#33475b] px-1.5 text-[0.85em] text-white">
                    {count}
                  </span>
                ) : null}
              </span>
            ))}
            <span className="mb-1 ml-auto rounded-[3px] bg-[#ff5c35] px-2.5 py-1 font-semibold text-white">
              Add {object.toLowerCase()} ▾
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col rounded-b-[3px] rounded-tr-[3px] border border-[#cbd6e2] bg-white p-[clamp(6px,1.2cqw,12px)]">
            {/* Toolbar */}
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="flex w-[30%] items-center justify-between rounded-[3px] border border-[#cbd6e2] px-2 py-1 text-[#7c98b6]">
                Search <span aria-hidden="true">⌕</span>
              </span>
              <span className="rounded-[3px] border border-[#cbd6e2] px-2 py-1">
                Table view ▾
              </span>
              {!narrow ? (
                <>
                  <span className="rounded-[3px] border border-[#cbd6e2] px-2 py-1">
                    Edit columns
                  </span>
                  <span className="rounded-[3px] border border-[#cbd6e2] bg-[#eaf0f6] px-2 py-1">
                    Filters
                  </span>
                  <span className="rounded-[3px] border border-[#cbd6e2] px-2 py-1">
                    Sort
                  </span>
                  <span className="rounded-[3px] border border-[#cbd6e2] px-2 py-1">
                    Export
                  </span>
                </>
              ) : null}
            </div>
            {/* Quick filters */}
            <div className="mt-2 flex gap-[clamp(8px,1.8cqw,18px)] overflow-hidden font-semibold whitespace-nowrap text-[#0091ae]">
              {filters.slice(0, narrow ? 2 : 4).map((f) => (
                <span key={f}>{f} ▾</span>
              ))}
              {!narrow ? <span>Advanced filters</span> : null}
            </div>

            {/* The table */}
            <div className="relative mt-2 min-h-0 flex-1 overflow-hidden rounded-[3px] border border-[#cbd6e2]">
              {showTasks ? (
                <table className="demo-fade w-full table-fixed border-collapse">
                  <thead className="bg-[#f5f8fa]">
                    <tr>
                      <th className={`${th} w-9`}>{check}</th>
                      <th className={th}>Task title</th>
                      <th className={th}>Task stage</th>
                      {!narrow ? <th className={th}>Task → Contacts</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{
                        opacity: taskIn,
                        transform: `translateY(${(1 - taskIn) * -8}px)`,
                      }}
                      className="bg-[#e5f8f6]"
                    >
                      <td className={td}>{check}</td>
                      <td className={td}>
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="h-[1.2em] w-[1.2em] shrink-0 rounded-full border border-[#7c98b6]" />
                          <span className="truncate font-semibold text-[#0091ae]">
                            {crm.task.title}
                          </span>
                        </span>
                      </td>
                      <td className={td}>
                        {pill(crm.task.stage, "bg-[#00a4bd] text-white")}
                      </td>
                      {!narrow ? (
                        <td className={td}>
                          <span className="flex items-center gap-2 font-semibold text-[#0091ae]">
                            {avatar(crm.lead.initials)}
                            {crm.lead.name}
                          </span>
                        </td>
                      ) : null}
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="w-full table-fixed border-collapse">
                  <thead className="bg-[#f5f8fa]">
                    <tr>
                      <th className={`${th} w-9`}>{check}</th>
                      <th className={th}>Name</th>
                      {!narrow ? (
                        <>
                          <th className={th}>Email</th>
                          <th className={th}>Phone number</th>
                        </>
                      ) : null}
                      <th className={th}>
                        {crm.stageLabel ?? "Lifecycle stage"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactRow(
                      crm.lead,
                      stage,
                      null,
                      {
                        opacity: arrive,
                        transform: `translateY(${(1 - arrive) * -8}px)`,
                      },
                      !responded || changed,
                    )}
                    {crm.contacts.map((c) => contactRow(c, c.stage))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}
