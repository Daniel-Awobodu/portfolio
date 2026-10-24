/**
 * A "Watch it run" demo: a scripted walkthrough of one build, played in the
 * browser like a video. The player and its scenes are shared; each build only
 * supplies this data. Every step must match how the real build works (its
 * write-up is the source), and all names and numbers are sample data.
 */

export type NodeKind =
  | "webhook"
  | "filter"
  | "http"
  | "switch"
  | "ai"
  | "airtable"
  | "edit"
  | "code"
  | "if"
  | "drive"
  | "sheets"
  | "whatsapp";

/** One node on the workflow canvas, in canvas units (a node is 60 wide). */
export type DemoNode = {
  id: string;
  label: string;
  /** Second line under the label, like n8n's operation text. */
  sub?: string;
  kind: NodeKind;
  x: number;
  y: number;
};

export type DemoEdge = { from: string; to: string; label?: string };

export type ChatMessage = {
  from: "me" | "them";
  /** Shown from this point in the beat (0 to 1). Omit to show from the start. */
  at?: number;
  /** A typing indicator, shown from `at` until `until`. */
  typing?: boolean;
  until?: number;
  /** A photo of the demo's receipt. */
  image?: boolean;
  text?: string;
  time: string;
};

export type Receipt = {
  vendor: string;
  address: string;
  date: string;
  lines: [string, string][];
  total: string;
};

export type DriveFile = { name: string; size: string; modified: string };

type BeatBase = { caption: string; duration: number };

export type Beat = BeatBase &
  (
    | { scene: "object" }
    | { scene: "camera" }
    | { scene: "chat"; messages: ChatMessage[] }
    | { scene: "canvas"; node: string; output?: [string, string][] }
    | { scene: "drive" }
    | { scene: "sheet" }
    | { scene: "end" }
  );

export type Scene = Beat["scene"];

export type Demo = {
  slug: string;
  /** Who is on the phone, for the scene tag ("Driver's phone"). */
  sceneLabels: Record<Scene, string>;
  chat: { contact: string; status: string; initials: string };
  receipt: Receipt;
  workflow: { nodes: DemoNode[]; edges: DemoEdge[] };
  drive: {
    path: string[];
    folders: string[];
    open: string;
    files: DriveFile[];
    newFile: DriveFile;
  };
  sheet: {
    title: string;
    columns: string[];
    rows: string[][];
    newRow: string[];
    /** Columns shown, by index: on wide screens, and on narrow ones. */
    wideColumns: number[];
    narrowColumns: number[];
  };
  end: { headline: string; points: { value: string; label: string }[] };
  beats: Beat[];
};
