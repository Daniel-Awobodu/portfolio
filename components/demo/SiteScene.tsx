import type { ReactNode } from "react";
import { easeOut, reveal, span } from "@/components/demo/anim";
import { Window } from "@/components/demo/AppScenes";
import type { Beat, Demo, Site, SiteBlock, SiteMark } from "@/lib/demos/types";

type SiteBeat = Extract<Beat, { scene: "site" }>;

/** When the "decision" on a row shows: after the page has had time to read. */
const decided = (t: number, r: number) => t >= 0.42 + r * 0.05;

function Mark({ mark, color }: { mark: SiteMark; color: string }) {
  if (mark === "ok") {
    return <span className="shrink-0 font-bold text-[#1e8e3e]">✓</span>;
  }
  if (mark === "no") {
    return <span className="shrink-0 font-bold text-[#d93025]">✗</span>;
  }
  return (
    <span
      className="shrink-0 rounded px-1.5 text-[0.85em] font-semibold text-white"
      style={{ background: color }}
    >
      {mark === "pick" ? "Picked" : "New"}
    </span>
  );
}

function Logo({ site, size = "1.2em" }: { site: Site; size?: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[4px] font-bold text-white"
      style={{
        background: site.color,
        width: size,
        height: size,
        fontSize: `calc(${size} * 0.62)`,
      }}
    >
      {site.logo}
    </span>
  );
}

/** A small map with the matched building pinned. */
function MapBlock({
  label,
  note,
  t,
}: {
  label: string;
  note: string;
  t: number;
}) {
  const drop = easeOut(span(t, 0.15, 0.3));
  return (
    <div className="relative h-[clamp(90px,26cqh,200px)] overflow-hidden rounded-md bg-[#e9eef2]">
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="400" height="200" fill="#e9eef2" />
        <path
          d="M0 70H400M0 140H400M90 0V200M230 0V200M330 0V200"
          stroke="#fff"
          strokeWidth="9"
        />
        <path d="M0 20 400 190" stroke="#fff" strokeWidth="6" />
        <rect x="245" y="82" width="70" height="44" fill="#d5dde3" />
        <rect x="105" y="150" width="110" height="40" fill="#cfe8d4" />
        <rect x="105" y="82" width="110" height="44" fill="#d5dde3" />
      </svg>
      <span
        className="absolute left-1/2 text-[1.8em]"
        style={{
          top: `calc(50% - 1.5em - ${(1 - drop) * 30}px)`,
          opacity: drop,
          transform: "translateX(-50%)",
        }}
        aria-hidden="true"
      >
        📍
      </span>
      <p
        className="absolute right-2 bottom-2 left-2 rounded bg-white/95 px-2 py-1 shadow"
        style={{ opacity: easeOut(span(t, 0.32, 0.44)) }}
      >
        <span className="block truncate font-semibold">{label}</span>
        <span className="text-[#1e8e3e]">{note}</span>
      </p>
    </div>
  );
}

