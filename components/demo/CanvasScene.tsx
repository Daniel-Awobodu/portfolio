import { easeInOut, span } from "@/components/demo/anim";
import { NODE_COLORS, NodeGlyph } from "@/components/demo/icons";
import type { Beat, Demo, DemoNode } from "@/lib/demos/types";

type CanvasBeat = Extract<Beat, { scene: "canvas" }>;

const NODE = 60;
const ROW_CENTER = 225;

type Point = { x: number; y: number };

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

  const nodes = new Map(demo.workflow.nodes.map((n) => [n.id, n]));
  const canvasBeats = demo.beats
    .map((b, i) => ({ b, i }))
    .filter((x): x is { b: CanvasBeat; i: number } => x.b.scene === "canvas");
  const runPath = canvasBeats.map((x) => x.b.node);
  const prevId = [...canvasBeats].reverse().find((x) => x.i < beatIndex)
    ?.b.node;

  const node = nodes.get(beat.node)!;
  const prev = prevId ? nodes.get(prevId) : undefined;

  // Phases within the beat: travel, then run, then done.
  const travel = prev && !reduced ? easeInOut(span(t, 0, 0.3)) : 1;
  const running = t >= 0.3 && t < 0.65;
  const done = t >= 0.65;

  const visited = new Set(
    canvasBeats.filter((x) => x.i < beatIndex).map((x) => x.b.node),
  );
  if (done) visited.add(node.id);
  const onPath = new Set(runPath);

  // Camera: glide from the previous node to this one.
  const from = prev ?? node;
  const cx = from.x + (node.x - from.x) * travel + NODE / 2;
  const vw = narrow ? 470 : 760;
  const vh = vw * (height / Math.max(1, width));
  // On tall narrow screens the nodes sit high, leaving room for the output
  // panel underneath.
  const cy = narrow ? ROW_CENTER + vh * 0.18 : ROW_CENTER;

  const traversed = (a: string, b: string) => {
    const ia = runPath.indexOf(a);
    const ib = runPath.indexOf(b);
    return (
      ia !== -1 &&
      ib === ia + 1 &&
      visited.has(a) &&
      (visited.has(b) || b === node.id)
    );
  };

  const outputRows = beat.output ?? [];
  const showOutput = outputRows.length > 0 && t >= 0.32;

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
          width={8000}
          height={5000}
          fill="url(#demo-dots)"
        />

        {/* Connections */}
        {demo.workflow.edges.map((edge) => {
          const a = nodes.get(edge.from)!;
          const b = nodes.get(edge.to)!;
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

        {/* The data travelling into the current node */}
        {prev && travel < 1
          ? (() => {
              const pos = bezier(edgePoints(prev, node), travel);
              return (
                <g>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="9"
                    fill="#4cc995"
                    opacity="0.25"
                  />
                  <circle cx={pos.x} cy={pos.y} r="5" fill="#4cc995" />
                </g>
              );
            })()
          : null}

        {/* Nodes */}
        {demo.workflow.nodes.map((n) => {
          const isActive = n.id === node.id;
          const isDone = visited.has(n.id);
          const branch = !onPath.has(n.id);
          const lines = wrap(n.label, narrow ? 13 : 15);
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
              <rect
                width={NODE}
                height={NODE}
                rx={10}
                fill="#2a2d2c"
                stroke={isActive || isDone ? "#4cc995" : "#4a4f4d"}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              {isActive && running ? (
                <rect
                  width={NODE}
                  height={NODE}
                  rx={10}
                  fill="none"
                  stroke="#d4ffe9"
                  strokeWidth="2.5"
                  strokeDasharray="40 200"
                  strokeDashoffset={-((t - 0.3) / 0.35) * 480}
                />
              ) : null}
              <g transform="translate(18,18)">
                <NodeGlyph kind={n.kind} />
              </g>
              {isDone ? (
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

      {/* What the node produced, like n8n's output panel */}
      {showOutput ? (
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
            const shown = t >= 0.36 + (i * 0.4) / outputRows.length;
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
