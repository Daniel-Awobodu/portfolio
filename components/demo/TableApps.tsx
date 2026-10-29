import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { easeOut, span } from "@/components/demo/anim";
import { Window } from "@/components/demo/AppScenes";
import type { Demo, FieldKind } from "@/lib/demos/types";

type Sheet = NonNullable<Demo["sheet"]>;

/** New records arriving one after another, each easing in. */
function arrivals(sheet: Sheet, t: number) {
  const fresh = sheet.newRows ?? (sheet.newRow ? [sheet.newRow] : []);
  // Spread over the first three quarters of the beat, however many arrive.
  const step = Math.min(0.18, 0.6 / Math.max(1, fresh.length));
  return fresh.map((row, i) => ({
    row,
    p: easeOut(span(t, 0.15 + i * step, 0.27 + i * step)),
  }));
}

function FieldIcon({ kind }: { kind: FieldKind }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-[1.05em] w-[1.05em] shrink-0 opacity-70"
      aria-hidden="true"
    >
      {kind === "select" ? (
        <g {...common}>
          <circle cx="8" cy="8" r="6" />
          <path d="m5.5 7 2.5 2.5L10.5 7" />
        </g>
      ) : kind === "number" ? (
        <path
          d="M6 2.5 4.5 13.5M11.5 2.5 10 13.5M2.5 6h11M2 10.5h11"
          {...common}
        />
      ) : kind === "date" ? (
        <g {...common}>
          <rect x="2" y="3" width="12" height="11" rx="1.5" />
          <path d="M2 6.5h12M5 1.5v3M11 1.5v3" />
        </g>
      ) : kind === "currency" ? (
        <path
          d="M11 4.5A3 3 0 0 0 5.5 6c0 1 .5 2 .5 3s-.5 2.5-2 3.5h8M3.5 9h5"
          {...common}
        />
      ) : kind === "long" ? (
        <path d="M2.5 4h11M2.5 8h11M2.5 12h7" {...common} />
      ) : (
        <path d="M3 13 7 3h2l4 10M4.6 9.5h6.8" {...common} />
      )}
    </svg>
  );
}

const PILLS: Record<string, string> = {
  Confirmed: "bg-[#d1f7c4] text-[#0b4f1a]",
  Pending: "bg-[#ffeab6] text-[#5c4300]",
  Expired: "bg-[#e5e9f0] text-[#4c5667]",
  Sent: "bg-[#d1f7c4] text-[#0b4f1a]",
  Skipped: "bg-[#ffdce5] text-[#7a1230]",
  High: "bg-[#d1f7c4] text-[#0b4f1a]",
  Medium: "bg-[#ffeab6] text-[#5c4300]",
  "Email Body": "bg-[#ffdce5] text-[#7a1230]",
  "TXT Attachment": "bg-[#c4ecff] text-[#0b4a6f]",
  "PDF Attachment": "bg-[#ffe0cc] text-[#6b2f00]",
  "CSV Attachment": "bg-[#ede2fe] text-[#3b1a73]",
  "Image Attachment": "bg-[#d1f7c4] text-[#0b4f1a]",
  "Website Form": "bg-[#cfdfff] text-[#102046]",
  Posted: "bg-[#d1f7c4] text-[#0b4f1a]",
  "Not a Fit": "bg-[#cfdfff] text-[#102046]",
  "Needs Check": "bg-[#ffeab6] text-[#5c4300]",
  "Internal Note": "bg-[#ede2fe] text-[#3b1a73]",
  Email: "bg-[#c2f5e9] text-[#0b4a3f]",
  Critical: "bg-[#ffdce5] text-[#7a1230]",
  Normal: "bg-[#cfdfff] text-[#102046]",
  Low: "bg-[#eeeeee] text-[#41454d]",
};

/**
 * Airtable's grid view, as the bakery's base shows it: the table tabs on the
 * base colour, the view bar, typed field headers and single-select pills.
 * New records arrive whole, the way the API creates them.
 */
