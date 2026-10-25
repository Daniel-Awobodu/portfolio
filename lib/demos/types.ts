/**
 * A "Watch it run" demo: a scripted walkthrough of one build, played in the
 * browser like a video. The player and its scenes are shared; each build only
 * supplies this data. Every step must match how the real build works (its
 * write-up is the source), and all names and numbers are sample data.
 */

export type NodeKind =
  | "webhook"
  | "trigger"
  | "filter"
  | "http"
  | "switch"
  | "ai"
  | "model"
  | "airtable"
  | "edit"
  | "code"
  | "if"
  | "drive"
  | "sheets"
  | "whatsapp"
  | "gmail"
  | "loop"
  | "subflow"
  | "wait"
  | "table"
  | "merge"
  | "calendar"
  | "respond"
  | "sms";

/** One node on the workflow canvas, in canvas units (a node is 60 wide). */
export type DemoNode = {
  id: string;
  label: string;
  /** Second line under the label, like n8n's operation text. */
  sub?: string;
  kind: NodeKind;
  x: number;
  y: number;
  /** A round sub-node, like the AI model hanging under an AI step. */
  round?: boolean;
};

export type DemoEdge = {
  from: string;
  to: string;
  label?: string;
  /** A dashed link from a step down to its sub-node. */
  model?: boolean;
};

export type Workflow = {
  /** Shown in the scene tag, for demos with more than one workflow. */
  label?: string;
  nodes: DemoNode[];
  edges: DemoEdge[];
};

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

export type ChatThread = {
  /** WhatsApp by default; "sms" draws a plain text-message app. */
  app?: "whatsapp" | "sms";
  contact: string;
  status?: string;
  initials: string;
};

export type Receipt = {
  vendor: string;
  address: string;
  date: string;
  lines: [string, string][];
  total: string;
};

export type DriveFile = { name: string; size: string; modified: string };

export type InboxEmail = {
  from: string;
  subject: string;
  snippet: string;
  time: string;
  /** Matches the order search (highlighted in "match" mode). */
  order?: boolean;
};

export type CallLine = {
  who: "caller" | "agent";
  text: string;
  /** When the line starts, as progress through the beat (0 to 1). */
  at: number;
};

export type CalendarEvent = {
  /** Column in the week, 0 for the first day shown. */
  day: number;
  /** Hours, 24-hour clock: 16 is 4pm. */
  start: number;
  end: number;
  title: string;
  color: string;
};

export type Output = [string, string][];

type BeatBase = {
  caption: string;
  duration: number;
  /** Overrides the scene tag for this beat. */
  label?: string;
  /** What the narrator says, when it should differ from the caption. */
  say?: string;
};

export type Beat = BeatBase &
  (
    | { scene: "object" }
    | { scene: "camera" }
    | {
        scene: "chat";
        messages: ChatMessage[];
        /** A key of `threads`; the demo's `chat` when omitted. */
        thread?: string;
      }
    | {
        scene: "canvas";
        node: string;
        /** A key of `workflows`; the demo's `workflow` when omitted. */
        flow?: string;
        /** Separate runs of the same workflow; nodes reset between runs. */
        run?: number;
        /** Steps the data passes straight through on its way to `node`. */
        via?: string[];
        output?: Output;
      }
    | { scene: "drive" }
    | { scene: "sheet"; mode?: "type" | "stream" | "invalid" }
    | { scene: "form"; mode: "fill" | "thanks" }
    | { scene: "inbox"; mode: "arrive" | "match" | "pile" | "open" }
    | { scene: "zap"; step: number; output?: Output }
    | {
        scene: "call";
        mode: "ringing" | "live" | "outgoing";
        lines?: CallLine[];
        /** Seconds on the call timer when the beat starts. */
        clock?: number;
      }
    | { scene: "calendar"; mode: "taken" | "booked" }
    | { scene: "end" }
  );

export type Scene = Beat["scene"];

export type Demo = {
  slug: string;
  /** Where the walkthrough goes, for the build page: "from the driver’s
   *  phone to the expense sheet". */
  journey: string;
  /** The scene tag for each kind of scene ("Driver’s phone"). */
  sceneLabels: Partial<Record<Scene, string>>;
  chat?: ChatThread;
  threads?: Record<string, ChatThread>;
  receipt?: Receipt;
  workflow?: Workflow;
  workflows?: Record<string, Workflow>;
  drive?: {
    path: string[];
    folders: string[];
    open: string;
    files: DriveFile[];
    newFile: DriveFile;
  };
  sheet?: {
    title: string;
    columns: string[];
    rows: string[][];
    newRow?: string[];
    /** Columns shown, by index: on wide screens, and on narrow ones. */
    wideColumns: number[];
    narrowColumns: number[];
    tabs?: string[];
    /** "stream" mode: rows pouring in until the sheet holds `total` rows. */
    stream?: { total: number; sample: string[][] };
    /** "invalid" mode: the review tab. */
    invalid?: {
      columns: string[];
      rows: string[][];
      wideColumns: number[];
      narrowColumns: number[];
    };
  };
  form?: {
    site: string;
    product: string;
    price: string;
    fields: [string, string][];
    agree: string;
    button: string;
    thanks: { title: string; body: string };
  };
  inbox?: {
    count: string;
    emails: InboxEmail[];
    /** The email that arrives in "arrive" mode. */
    newEmail?: InboxEmail;
    /** What the search box shows in "match" mode. */
    search?: string;
    /** "pile" mode: order emails, repeated to fill a long inbox. */
    pile?: InboxEmail[];
    open?: { from: string; subject: string; time: string; body: Output };
  };
  zap?: {
    title: string;
    steps: { app: string; kind: NodeKind; badge?: string; title: string }[];
  };
  call?: {
    name: string;
    initials: string;
    /** Under the name on an outgoing call. */
    sub?: string;
    labels?: { caller: string; agent: string };
  };
  calendar?: {
    title: string;
    month: string;
    days: [string, number][];
    /** First and last hour shown, 24-hour clock. */
    hours: [number, number];
    calendars: { name: string; color: string; on: boolean }[];
    events: CalendarEvent[];
    taken: CalendarEvent;
    booked: CalendarEvent & { when: string; details: string[] };
  };
  end: { headline: string; points: { value: string; label: string }[] };
  beats: Beat[];
  /** Length of each beat's narration clip in ms, null for none. Filled in
   *  from lib/demos/voice.json; never written by hand. */
  voice?: (number | null)[];
  /** The beats at their scripted length, for playing silently on a card. */
  silentBeats?: Beat[];
};
