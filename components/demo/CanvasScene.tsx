import { easeInOut, span } from "@/components/demo/anim";
import { NODE_COLORS, NodeGlyph } from "@/components/demo/icons";
import type { Beat, Demo, DemoNode, Workflow } from "@/lib/demos/types";

type CanvasBeat = Extract<Beat, { scene: "canvas" }>;

const NODE = 60;

type Point = { x: number; y: number };

/** The workflow a canvas beat runs in. */
export function flowOf(demo: Demo, beat: CanvasBeat): Workflow {
  return beat.flow ? demo.workflows![beat.flow] : demo.workflow!;
}

function edgePoints(from: DemoNode, to: DemoNode) {
  const a = { x: from.x + NODE, y: from.y + NODE / 2 };
  const b = { x: to.x, y: to.y + NODE / 2 };
  const dx = Math.max(40, (b.x - a.x) / 2);
  return [a, { x: a.x + dx, y: a.y }, { x: b.x - dx, y: b.y }, b] as const;
}

/** A point on the cubic Bézier through `p` at `s` (0 to 1). */
function bezier(p: readonly Point[], s: number): Point {
  const u = 1 - s;
  const w = [u * u * u, 3 * u * u * s, 3 * u * s * s, s * s * s];
  return {
    x: w.reduce((sum, k, i) => sum + k * p[i].x, 0),
    y: w.reduce((sum, k, i) => sum + k * p[i].y, 0),
  };
}