export function AirtableScene({
  sheet,
  t,
  narrow,
}: {
  sheet: Sheet;
  t: number;
  narrow: boolean;
}) {
  const cols = narrow ? sheet.narrowColumns : sheet.wideColumns;
  const kinds = sheet.fieldKinds ?? [];
  const fresh = arrivals(sheet, t);
  const tables = sheet.tables ?? [sheet.title];
  const count = sheet.rows.length + fresh.filter((f) => f.p > 0.5).length;
  const value = (row: string[], c: number) =>
    kinds[c] === "select" ? (
      <span
        className={`rounded-full px-2 py-0.5 text-[0.92em] ${PILLS[row[c]] ?? "bg-[#cfdfff] text-[#102046]"}`}
      >
        {row[c]}
      </span>
    ) : (
      row[c]
    );
  const cell =
    "truncate border-r border-b border-[#e1e1e1] px-2 py-[clamp(5px,1.1cqh,9px)]";

  // Each asked-for item finds its row in turn.
  const asked = sheet.matches?.items ?? [];
  const gap = Math.min(0.15, 0.5 / Math.max(1, asked.length));
  const shown = asked.map((item, i) => ({
    ...item,
    p: easeOut(span(t, 0.22 + i * gap, 0.3 + i * gap)),
  }));
  const matchFor = (r: number) => shown.find((m) => m.row === r && m.p > 0);
  const misses = shown.filter((m) => m.row === undefined);
  const matchCell = (text: string, p: number) => (
    <td
      className="border-b border-[#e1e1e1] px-2 py-[clamp(5px,1.1cqh,9px)] leading-tight font-semibold text-[#7a4b00]"
      style={{ opacity: p }}
    >
      ✓ “{text}”
    </td>
  );

  return (
    <Window title={`${sheet.title}: Grid view · Airtable`} icon={<BaseLogo />}>
      <div className="relative flex h-full flex-col text-[clamp(10px,1.3cqw,13px)] text-[#1d1f25]">
        {/* The base's own header, when it has a name */}
        {sheet.base ? (
          <div className="flex items-center gap-2 border-b border-[#f3c9b8] bg-white px-3 py-1.5 whitespace-nowrap">
            <span className="flex h-[1.7em] w-[1.7em] items-center justify-center rounded-md bg-[#e8603c]">
              <BaseLogo />
            </span>
            <span className="text-[1.15em] font-bold">{sheet.base} ▾</span>
            {!narrow ? (
              <span className="ml-auto flex gap-4 text-[#41454d]">
                <span className="font-semibold text-[#1d1f25] underline decoration-[#e8603c] decoration-2 underline-offset-[6px]">
                  Data
                </span>
                <span>Automations</span>
                <span>Interfaces</span>
                <span>Forms</span>
              </span>
            ) : null}
          </div>
        ) : null}
        {/* Table tabs, on the base colour */}
        <div
          className={`flex items-end gap-0.5 px-2 pt-1.5 ${sheet.base ? "bg-[#fde7dc] text-[#5a2310]" : "bg-[#fce4ee] text-[#4c1d32]"}`}
        >
          {tables.map((name) => (
            <span
              key={name}
              className={`flex items-center gap-1 rounded-t-md px-3 py-1.5 whitespace-nowrap ${
                name === sheet.title
                  ? "bg-white font-semibold text-[#1d1f25]"
                  : ""
              }`}
            >
              {name}
              {name === sheet.title ? (
                <span aria-hidden="true" className="text-[0.8em] opacity-60">
                  ▾
                </span>
              ) : null}
            </span>
          ))}
          <span className="px-2 py-1.5 opacity-70">+</span>
        </div>

        {/* View bar */}
        <div className="flex items-center gap-[clamp(8px,1.6cqw,16px)] border-b border-[#e1e1e1] px-3 py-1.5 whitespace-nowrap text-[#41454d]">
          <span aria-hidden="true">☰</span>
          <span className="flex items-center gap-1.5 font-medium text-[#1d1f25]">
            <GridIcon />
            Grid view
            <span className="text-[0.8em] opacity-60">▾</span>
          </span>
          {!narrow ? (
            <span className="ml-auto flex gap-[clamp(8px,1.6cqw,16px)]">
              <span>Hide fields</span>
              <span>Filter</span>
              <span>Group</span>
              <span>Sort</span>
              <span>Color</span>
              <span>Share view</span>
            </span>
          ) : null}
        </div>

        {/* What matched nothing, above the grid so it's always in view */}
        {misses.map((m) => (
          <p
            key={m.text}
            className="border-b border-[#f5c2bd] bg-[#ffe9e7] px-3 py-1.5 font-semibold text-[#b42318]"
            style={{ opacity: m.p }}
          >
            ✗ “{m.text}”: {sheet.matches?.none ?? "no match"}
          </p>
        ))}

        {/* The grid */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] text-left text-[#41454d]">
                <th className="w-9 border-r border-b border-[#e1e1e1]" />
                {cols.map((c) => (
                  <th
                    key={c}
                    className="border-r border-b border-[#e1e1e1] px-2 py-1.5 font-semibold"
                  >
                    <span className="flex min-w-0 items-center gap-1.5">
                      <FieldIcon kind={kinds[c] ?? "text"} />
                      <span className="truncate">{sheet.columns[c]}</span>
                    </span>
                  </th>
                ))}
                {sheet.matches ? (
                  <th className="truncate border-b border-[#e1e1e1] bg-[#fff1c2] px-2 py-1.5 font-semibold text-[#7a4b00]">
                    {sheet.matches.label}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {sheet.rows.map((row, r) => {
                const match = matchFor(r);
                return (
                  <tr
                    key={r}
                    className="transition-colors duration-300"
                    style={
                      (sheet.highlight?.includes(r) && t >= 0.4) ||
                      (match && match.p > 0.4)
                        ? { background: "#fff1c2" }
                        : undefined
                    }
                  >
                    <td className="border-b border-[#e1e1e1] text-center text-[#8a8f98] tabular-nums">
                      {r + 1}
                    </td>
                    {cols.map((c) => (
                      <td key={c} className={cell}>
                        {value(row, c)}
                      </td>
                    ))}
                    {sheet.matches ? (
                      match ? (
                        matchCell(match.text, match.p)
                      ) : (
                        <td className={cell} />
                      )
                    ) : null}
                  </tr>
                );
              })}
              {fresh.map(({ row, p }, i) => (
                <tr
                  key={`new-${i}`}
                  className="bg-[#fff8db]"
                  style={{
                    opacity: p,
                    transform: `translateY(${(1 - p) * -8}px)`,
                  }}
                >
                  <td className="border-b border-[#e1e1e1] text-center text-[#8a8f98] tabular-nums">
                    {sheet.rows.length + 1 + i}
                  </td>
                  {cols.map((c) => (
                    <td key={c} className={`${cell} font-medium`}>
                      {value(row, c)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="border-b border-[#e1e1e1] text-center text-[#8a8f98]">
                  +
                </td>
                {cols.map((c) => (
                  <td key={c} className={cell}>
                    &nbsp;
                  </td>
                ))}
                {sheet.matches ? <td className={cell} /> : null}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="border-t border-[#e1e1e1] bg-white px-3 py-1 text-[0.9em] text-[#8a8f98]">
          {count} records
        </p>
        {sheet.record ? (
          <ExpandedRecord
            record={sheet.record}
            table={sheet.title}
            t={t}
            narrow={narrow}
            value={(kind, text) =>
              kind === "select" ? value([text], 0) : text
            }
          />
        ) : null}
      </div>
    </Window>
  );
}

/**
 * Airtable's expanded record: the record opened over the grid, every field
 * stacked under its name, long text in full.
 */
function ExpandedRecord({
  record,
  table,
  t,
  narrow,
  value,
}: {
  record: NonNullable<Sheet["record"]>;
  table: string;
  t: number;
  narrow: boolean;
  value: (kind: FieldKind, text: string) => ReactNode;
}) {
  const open = easeOut(span(t, 0.04, 0.16));
  // Late in the beat, the fields scroll up just far enough to show the last.
  const box = useRef<HTMLDivElement>(null);
  const fields = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  useLayoutEffect(() => {
    if (!box.current || !fields.current) return;
    const extra = Math.max(
      0,
      fields.current.scrollHeight - box.current.clientHeight,
    );
    setOverflow((was) => (Math.abs(was - extra) > 1 ? extra : was));
  });
  const scroll = easeOut(span(t, 0.5, 0.75)) * overflow;
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/35"
      style={{ opacity: open }}
    >
      <div
        className={`flex h-[92%] flex-col overflow-hidden rounded-lg bg-white shadow-2xl ${narrow ? "w-[94%]" : "w-[72%]"}`}
        style={{ transform: `translateY(${(1 - open) * 14}px)` }}
      >
        <div className="border-b border-[#e1e1e1] px-[clamp(10px,2cqw,18px)] py-2">
          <p className="text-[0.85em] text-[#8a8f98]">{table}</p>
          <p className="truncate text-[1.25em] font-semibold">{record.title}</p>
        </div>
        <div
          ref={box}
          className="min-h-0 flex-1 overflow-hidden px-[clamp(10px,2cqw,18px)] py-2.5"
        >
          <div
            ref={fields}
            className={`grid gap-x-4 gap-y-[clamp(6px,1.4cqh,12px)] ${narrow ? "grid-cols-1" : "grid-cols-2"}`}
            style={{ transform: `translateY(-${scroll}px)` }}
          >
            {record.fields.map((field, i) => (
              <div
                key={field.label}
                className={field.kind === "long" ? "col-span-full" : ""}
                style={{
                  opacity: easeOut(span(t, 0.14 + i * 0.05, 0.22 + i * 0.05)),
                }}
              >
                <p className="flex items-center gap-1.5 text-[0.92em] text-[#41454d]">
                  <FieldIcon kind={field.kind} />
                  {field.label}
                </p>
                <div
                  className={`mt-1 rounded-md border border-[#e1e1e1] px-2.5 py-1.5 ${field.kind === "long" ? "leading-snug" : "truncate"}`}
                >
                  {value(field.kind, field.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BaseLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden="true">
      <path d="M12 3 21 7l-9 4-9-4 9-4Z" fill="#fcb400" />
      <path d="M13 13l8-3.5V18l-8 3.5V13Z" fill="#18bfff" />
      <path d="M11 13 3 9.5V18l8 3.5V13Z" fill="#f82b60" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-[1.1em] w-[1.1em]" aria-hidden="true">
      <rect
        x="1.5"
        y="2.5"
        width="13"
        height="11"
        rx="1.5"
        fill="none"
        stroke="#166ee1"
        strokeWidth="1.5"
      />
      <path
        d="M1.5 6.5h13M1.5 10h13M6 6.5v7"
        stroke="#166ee1"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function N8nLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden="true">
      <circle cx="4.5" cy="12" r="2.5" fill="#ea4b71" />
      <circle cx="12" cy="12" r="2.5" fill="#ea4b71" />
      <circle cx="19.5" cy="7" r="2.5" fill="#ea4b71" />
      <circle cx="19.5" cy="17" r="2.5" fill="#ea4b71" />
      <path
        d="M7 12h2.5M14.5 12c2 0 2-5 2.5-5M14.5 12c2 0 2 5 2.5 5"
        stroke="#ea4b71"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}

/**
 * An n8n Data Table, inside n8n's own interface: the side bar, the
 * breadcrumb, typed columns with the system id and date columns, and new
 * rows as the workflow inserts them.
 */
export function N8nTableScene({
  sheet,
  t,
  narrow,
}: {
  sheet: Sheet;
  t: number;
  narrow: boolean;
}) {
  const cols = narrow ? sheet.narrowColumns : sheet.wideColumns;
  const kinds = sheet.fieldKinds ?? [];
  const fresh = arrivals(sheet, t);
  const all = [
    ...sheet.rows.map((row) => ({ row, p: 1, isNew: false })),
    ...fresh.map((f) => ({ ...f, isNew: true })),
  ];
  const head = (label: ReactNode, kind: FieldKind | "id", key: string) => (
    <th
      key={key}
      className="border-r border-b border-[#e6e6ea] px-2 py-1.5 text-left font-medium text-[#555b66]"
    >
      <span className="flex min-w-0 items-center gap-1.5">
        {kind === "id" ? (
          <span className="opacity-70">#</span>
        ) : (
          <FieldIcon kind={kind} />
        )}
        <span className="truncate">{label}</span>
      </span>
    </th>
  );
  const cell =
    "truncate border-r border-b border-[#e6e6ea] px-2 py-[clamp(5px,1.1cqh,9px)]";

  return (
    <Window title={`${sheet.title} · n8n`} icon={<N8nLogo />}>
      <div className="flex h-full text-[clamp(10px,1.3cqw,13px)] text-[#2d2e33]">
        {/* n8n's side bar */}
        {!narrow ? (
          <div className="flex w-[13%] min-w-[90px] shrink-0 flex-col gap-1 border-r border-[#e6e6ea] bg-[#f7f7f9] p-2 text-[#555b66]">
            <span className="mb-1 flex items-center gap-1.5 font-semibold text-[#2d2e33]">
              <N8nLogo />
              n8n
            </span>
            <span className="rounded px-1.5 py-1">Overview</span>
            <span className="rounded px-1.5 py-1">Personal</span>
            <span className="rounded px-1.5 py-1">Templates</span>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-[#e6e6ea] px-3 py-2 whitespace-nowrap">
            <span className="text-[#8b919c]">Personal</span>
            <span className="text-[#8b919c]">/</span>
            {!narrow ? (
              <>
                <span className="text-[#8b919c]">Data tables</span>
                <span className="text-[#8b919c]">/</span>
              </>
            ) : null}
            <span className="font-semibold">{sheet.title}</span>
            <span className="ml-auto rounded-md bg-[#ea4b71] px-2.5 py-1 font-medium text-white">
              + Add row
            </span>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-[#f7f7f9]">
                <tr>
                  {head("id", "id", "id")}
                  {cols.map((c) =>
                    head(sheet.columns[c], kinds[c] ?? "text", String(c)),
                  )}
                  {!narrow ? head("createdAt", "date", "created") : null}
                </tr>
              </thead>
              <tbody>
                {all.map(({ row, p, isNew }, r) => (
                  <tr
                    key={r}
                    className={isNew ? "bg-[#fff1f4]" : ""}
                    style={
                      isNew
                        ? {
                            opacity: p,
                            transform: `translateY(${(1 - p) * -8}px)`,
                          }
                        : undefined
                    }
                  >
                    <td className={`${cell} text-[#8b919c] tabular-nums`}>
                      {r + 1}
                    </td>
                    {cols.map((c) => (
                      <td
                        key={c}
                        className={`${cell} ${isNew ? "font-medium" : ""}`}
                      >
                        {kinds[c] === "select" ? (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[0.92em] ${PILLS[row[c]] ?? "bg-[#eef0f4]"}`}
                          >
                            {row[c]}
                          </span>
                        ) : (
                          row[c]
                        )}
                      </td>
                    ))}
                    {!narrow ? (
                      <td className={`${cell} text-[#8b919c]`}>
                        {sheet.createdAt?.[r] ?? ""}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-[#e6e6ea] bg-white px-3 py-1 text-[0.9em] text-[#8b919c]">
            Total {sheet.rows.length + fresh.filter((f) => f.p > 0.5).length}
          </p>
        </div>
      </div>
    </Window>
  );
}
