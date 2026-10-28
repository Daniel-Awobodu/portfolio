import type { ReactNode } from "react";
import { easeInOut, easeOut, reveal, span } from "@/components/demo/anim";
import { AirtableScene, N8nTableScene } from "@/components/demo/TableApps";
import type { Demo } from "@/lib/demos/types";

/** A plain browser window filling most of the stage. */
export function Window({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 flex items-start justify-center bg-[radial-gradient(circle_at_50%_30%,#22302a,#0b100e)] pt-[7cqh]">
      <div className="flex h-[74cqh] w-[92cqw] max-w-[920px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 border-b border-[#e3e6e8] bg-[#f1f3f4] px-3 py-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-2 flex min-w-0 items-center gap-2 rounded-md bg-white px-3 py-1 text-[12px] text-[#3c4043]">
            {icon}
            <span className="truncate">{title}</span>
          </span>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden text-[#202124]">
          {children}
        </div>
      </div>
    </div>
  );
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.2em] w-[1.2em] shrink-0"
      aria-hidden="true"
    >
      <path
        d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"
        fill="#5f6368"
      />
    </svg>
  );
}

function FileIcon({ name }: { name: string }) {
  const pdf = name.endsWith(".pdf");
  return (
    <span
      aria-hidden="true"
      className={`flex h-[1.25em] w-[1.25em] shrink-0 items-center justify-center rounded-[3px] text-[0.55em] font-bold text-white ${pdf ? "bg-[#ea4335]" : "bg-[#d93025]"}`}
    >
      {pdf ? "PDF" : "IMG"}
    </span>
  );
}

/**
 * Google Drive: the Receipts folder, the month folder opening, and the new
 * receipt landing at the top, named by date, vendor and driver.
 */
export function DriveScene({
  demo,
  t,
  narrow,
}: {
  demo: Demo;
  t: number;
  narrow: boolean;
}) {
  const drive = demo.drive!;
  const opened = t >= 0.38;
  const hover = t >= 0.16 && !opened;
  const landed = easeOut(span(t, 0.52, 0.66));
  const path = opened ? [...drive.path, drive.open] : drive.path;
  // A new vendor's folder is created first, then opened.
  const made = drive.newFolder ? easeOut(span(t, 0.06, 0.16)) : 0;
  const folders = [
    ...drive.folders,
    ...(drive.newFolder && made > 0 ? [drive.newFolder] : []),
  ];

  return (
    <Window
      title={`${path[path.length - 1]} · Google Drive`}
      icon={<FolderIcon />}
    >
      <div className="flex h-full">
        {!narrow ? (
          <div className="w-44 shrink-0 border-r border-[#e3e6e8] p-4 text-[13px] text-[#3c4043]">
            <p className="mb-4 text-[18px] font-medium">Drive</p>
            <p className="rounded-full bg-[#c2e7ff] px-3 py-1.5 font-medium">
              My Drive
            </p>
            <p className="px-3 py-1.5">Shared with me</p>
            <p className="px-3 py-1.5">Recent</p>
          </div>
        ) : null}
        <div className="min-w-0 flex-1 p-[clamp(12px,3cqw,24px)]">
          <p className="flex flex-wrap items-center gap-x-2 text-[clamp(15px,2.6cqw,22px)] text-[#202124]">
            {path.map((part, i) => (
              <span key={part} className="flex items-center gap-2">
                {i > 0 ? <span className="text-[#5f6368]">›</span> : null}
                <span
                  className={
                    i === path.length - 1 ? "font-medium" : "text-[#5f6368]"
                  }
                >
                  {part}
                </span>
              </span>
            ))}
          </p>

          <div className="mt-[clamp(10px,2.5cqh,20px)] text-[clamp(12px,1.6cqw,14px)]">
            <div className="flex border-b border-[#e3e6e8] pb-2 font-medium text-[#5f6368]">
              <span className="flex-1">Name</span>
              {!narrow ? (
                <>
                  <span className="w-28">Modified</span>
                  <span className="w-20">Size</span>
                </>
              ) : null}
            </div>

            {!opened
              ? folders.map((folder) => {
                  const target = folder === drive.open;
                  const isNew = folder === drive.newFolder;
                  return (
                    <div
                      key={folder}
                      className={`flex items-center gap-3 border-b border-[#f1f3f4] py-[clamp(7px,1.6cqh,12px)] ${
                        target && hover
                          ? "rounded bg-[#c2e7ff]"
                          : isNew
                            ? "rounded bg-[#e6f4ea]"
                            : ""
                      }`}
                      style={
                        isNew
                          ? {
                              opacity: made,
                              transform: `translateY(${(1 - made) * -8}px)`,
                            }
                          : undefined
                      }
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-3">
                        <FolderIcon />
                        <span className="truncate">{folder}</span>
                      </span>
                      {!narrow ? (
                        <>
                          <span className="w-28" />
                          <span className="w-20" />
                        </>
                      ) : null}
                    </div>
                  );
                })
              : [
                  ...(landed > 0 ? [{ ...drive.newFile, isNew: true }] : []),
                  ...drive.files.map((f) => ({ ...f, isNew: false })),
                ].map((file) => (
                  <div
                    key={file.name}
                    className={`flex items-center gap-3 border-b border-[#f1f3f4] py-[clamp(7px,1.6cqh,12px)] ${
                      file.isNew ? "rounded bg-[#e6f4ea]" : ""
                    }`}
                    style={
                      file.isNew
                        ? {
                            opacity: landed,
                            transform: `translateY(${(1 - landed) * -10}px)`,
                          }
                        : undefined
                    }
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                      <FileIcon name={file.name} />
                      <span
                        className={`truncate ${file.isNew ? "font-medium" : ""}`}
                      >
                        {file.name}
                      </span>
                    </span>
                    {!narrow ? (
                      <>
                        <span className="w-28 text-[#5f6368]">
                          {file.modified}
                        </span>
                        <span className="w-20 text-[#5f6368]">{file.size}</span>
                      </>
                    ) : null}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

const LETTERS = "ABCDEFGHIJ";

const cell = "truncate border border-[#e3e6e8] px-1.5 py-[clamp(4px,1cqh,8px)]";
const rowHead =
  "border border-[#e3e6e8] bg-[#f8f9fa] text-center text-[#5f6368] tabular-nums";

function BaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden="true">
      <path d="M12 3 21 7l-9 4-9-4 9-4Z" fill="#fcb400" />
      <path d="M13 13l8-3.5V18l-8 3.5V13Z" fill="#18bfff" />
      <path d="M11 13 3 9.5V18l8 3.5V13Z" fill="#f82b60" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#ea4b71" />
      <path d="M3 9.5h18M3 15h18M9 4v16" stroke="#fff" strokeWidth="1.4" />
    </svg>
  );
}

function SheetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" fill="#0f9d58" />
      <path
        d="M8 9h8v8H8zM8 13h8M12 9v8"
        stroke="#fff"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

/** The sheet's tabs along the bottom, like Google Sheets. */
function Tabs({ tabs, active }: { tabs: string[]; active: number }) {
  return (
    <div className="flex items-stretch gap-1 border-t border-[#e3e6e8] bg-[#f8f9fa] px-2 text-[12px] text-[#5f6368]">
      <span className="px-2 py-1.5">+</span>
      {tabs.map((tab, i) => (
        <span
          key={tab}
          className={`px-3 py-1.5 ${i === active ? "bg-white font-semibold text-[#188038] shadow-[inset_0_-2px_0_#188038]" : ""}`}
        >
          {tab}
        </span>
      ))}
    </div>
  );
}

function HeaderRow({ count, wide }: { count: number; wide?: boolean }) {
  return (
    <tr className="bg-[#f8f9fa] text-[#5f6368]">
      <th
        className={`${wide ? "w-12" : "w-8"} border border-[#e3e6e8] font-normal`}
      />
      {Array.from({ length: count }, (_, i) => (
        <th key={i} className="border border-[#e3e6e8] py-1 font-normal">
          {LETTERS[i]}
        </th>
      ))}
    </tr>
  );
}

/**
 * Google Sheets. "type": the new row typed in cell by cell, then highlighted,
 * while the view eases in on it. "stream": rows pouring in until the sheet
 * holds every order. "invalid": the review tab, with the reason for each row.
 */
export function SheetScene({
  demo,
  t,
  narrow,
  mode = "type",
}: {
  demo: Demo;
  t: number;
  narrow: boolean;
  mode?: "type" | "stream" | "invalid" | "filter";
}) {
  const sheet = demo.sheet!;
  if (sheet.app === "airtable" && (mode === "type" || !mode)) {
    return <AirtableScene sheet={sheet} t={t} narrow={narrow} />;
  }
  if (sheet.app === "n8n" && (mode === "type" || !mode)) {
    return <N8nTableScene sheet={sheet} t={t} narrow={narrow} />;
  }
  const frame = (children: ReactNode, fx: string, tab: number) => (
    <Window
      title={`${sheet.title} · ${sheet.app === "airtable" ? "Airtable" : sheet.app === "n8n" ? "n8n Data Table" : "Google Sheets"}`}
      icon={
        sheet.app === "airtable" ? (
          <BaseIcon />
        ) : sheet.app === "n8n" ? (
          <TableIcon />
        ) : (
          <SheetIcon />
        )
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-[#e3e6e8] px-3 py-1.5 text-[12px] text-[#5f6368]">
          <span className="font-medium italic">fx</span>
          <span className="truncate text-[#202124]">{fx}</span>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {children}
        </div>
        {sheet.tabs ? <Tabs tabs={sheet.tabs} active={tab} /> : null}
      </div>
    </Window>
  );

  if (mode === "stream" && sheet.stream) {
    const cols = narrow ? sheet.narrowColumns : sheet.wideColumns;
    const { total, sample } = sheet.stream;
    const p = easeInOut(span(t, 0.06, 0.84));
    const written = Math.max(1, Math.round(p * total));
    const shown = 8;
    const first = Math.max(1, written - shown + 1);
    const rows = Array.from(
      { length: written - first + 1 },
      (_, i) => first + i,
    );
    const finished = t >= 0.86;
    return frame(
      <>
        <table className="w-full table-fixed border-collapse text-[clamp(10px,1.35cqw,13px)]">
          <thead>
            <HeaderRow count={cols.length} wide />
          </thead>
          <tbody>
            <tr>
              <td className={rowHead}>1</td>
              {cols.map((c) => (
                <td key={c} className={`${cell} font-semibold`}>
                  {sheet.columns[c]}
                </td>
              ))}
            </tr>
            {rows.map((n) => {
              const row = sample[(n - 1) % sample.length];
              const newest = n === written;
              return (
                <tr key={n} className={newest ? "bg-[#e6f4ea]" : ""}>
                  <td className={rowHead}>{(n + 1).toLocaleString("en")}</td>
                  {cols.map((c) => (
                    <td key={c} className={cell}>
                      {row[c]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {finished ? (
          <p className="demo-fade absolute right-3 bottom-3 rounded-full bg-[#188038] px-3 py-1.5 text-[clamp(11px,1.5cqw,14px)] font-semibold text-white shadow-md">
            {total.toLocaleString("en")} orders
          </p>
        ) : null}
      </>,
      written === total ? "" : sample[(written - 1) % sample.length][cols[0]],
      0,
    );
  }

  if (mode === "filter" && sheet.filter) {
    const cols = narrow ? sheet.narrowColumns : sheet.wideColumns;
    const typed = reveal(sheet.filter.label, span(t, 0.08, 0.3));
    const narrowed = t >= 0.34;
    return frame(
      <>
        <div className="flex items-center gap-2 border-b border-[#e3e6e8] bg-[#f8f9fa] px-3 py-1.5 text-[clamp(10px,1.3cqw,12px)] text-[#3c4043]">
          <span aria-hidden="true">⏷</span>
          <span className="rounded-full bg-[#e6f4ea] px-2.5 py-0.5 font-medium text-[#188038]">
            {typed || " "}
          </span>
        </div>
        <table className="w-full table-fixed border-collapse text-[clamp(10px,1.35cqw,13px)]">
          <thead>
            <HeaderRow count={cols.length} wide />
          </thead>
          <tbody>
            <tr>
              <td className={rowHead}>1</td>
              {cols.map((c) => (
                <td key={c} className={`${cell} font-semibold`}>
                  {sheet.columns[c]}
                </td>
              ))}
            </tr>
            {(narrowed ? sheet.filter.rows : sheet.stream!.sample).map(
              (row, r) => (
                <tr
                  key={`${narrowed}-${r}`}
                  className={narrowed ? "demo-fade bg-[#e6f4ea]/40" : ""}
                >
                  <td className={rowHead}>
                    {narrowed ? sheet.filter!.rowNumbers[r] : r + 2}
                  </td>
                  {cols.map((c) => (
                    <td key={c} className={cell}>
                      {row[c]}
                    </td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </>,
      "",
      0,
    );
  }

  if (mode === "invalid" && sheet.invalid) {
    const inv = sheet.invalid;
    const cols = narrow ? inv.narrowColumns : inv.wideColumns;
    return frame(
      <table className="w-full table-fixed border-collapse text-[clamp(10px,1.35cqw,13px)]">
        <thead>
          <HeaderRow count={cols.length} />
        </thead>
        <tbody>
          <tr>
            <td className={rowHead}>1</td>
            {cols.map((c) => (
              <td key={c} className={`${cell} font-semibold`}>
                {inv.columns[c]}
              </td>
            ))}
          </tr>
          {inv.rows.map((row, r) => {
            const at = 0.15 + r * 0.22;
            const visible = t >= at;
            return (
              <tr
                key={r}
                className="transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
              >
                <td className={rowHead}>{r + 2}</td>
                {cols.map((c, i) => (
                  <td
                    key={c}
                    className={`${cell} ${i === cols.length - 1 ? "font-medium text-[#b3261e]" : ""}`}
                  >
                    {row[c]}
                  </td>
                ))}
              </tr>
            );
          })}
          {[0, 1, 2].map((r) => (
            <tr key={`empty-${r}`}>
              <td className={rowHead}>{inv.rows.length + 2 + r}</td>
              {cols.map((c) => (
                <td key={c} className={cell}>
                  &nbsp;
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>,
      "",
      1,
    );
  }

  if (sheet.newRows) {
    const cols = narrow ? sheet.narrowColumns : sheet.wideColumns;
    const landed = sheet.newRows.map((_, i) =>
      easeOut(span(t, 0.15 + i * 0.18, 0.27 + i * 0.18)),
    );
    return frame(
      <table className="w-full table-fixed border-collapse text-[clamp(10px,1.35cqw,13px)]">
        <thead>
          <HeaderRow count={cols.length} />
        </thead>
        <tbody>
          {[sheet.columns, ...sheet.rows].map((row, r) => (
            <tr key={r}>
              <td className={rowHead}>{r + 1}</td>
              {cols.map((c) => (
                <td
                  key={c}
                  className={`${cell} ${r === 0 ? "font-semibold" : ""}`}
                >
                  {row[c]}
                </td>
              ))}
            </tr>
          ))}
          {sheet.newRows.map((row, i) => (
            <tr
              key={`new-${i}`}
              className="bg-[#e6f4ea]"
              style={{
                opacity: landed[i],
                transform: `translateY(${(1 - landed[i]) * -8}px)`,
              }}
            >
              <td className={rowHead}>{sheet.rows.length + 2 + i}</td>
              {cols.map((c) => (
                <td key={c} className={`${cell} font-medium`}>
                  {row[c]}
                </td>
              ))}
            </tr>
          ))}
          {[0, 1].map((r) => (
            <tr key={`empty-${r}`}>
              <td className={rowHead}>
                {sheet.rows.length + sheet.newRows!.length + 2 + r}
              </td>
              {cols.map((c) => (
                <td key={c} className={cell}>
                  &nbsp;
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>,
      "",
      0,
    );
  }

  const newRow = sheet.newRow!;
  const cols = narrow ? sheet.narrowColumns : sheet.wideColumns;
  const typing = span(t, 0.12, 0.82);
  // A gentle push in on the new row; skipped on narrow screens, where every
  // column is already needed.
  const zoom = narrow ? 1 : 1 + 0.07 * easeInOut(span(t, 0.05, 0.4));
  const settled = t >= 0.86;
  const activeCell = Math.min(
    cols.length - 1,
    Math.floor(typing * cols.length),
  );

  return frame(
    <div
      className="origin-[0%_55%] overflow-hidden"
      style={{ transform: `scale(${zoom})` }}
    >
      {/* Narrower by the zoom, so the push in never crops a column. */}
      <table
        className="table-fixed border-collapse text-[clamp(10px,1.35cqw,13px)]"
        style={{ width: narrow ? "100%" : `${100 / 1.07}%` }}
      >
        <thead>
          <HeaderRow count={cols.length} />
        </thead>
        <tbody>
          {[sheet.columns, ...sheet.rows].map((row, r) => (
            <tr key={r}>
              <td className={rowHead}>{r + 1}</td>
              {cols.map((c) => (
                <td
                  key={c}
                  className={`${cell} ${r === 0 ? "font-semibold" : ""}`}
                >
                  {row[c]}
                </td>
              ))}
            </tr>
          ))}
          <tr className={settled ? "bg-[#e6f4ea]" : ""}>
            <td className={rowHead}>{sheet.rows.length + 2}</td>
            {cols.map((c, i) => {
              const p = typing * cols.length - i;
              const active = !settled && i === activeCell && t >= 0.12;
              return (
                <td
                  key={c}
                  className={`truncate border px-1.5 py-[clamp(4px,1cqh,8px)] font-medium ${
                    active ? "border-2 border-[#1a73e8]" : "border-[#e3e6e8]"
                  }`}
                >
                  {reveal(newRow[c], p)}
                </td>
              );
            })}
          </tr>
          {[0, 1, 2].map((r) => (
            <tr key={`empty-${r}`}>
              <td className={rowHead}>{sheet.rows.length + 3 + r}</td>
              {cols.map((c) => (
                <td key={c} className={cell}>
                  &nbsp;
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
    t >= 0.12 && t < 0.86
      ? reveal(newRow[cols[activeCell]], typing * cols.length - activeCell)
      : "",
    0,
  );
}

/** The closing card: the result, in the build's own numbers. */
export function EndScene({
  demo,
  onReplay,
}: {
  demo: Demo;
  onReplay: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[4cqh] bg-[radial-gradient(circle_at_50%_40%,#22302a,#0b100e)] px-6 pb-[14cqh] text-center">
      <p className="max-w-[24ch] font-display text-[clamp(20px,4.4cqw,40px)] leading-tight font-semibold text-white">
        {demo.end.headline}
      </p>
      <div className="flex flex-wrap justify-center gap-x-[6cqw] gap-y-4">
        {demo.end.points.map((point) => (
          <div key={point.label} className="max-w-[16rem]">
            <p
              className={`font-display leading-none font-semibold whitespace-nowrap text-[#f0c05a] ${
                point.value.length > 6
                  ? "text-[clamp(22px,3.8cqw,38px)]"
                  : "text-[clamp(26px,5cqw,48px)]"
              }`}
            >
              {point.value}
            </p>
            <p className="mt-2 text-[clamp(12px,1.5cqw,15px)] text-[#c9cfcc]">
              {point.label}
            </p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onReplay}
        className="rounded-sm border border-white/30 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors duration-150 hover:border-[#4cc995] hover:text-[#4cc995]"
      >
        ↻ Watch again
      </button>
    </div>
  );
}
