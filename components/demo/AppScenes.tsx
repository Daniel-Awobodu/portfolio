import type { ReactNode } from "react";
import { easeInOut, easeOut, reveal, span } from "@/components/demo/anim";
import type { Demo } from "@/lib/demos/types";

/** A plain browser window filling most of the stage. */
function Window({
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
  const { drive } = demo;
  const opened = t >= 0.38;
  const hover = t >= 0.16 && !opened;
  const landed = easeOut(span(t, 0.52, 0.66));
  const path = opened ? [...drive.path, drive.open] : drive.path;

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
              ? drive.folders.map((folder) => {
                  const target = folder === drive.open;
                  return (
                    <div
                      key={folder}
                      className={`flex items-center gap-3 border-b border-[#f1f3f4] py-[clamp(7px,1.6cqh,12px)] ${
                        target && hover ? "rounded bg-[#c2e7ff]" : ""
                      }`}
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

/**
 * Google Sheets: the expense sheet, with the new row typed in cell by cell,
 * then highlighted, while the view eases in on it.
 */
export function SheetScene({
  demo,
  t,
  narrow,
}: {
  demo: Demo;
  t: number;
  narrow: boolean;
}) {
  const { sheet } = demo;
  const cols = narrow ? sheet.narrowColumns : sheet.wideColumns;
  const typing = span(t, 0.12, 0.82);
  // A gentle push in on the new row; skipped on narrow screens, where every
  // column is already needed.
  const zoom = narrow ? 1 : 1 + 0.07 * easeInOut(span(t, 0.05, 0.4));
  const settled = t >= 0.86;
  const letters = "ABCDEFGHIJ";
  const activeCell = Math.min(
    cols.length - 1,
    Math.floor(typing * cols.length),
  );

  return (
    <Window
      title={`${sheet.title} · Google Sheets`}
      icon={
        <svg
          viewBox="0 0 24 24"
          className="h-[1.2em] w-[1.2em]"
          aria-hidden="true"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" fill="#0f9d58" />
          <path
            d="M8 9h8v8H8zM8 13h8M12 9v8"
            stroke="#fff"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      }
    >
      <div className="flex items-center gap-2 border-b border-[#e3e6e8] px-3 py-1.5 text-[12px] text-[#5f6368]">
        <span className="font-medium italic">fx</span>
        <span className="truncate text-[#202124]">
          {t >= 0.12 && t < 0.86
            ? reveal(
                sheet.newRow[cols[activeCell]],
                typing * cols.length - activeCell,
              )
            : ""}
        </span>
      </div>
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
            <tr className="bg-[#f8f9fa] text-[#5f6368]">
              <th className="w-8 border border-[#e3e6e8] font-normal" />
              {cols.map((c, i) => (
                <th
                  key={c}
                  className="border border-[#e3e6e8] py-1 font-normal"
                >
                  {letters[i]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[sheet.columns, ...sheet.rows].map((row, r) => (
              <tr key={r}>
                <td className="border border-[#e3e6e8] bg-[#f8f9fa] text-center text-[#5f6368]">
                  {r + 1}
                </td>
                {cols.map((c) => (
                  <td
                    key={c}
                    className={`truncate border border-[#e3e6e8] px-1.5 py-[clamp(4px,1cqh,8px)] ${r === 0 ? "font-semibold" : ""}`}
                  >
                    {row[c]}
                  </td>
                ))}
              </tr>
            ))}
            <tr className={settled ? "bg-[#e6f4ea]" : ""}>
              <td className="border border-[#e3e6e8] bg-[#f8f9fa] text-center text-[#5f6368]">
                {sheet.rows.length + 2}
              </td>
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
                    {reveal(sheet.newRow[c], p)}
                  </td>
                );
              })}
            </tr>
            {[0, 1, 2].map((r) => (
              <tr key={`empty-${r}`}>
                <td className="border border-[#e3e6e8] bg-[#f8f9fa] text-center text-[#5f6368]">
                  {sheet.rows.length + 3 + r}
                </td>
                {cols.map((c) => (
                  <td
                    key={c}
                    className="border border-[#e3e6e8] py-[clamp(4px,1cqh,8px)]"
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Window>
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
          <div key={point.label} className="max-w-[14rem]">
            <p className="font-display text-[clamp(26px,5cqw,48px)] leading-none font-semibold text-[#f0c05a]">
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