/** Splits a label into lines of roughly `max` characters, on spaces. */
function wrap(text: string, max: number) {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + word).length <= max) {
      lines[lines.length - 1] = `${last} ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines;
}

/**
 * The n8n-style canvas. The camera follows the run node by node: a data dot
 * travels the connection, the node spins while it works, then shows a check.
 * Branches the run doesn't take stay dimmed, so the whole design is visible.
 * A beat can pass straight through a few steps (`via`) on its way to the one
 * it stops at, and a workflow can run more than once (`run`).
 */
export default function CanvasScene({
  demo,
  beatIndex,
  t,
  width,
  height,
  narrow,
  reduced,
}: {
  demo: Demo;
  beatIndex: number;
  t: number;
  width: number;
  height: number;
  narrow: boolean;
  reduced: boolean;
}) {
  const beat = demo.beats[beatIndex];
  if (beat.scene !== "canvas") return null;

  const workflow = flowOf(demo, beat);
  const nodes = new Map(workflow.nodes.map((n) => [n.id, n]));

  // This run's beats, in order.
  const runBeats = demo.beats
    .map((b, i) => ({ b, i }))
    .filter(
      (x): x is { b: CanvasBeat; i: number } =>
        x.b.scene === "canvas" &&
        (x.b.flow ?? "") === (beat.flow ?? "") &&
        (x.b.run ?? 0) === (beat.run ?? 0),
    );
  const runPath = runBeats.flatMap((x) => [...(x.b.via ?? []), x.b.node]);
  const earlier = runBeats.filter((x) => x.i < beatIndex);
  const prevId = earlier[earlier.length - 1]?.b.node;

  // The stops on the way here: from the last node, through any pass-through
  // steps, to this beat's node.
  const path = [...(prevId ? [prevId] : []), ...(beat.via ?? []), beat.node]
    .map((id) => nodes.get(id)!)
    .filter(Boolean);
  const segments = path.length - 1;
  const travelEnd =
    segments > 0 ? Math.min(0.6, 0.3 + 0.1 * (segments - 1)) : 0.3;
  const runEnd = travelEnd + (1 - travelEnd) * 0.5;

  const progress =
    segments > 0 && !reduced ? easeInOut(span(t, 0, travelEnd)) * segments : 0;
  const seg = Math.min(segments - 1, Math.floor(progress));
  const local = segments > 0 ? progress - Math.max(0, seg) : 0;
  const arrived = segments === 0 || reduced || t >= travelEnd;
  const running = t >= travelEnd && t < runEnd;
  const done = t >= runEnd;

  const node = nodes.get(beat.node)!;
  const visited = new Set(
    earlier.flatMap((x) => [...(x.b.via ?? []), x.b.node]),
  );
  // Pass-through steps light up as the data reaches them.
  path.forEach((n, k) => {
    const passThrough = (k > 0 || !prevId) && k < segments;
    if (passThrough && (arrived || progress >= k)) visited.add(n.id);
  });
  if (done) visited.add(node.id);
  const onPath = new Set(runPath);

  // Camera: glide along the path, following each node's row.
  const centre = (n: DemoNode) => ({
    x: n.x + NODE / 2,
    y: n.y + NODE / 2,
  });
  const from = arrived || segments === 0 ? node : path[Math.max(0, seg)];
  const to = arrived || segments === 0 ? node : path[Math.max(0, seg) + 1];
  const k = arrived ? 1 : local;
  const cx = centre(from).x + (centre(to).x - centre(from).x) * k;
  const rowY = centre(from).y + (centre(to).y - centre(from).y) * k;
  const vw = narrow ? 470 : 760;
  const vh = vw * (height / Math.max(1, width));
  // On tall narrow screens the nodes sit high, leaving room for the output
  // panel underneath.
  // With the output shown under the node, the camera sits lower so the node
  // rides high and its data has room beneath it.
  const under = !!demo.outputUnder;
  const cy = under
    ? rowY + vh * (narrow ? 0.24 : 0.17)
    : narrow
      ? rowY + vh * 0.18
      : rowY;

  const traversed = (a: string, b: string) => {
    for (let i = 0; i < runPath.length - 1; i += 1) {
      if (runPath[i] === a && runPath[i + 1] === b) {
        return visited.has(a) && (visited.has(b) || (b === node.id && arrived));
      }
    }
    return false;
  };

  const dot =
    !arrived && segments > 0
      ? bezier(edgePoints(path[seg], path[seg + 1]), local)
      : null;

  const outputRows = beat.output ?? [];
  const outStart = travelEnd + 0.02;
  const showOutput = outputRows.length > 0 && t >= outStart;

  return (
    <div className="absolute inset-0 bg-[#1b1d1c]">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox={`${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id="demo-dots"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#3a3d3c" />
          </pattern>
        </defs>
        <rect
          x={-2000}
          y={-2000}
          width={9000}
          height={6000}
          fill="url(#demo-dots)"
        />

        {/* Connections */}
        {workflow.edges.map((edge) => {
          const a = nodes.get(edge.from)!;
          const b = nodes.get(edge.to)!;
          if (edge.model) {
            const x1 = a.x + NODE / 2;
            const y1 = a.y + NODE;
            const x2 = b.x + NODE / 2;
            const y2 = b.y + 6;
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={`M${x1},${y1} C${x1},${y1 + 40} ${x2},${y2 - 40} ${x2},${y2}`}
                fill="none"
                stroke={visited.has(a.id) ? "#4cc995" : "#5b605e"}
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            );
          }
          // A loop back to an earlier step runs underneath the row.
          if (b.x <= a.x) {
            const low = Math.max(a.y, b.y) + NODE + 58;
            const ax = a.x + NODE;
            const ay = a.y + NODE / 2;
            const by = b.y + NODE / 2;
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={`M${ax},${ay} h18 V${low} H${b.x - 18} V${by} h18`}
                fill="none"
                stroke="#5b605e"
                strokeWidth="1.5"
                strokeLinejoin="round"
                opacity="0.7"
              />
            );
          }
          const p = edgePoints(a, b);
          const lit = traversed(edge.from, edge.to);
          const branch = !(onPath.has(edge.from) && onPath.has(edge.to));
          const mid = bezier(p, 0.5);
          return (
            <g key={`${edge.from}-${edge.to}`} opacity={branch ? 0.45 : 1}>
              <path
                d={`M${p[0].x},${p[0].y} C${p[1].x},${p[1].y} ${p[2].x},${p[2].y} ${p[3].x},${p[3].y}`}
                fill="none"
                stroke={lit ? "#4cc995" : "#5b605e"}
                strokeWidth={lit ? 2.5 : 2}
              />
              {edge.label ? (
                <text
                  x={mid.x}
                  y={mid.y - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#a3a9a6"
                  fontFamily="var(--font-sans)"
                >
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* The data travelling to the current node */}
        {dot ? (
          <g>
            <circle cx={dot.x} cy={dot.y} r="9" fill="#4cc995" opacity="0.25" />
            <circle cx={dot.x} cy={dot.y} r="5" fill="#4cc995" />
          </g>
        ) : null}

        {/* Nodes */}
        {workflow.nodes.map((n) => {
          const isActive = n.id === node.id;
          // A sub-node works alongside its parent.
          const parent = workflow.edges.find(
            (e) => e.model && e.to === n.id,
          )?.from;
          const isDone = parent ? visited.has(parent) : visited.has(n.id);
          const isBusy = parent === node.id && running;
          const branch = parent ? !onPath.has(parent) : !onPath.has(n.id);
          const lines = wrap(n.label, narrow ? 13 : 15);
          const lit = isActive || isDone || isBusy;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x},${n.y})`}
              opacity={branch ? 0.45 : 1}
            >
              {isActive && !reduced ? (
                <rect
                  x={-6}
                  y={-6}
                  width={NODE + 12}
                  height={NODE + 12}
                  rx={14}
                  fill="none"
                  stroke="#4cc995"
                  strokeWidth="2"
                  opacity={0.25 + 0.25 * Math.sin(t * Math.PI * 6)}
                />
              ) : null}
              {n.round ? (
                <circle
                  cx={NODE / 2}
                  cy={NODE / 2}
                  r={NODE / 2 - 4}
                  fill="#2a2d2c"
                  stroke={lit ? "#4cc995" : "#4a4f4d"}
                  strokeWidth={isBusy ? 2.5 : 1.5}
                />
              ) : (
                <rect
                  width={NODE}
                  height={NODE}
                  rx={10}
                  fill="#2a2d2c"
                  stroke={lit ? "#4cc995" : "#4a4f4d"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
              )}
              {(isActive && running) || isBusy ? (
                n.round ? (
                  <circle
                    cx={NODE / 2}
                    cy={NODE / 2}
                    r={NODE / 2 - 4}
                    fill="none"
                    stroke="#d4ffe9"
                    strokeWidth="2.5"
                    strokeDasharray="30 200"
                    strokeDashoffset={
                      -((t - travelEnd) / (runEnd - travelEnd)) * 320
                    }
                  />
                ) : (
                  <rect
                    width={NODE}
                    height={NODE}
                    rx={10}
                    fill="none"
                    stroke="#d4ffe9"
                    strokeWidth="2.5"
                    strokeDasharray="40 200"
                    strokeDashoffset={
                      -((t - travelEnd) / (runEnd - travelEnd)) * 480
                    }
                  />
                )
              ) : null}
              <g transform="translate(18,18)">
                <NodeGlyph kind={n.kind} />
              </g>
              {isDone && !n.round ? (
                <g transform={`translate(${NODE - 4},4)`}>
                  <circle r="8" fill="#4cc995" />
                  <path
                    d="M-3.5 0 -1 2.5 3.5-2.5"
                    fill="none"
                    stroke="#0b100e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ) : null}
              {lines.map((line, i) => (
                <text
                  key={line}
                  x={NODE / 2}
                  y={NODE + 18 + i * 14}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={isActive ? 700 : 500}
                  fill={isActive ? "#ffffff" : "#d7dbd9"}
                  fontFamily="var(--font-sans)"
                >
                  {line}
                </text>
              ))}
              {n.sub ? (
                <text
                  x={NODE / 2}
                  y={NODE + 18 + lines.length * 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill={NODE_COLORS[n.kind]}
                  fontFamily="var(--font-sans)"
                >
                  {n.sub}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* What the node produced, in a card hanging under the node */}
      {showOutput && under
        ? (() => {
            const scale = width / vw;
            const labelLines = wrap(node.label, narrow ? 13 : 15).length;
            const below =
              node.y + NODE + 18 + labelLines * 14 + (node.sub ? 6 : -6);
            const top = height / 2 + (below - cy) * scale + 10;
            const panelW = Math.min(narrow ? width - 24 : 380, width - 24);
            const centreX = width / 2 + (node.x + NODE / 2 - cx) * scale;
            const left = Math.min(
              Math.max(centreX - panelW / 2, 12),
              width - panelW - 12,
            );
            const arrow = Math.min(Math.max(centreX - left, 18), panelW - 18);
            return (
              <div
                aria-hidden="true"
                className="demo-fade absolute rounded-lg border border-[#4cc995]/40 bg-[#111413]/95 px-3 py-2.5 font-mono text-[13px] leading-relaxed text-[#d7dbd9] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                style={{ top, left, width: panelW }}
              >
                <span
                  className="absolute -top-[7px] h-3 w-3 rotate-45 border-t border-l border-[#4cc995]/40 bg-[#111413]"
                  style={{ left: arrow - 6 }}
                />
                <p className="mb-1 flex items-center gap-2 font-sans text-[10.5px] font-semibold tracking-wide text-[#4cc995] uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4cc995]" />
                  Test data
                </p>
                {outputRows.map(([key, value], i) => {
                  const shown =
                    t >=
                    outStart +
                      0.03 +
                      (i * (0.9 - outStart) * 0.6) / outputRows.length;
                  return (
                    <p
                      key={key}
                      className={`flex gap-3 transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
                    >
                      <span className="w-[6.5rem] shrink-0 text-[#8ab4f8]">
                        {key}
                      </span>
                      <span className="min-w-0 text-white">{value}</span>
                    </p>
                  );
                })}
              </div>
            );
          })()
        : null}

      {/* What the node produced, like n8n's output panel */}
      {showOutput && !under ? (
        <div
          aria-hidden="true"
          className={`demo-fade absolute rounded-lg border border-white/10 bg-[#111413]/95 p-3 font-mono text-[12px] leading-relaxed text-[#d7dbd9] shadow-lg ${
            narrow
              ? "inset-x-3 bottom-[19cqh]"
              : "right-[3cqw] bottom-[16cqh] w-[min(360px,36cqw)]"
          }`}
        >
          <p className="mb-1.5 flex items-center gap-2 font-sans text-[11px] font-semibold tracking-wide text-[#a3a9a6] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4cc995]" />
            Output · {node.label}
          </p>
          {outputRows.map(([key, value], i) => {
            const shown =
              t >=
              outStart +
                0.03 +
                (i * (0.9 - outStart) * 0.6) / outputRows.length;
            return (
              <p
                key={key}
                className={`flex gap-3 transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
              >
                <span className="w-[5.5rem] shrink-0 text-[#8ab4f8]">
                  {key}
                </span>
                <span className="min-w-0 truncate text-white">{value}</span>
              </p>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