/** The page's text, searched for a quote: highlighted when it's there. */
function TextBlock({
  block,
  t,
  color,
}: {
  block: Extract<SiteBlock, { kind: "text" }>;
  t: number;
  color: string;
}) {
  const find = block.find;
  const typed = find ? reveal(find.text, span(t, 0.18, 0.42)) : "";
  const result = find && t >= 0.47;
  return (
    <div>
      {find ? (
        <div className="mb-2 flex items-center gap-2 rounded-md border border-[#c4c7c5] bg-[#f8f9fa] px-2 py-1">
          <span className="shrink-0 text-[#5f6368]">Find in page</span>
          <span className="min-w-0 flex-1 truncate font-mono text-[0.92em]">
            {typed || " "}
          </span>
          {result ? (
            <span
              className={`shrink-0 font-semibold ${find.found ? "text-[#1e8e3e]" : "text-[#d93025]"}`}
            >
              {find.found ? "1 of 1" : "0 results"}
            </span>
          ) : null}
        </div>
      ) : null}
      {block.title ? (
        <p className="text-[1.25em] leading-tight font-bold">{block.title}</p>
      ) : null}
      {block.meta ? (
        <p className="mt-0.5 text-[#5f6368]">{block.meta}</p>
      ) : null}
      <div className="mt-1.5 space-y-1.5 leading-snug">
        {block.lines.map((line, i) => {
          const at =
            find && find.found && result ? line.indexOf(find.text) : -1;
          return (
            <p key={i}>
              {at >= 0 ? (
                <>
                  {line.slice(0, at)}
                  <mark
                    className="rounded-sm px-0.5 text-inherit"
                    style={{ background: `${color}40` }}
                  >
                    {find!.text}
                  </mark>
                  {line.slice(at + find!.text.length)}
                </>
              ) : (
                line
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function Block({
  block,
  t,
  narrow,
  site,
}: {
  block: SiteBlock;
  t: number;
  narrow: boolean;
  site: Site;
}) {
  const heading = (title?: string) =>
    title ? (
      <p className="mb-1 text-[0.85em] font-semibold tracking-wide text-[#5f6368] uppercase">
        {title}
      </p>
    ) : null;

  switch (block.kind) {
    case "list":
      return (
        <div>
          {heading(block.title)}
          <div className="divide-y divide-[#eceff1] rounded-md border border-[#e3e6e8]">
            {block.rows.map((row, r) => {
              const shown = easeOut(span(t, 0.08 + r * 0.06, 0.18 + r * 0.06));
              const done = row.mark && decided(t, r);
              const picked = done && row.mark === "pick";
              return (
                <div
                  key={row.title + r}
                  className="flex items-center gap-2 px-2.5 py-[clamp(4px,1.1cqh,9px)]"
                  style={{
                    opacity: shown * (done && row.mark === "no" ? 0.55 : 1),
                    background: picked ? `${site.color}18` : undefined,
                  }}
                >
                  {row.avatar ? (
                    <span className="flex h-[2em] w-[2em] shrink-0 items-center justify-center rounded-full bg-[#eceff1] text-[0.85em] font-semibold text-[#5f6368]">
                      {row.avatar}
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate font-semibold ${done && row.mark === "no" ? "line-through" : ""}`}
                    >
                      {row.title}
                    </p>
                    {row.sub ? (
                      <p className="truncate text-[0.92em] text-[#5f6368]">
                        {row.sub}
                      </p>
                    ) : null}
                  </div>
                  {row.tags && !narrow
                    ? row.tags.map((tag) => (
                        <span
                          key={tag}
                          className="shrink-0 rounded-full bg-[#f1f3f4] px-2 text-[0.85em] text-[#3c4043]"
                        >
                          {tag}
                        </span>
                      ))
                    : null}
                  {done && row.note && !narrow ? (
                    <span className="shrink-0 text-[0.85em] text-[#5f6368] italic">
                      {row.note}
                    </span>
                  ) : null}
                  {done ? <Mark mark={row.mark!} color={site.color} /> : null}
                </div>
              );
            })}
          </div>
        </div>
      );
    case "fields":
      return (
        <div>
          {heading(block.title)}
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-[clamp(2px,0.8cqh,6px)] rounded-md border border-[#e3e6e8] px-3 py-2">
            {block.rows.map((row, r) => {
              const shown = t >= 0.08 + r * 0.05 ? 1 : 0;
              const done = row.mark && decided(t, r);
              return (
                <div key={row.label} className="contents">
                  <span
                    className="text-[#5f6368] transition-opacity duration-300"
                    style={{ opacity: shown }}
                  >
                    {row.label}
                  </span>
                  <span
                    className="flex min-w-0 flex-wrap items-center gap-x-2 font-medium transition-opacity duration-300"
                    style={{ opacity: shown }}
                  >
                    <span className="truncate">{row.value}</span>
                    {done ? <Mark mark={row.mark!} color={site.color} /> : null}
                    {done && row.note ? (
                      <span
                        className={`text-[0.88em] font-normal ${row.mark === "no" ? "text-[#d93025]" : "text-[#5f6368]"}`}
                      >
                        {row.note}
                      </span>
                    ) : null}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    case "text":
      return <TextBlock block={block} t={t} color={site.color} />;
    case "stats":
      return (
        <div className="grid grid-cols-3 gap-2">
          {block.items.map((item, i) => (
            <div
              key={item.label}
              className="rounded-md border border-[#e3e6e8] px-2.5 py-2"
              style={{
                opacity: easeOut(span(t, 0.08 + i * 0.07, 0.2 + i * 0.07)),
              }}
            >
              <p className="truncate text-[0.85em] text-[#5f6368]">
                {item.label}
              </p>
              <p
                className={`truncate font-semibold ${narrow ? "text-[1.05em]" : "text-[1.45em]"}`}
                style={{ color: site.color }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      );
    case "table": {
      const cols = narrow ? block.columns.slice(0, 3) : block.columns;
      return (
        <div>
          {heading(block.title)}
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-[#dadce0] text-left text-[#5f6368]">
                {cols.map((c) => (
                  <th key={c} className="truncate px-2 py-1 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => {
                const lit = block.highlight?.includes(r) && decided(t, r);
                return (
                  <tr
                    key={r}
                    className="border-b border-[#eceff1] transition-colors duration-300"
                    style={{
                      opacity: t >= 0.08 + r * 0.05 ? 1 : 0,
                      background: lit ? `${site.color}18` : undefined,
                    }}
                  >
                    {cols.map((_, c) => (
                      <td
                        key={c}
                        className={`truncate px-2 py-[clamp(3px,0.9cqh,7px)] ${c === 0 ? "font-medium" : ""}`}
                      >
                        {c === block.pill ? (
                          <span
                            className="rounded px-1.5 py-0.5 text-[0.9em] font-semibold"
                            style={{
                              background: `${site.color}22`,
                              color: site.color,
                            }}
                          >
                            {row[c]}
                          </span>
                        ) : (
                          row[c]
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
    case "map":
      return <MapBlock label={block.label} note={block.note} t={t} />;
    case "bars": {
      const max = Math.max(...block.values);
      const grow = easeOut(span(t, 0.12, 0.45));
      return (
        <div>
          {heading(block.title)}
          <div className="flex h-[clamp(60px,18cqh,130px)] items-end gap-[3px] rounded-md border border-[#e3e6e8] px-2 pt-2">
            {block.values.map((v, i) => (
              <div
                key={i}
                className="flex h-full flex-1 flex-col items-center justify-end gap-0.5"
              >
                <span
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${(v / max) * 100 * grow * 0.82}%`,
                    background: site.color,
                    minHeight: 2,
                  }}
                />
                {!narrow ? (
                  <span className="text-[0.75em] text-[#5f6368]">
                    {block.labels[i]}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          {block.note ? (
            <p className="mt-1 text-[#5f6368]">{block.note}</p>
          ) : null}
        </div>
      );
    }
  }
}

/**
 * A platform's own page, drawn from data: the job board, the enrichment
 * tool, the search engine, the CMS. Its brand colour and name, the page's
 * content, and the decision the workflow makes on it, marked on the rows.
 */
export default function SiteScene({
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
  const beat = demo.beats[beatIndex] as SiteBeat;
  const site = demo.sites![beat.site];
  const blocks: ReactNode[] = site.blocks.map((block, i) => (
    <div
      key={i}
      className="min-w-0"
      style={{ opacity: easeOut(span(t, 0.02 + i * 0.08, 0.12 + i * 0.08)) }}
    >
      <Block block={block} t={t} narrow={narrow} site={site} />
    </div>
  ));
  const split = site.columns && !narrow && blocks.length > 1;

  return (
    <Window
      title={`${site.title} · ${site.name}`}
      icon={<Logo site={site} size="1.25em" />}
    >
      <div className="flex h-full flex-col text-[clamp(10px,1.35cqw,13px)] text-[#202124]">
        <div
          className="flex items-center gap-[clamp(8px,1.6cqw,16px)] px-3 py-1.5 whitespace-nowrap"
          style={{
            background: site.dark ? "#1f2329" : "#fff",
            color: site.dark ? "#fff" : "#202124",
            borderBottom: `2px solid ${site.color}`,
          }}
        >
          <span className="flex items-center gap-1.5 font-bold">
            <Logo site={site} size="1.5em" />
            {site.name}
          </span>
          {site.search ? (
            <span
              className={`flex min-w-0 flex-1 items-center gap-1.5 rounded-full px-3 py-0.5 ${site.dark ? "bg-white/10" : "bg-[#f1f3f4]"}`}
            >
              <span aria-hidden="true">🔍</span>
              <span className="truncate">{site.search}</span>
            </span>
          ) : null}
          {!narrow && site.nav ? (
            <span className="ml-auto flex gap-[clamp(8px,1.4cqw,14px)] opacity-80">
              {site.nav.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden px-[clamp(8px,2cqw,20px)] py-[clamp(6px,1.6cqh,14px)]">
          <p className="mb-[clamp(4px,1.2cqh,10px)] text-[1.2em] font-semibold">
            {site.title}
          </p>
          {split ? (
            <div className="grid grid-cols-[1.1fr_1fr] gap-[clamp(8px,1.6cqw,16px)]">
              <div>{blocks[0]}</div>
              <div className="space-y-[clamp(6px,1.4cqh,12px)]">
                {blocks.slice(1)}
              </div>
            </div>
          ) : (
            <div className="space-y-[clamp(6px,1.4cqh,12px)]">{blocks}</div>
          )}
        </div>
      </div>
    </Window>
  );
}
