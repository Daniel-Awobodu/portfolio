import type { NodeKind } from "@/lib/demos/types";

/**
 * Node glyphs for the workflow canvas, drawn on a 24-unit grid. Generic
 * shapes in each service's colour, with the service named under the node,
 * rather than copies of anyone's logo.
 */
export const NODE_COLORS: Record<NodeKind, string> = {
  webhook: "#ff6d5a",
  filter: "#a78bfa",
  http: "#60a5fa",
  switch: "#a78bfa",
  ai: "#8ab4f8",
  airtable: "#fcb400",
  edit: "#cbd5e1",
  code: "#fb923c",
  if: "#a78bfa",
  drive: "#facc15",
  sheets: "#34d399",
  whatsapp: "#25d366",
  trigger: "#ff6d5a",
  schedule: "#ff6d5a",
  model: "#f97316",
  gmail: "#ea4335",
  loop: "#5eead4",
  subflow: "#fb923c",
  wait: "#f472b6",
  table: "#f59e0b",
  merge: "#fb923c",
  calendar: "#4285f4",
  respond: "#f472b6",
  sms: "#38bdf8",
};

export function NodeGlyph({ kind }: { kind: NodeKind }) {
  const c = NODE_COLORS[kind];
  const stroke = {
    fill: "none",
    stroke: c,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (kind) {
    case "webhook":
      return <path d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z" fill={c} />;
    case "filter":
      return <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" {...stroke} />;
    case "http":
      return (
        <g {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
        </g>
      );
    case "switch":
      return (
        <g {...stroke}>
          <path d="M4 12h6M10 12l4-6h6M10 12l4 6h6" />
          <path d="m17 3 3 3-3 3M17 15l3 3-3 3" />
        </g>
      );
    case "ai":
      return (
        <path
          d="M12 2c.6 4.8 2.6 7.4 8 8.5v1C14.6 12.6 12.6 15.2 12 20h-.1c-.6-4.8-2.6-7.4-8-8.5v-1c5.4-1.1 7.4-3.7 8-8.5h.1Z"
          fill={c}
        />
      );
    case "airtable":
      return (
        <g {...stroke}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18M3 15h18M10 10v10" />
        </g>
      );
    case "edit":
      return <path d="M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4" {...stroke} />;
    case "code":
      return (
        <path
          d="M9 4C6 4 7 9 4 12c3 3 2 8 5 8M15 4c3 0 2 5 5 8-3 3-2 8-5 8"
          {...stroke}
        />
      );
    case "if":
      return (
        <g {...stroke}>
          <path d="M12 3 21 12l-9 9-9-9 9-9Z" />
          <path d="M9.5 12h5" />
        </g>
      );
    case "drive":
      return (
        <path
          d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
          {...stroke}
        />
      );
    case "sheets":
      return (
        <g {...stroke}>
          <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
          <path d="M8 11h8v7H8zM8 14.5h8M12 11v7" />
        </g>
      );
    case "trigger":
      return (
        <g {...stroke}>
          <path d="M9 4v7M9 4a2 2 0 0 1 4 0v5l4 1a2 2 0 0 1 1.5 2.2L18 17a4 4 0 0 1-4 3h-2a4 4 0 0 1-3.2-1.6L5.5 14a1.6 1.6 0 0 1 2.4-2.1L9 13" />
        </g>
      );
    case "schedule":
      return (
        <g {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </g>
      );
    case "model":
      return (
        <g {...stroke}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        </g>
      );
    case "gmail":
      return (
        <g {...stroke}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </g>
      );
    case "loop":
      return (
        <g {...stroke}>
          <path d="M4 12a7 7 0 0 1 12.5-4.3L19 10" />
          <path d="M19 4v6h-6" />
          <path d="M20 12a7 7 0 0 1-12.5 4.3" />
        </g>
      );
    case "subflow":
      return (
        <g {...stroke}>
          <path d="M8 4H5v16h3" />
          <path d="M10 12h10M16 8l4 4-4 4" />
        </g>
      );
    case "wait":
      return (
        <g {...stroke}>
          <path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9" />
        </g>
      );
    case "table":
      return (
        <g {...stroke}>
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <path d="M3 9.5h18M3 15h18M9 4v16M15 4v16" />
        </g>
      );
    case "merge":
      return (
        <g {...stroke}>
          <path d="M4 5h5l5 7h6M4 19h5l5-7M17 9l3 3-3 3" />
        </g>
      );
    case "calendar":
      return (
        <g {...stroke}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </g>
      );
    case "respond":
      return (
        <g {...stroke}>
          <path d="M10 8 4 13l6 5" />
          <path d="M4 13h10a6 6 0 0 0 6-6V5" />
        </g>
      );
    case "sms":
      return (
        <g {...stroke}>
          <path d="M4 5h16v11H9l-5 4V5Z" />
          <path d="M8 10h8" />
        </g>
      );
    case "whatsapp":
      return (
        <g {...stroke}>
          <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1Z" />
          <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2L9 9.5Z" />
        </g>
      );
  }
}
