/**
 * A "Watch it run" demo: a scripted walkthrough of one build, played in the
 * browser like a video. The player and its scenes are shared; each build only
 * supplies this data. Every step must match how the real build works (its
 * write-up is the source), and all names and numbers are sample data.
 */

export type NodeKind =
  | "webhook"
  | "trigger"
  | "schedule"
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
  | "sms"
  | "hubspot"
  | "chat"
  | "file"
  | "slack";

export type SlackMessage = {
  time: string;
  title: string;
  /** Bold lines under the title, before the details. */
  lead?: string[];
  /** Label and value lines under the title. */
  meta: [string, string][];
  /** "Items: 12 | Subtotal: ₦1,784,500" and the like. */
  summary?: string;
  status?: { icon: string; text: string };
  /** Each item as written, then what it matched. */
  items: { asked: string; matched: string }[];
  /** A quoted block, like the suggested next step. */
  quote?: string;
  /** A link line, like "Open the record · SHQ-…". */
  link?: [string, string];
  footer?: string;
  /** Items not listed. */
  more?: number;
  preview?: string[];
  /** Ask for a decision, with the buttons. */
  buttons?: boolean;
};

export type Attachment = {
  name: string;
  kind: "pdf" | "txt" | "csv" | "xlsx" | "image";
};

export type FieldKind =
  | "text"
  | "select"
  | "number"
  | "date"
  | "currency"
  | "long";

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
  /** A voice note, with its length ("0:07"). */
  voice?: string;
  text?: string;
  time: string;
};

export type ChatThread = {
  /** WhatsApp by default; "sms" draws a text-message app, "web" a
   *  website chat widget. */
  app?: "whatsapp" | "sms" | "web";
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
  /** "sort" mode: the labels the assistant adds, and whether it stars it. */
  labels?: string[];
  starred?: boolean;
  attachment?: Attachment;
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
        /** The last message first arrives as a notification on the lock
         *  screen, then opens in the thread. */
        notify?: boolean;
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
    | { scene: "sheet"; mode?: "type" | "stream" | "invalid" | "filter" }
    | { scene: "extract"; mode: "read" | "check" | "invalid" }
    | { scene: "form"; mode: "fill" | "thanks" }
    | { scene: "webform" }
    | {
        scene: "inbox";
        mode: "arrive" | "match" | "pile" | "open" | "thread" | "sort";
        /** "thread" mode: how many of the thread's messages are shown. */
        show?: number;
      }
    | { scene: "zap"; step: number; output?: Output }
    | {
        scene: "call";
        mode: "ringing" | "live" | "outgoing";
        lines?: CallLine[];
        /** Seconds on the call timer when the beat starts. */
        clock?: number;
      }
    | { scene: "calendar"; mode: "view" | "taken" | "booked" | "moved" }
    | { scene: "crm"; mode: "lead" | "responded" }
    | {
        scene: "slack";
        /** Which of `slack.messages` arrives. */
        message: number;
        /** Someone presses Approve. */
        approve?: boolean;
      }
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
  /** Canvas output shows in a card under the node, not in a side panel. */
  outputUnder?: boolean;
  drive?: {
    path: string[];
    folders: string[];
    open: string;
    files: DriveFile[];
    newFile: DriveFile;
    /** A folder created for the file, before it opens. */
    newFolder?: string;
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
    /** Drawn as Google Sheets unless set; "airtable" for an Airtable base. */
    app?: "sheets" | "airtable" | "n8n";
    /** "type" mode: several finished rows landing one after another,
     *  instead of one row typed in. */
    newRows?: string[][];
    /** "filter" mode: the sheet narrowed to one product, as a search. */
    filter?: { label: string; rows: string[][]; rowNumbers: number[] };
    /** Airtable and n8n: each column's field type, for its header icon. */
    fieldKinds?: FieldKind[];
    /** Airtable: the base's name, shown in its header. */
    base?: string;
    /** Airtable: the base's tables, shown as tabs. */
    tables?: string[];
    /** n8n: each row's createdAt. */
    createdAt?: string[];
  };
  /** The AI reading an email into a clean record ("extract" scenes). The
   *  email is `inbox.open`; each row lines up with one of its body lines. */
  extract?: {
    title: string;
    rows: Output;
    check: string;
    saved: string;
    invalid: {
      email: { from: string; subject: string; time: string; body: Output };
      rows: Output;
      /** Index of the row that fails, shown in red. */
      failed: number;
      reason: string;
    };
  };
  /** A request form on a website, in a browser ("webform" scenes). */
  webform?: {
    site: string;
    brand: [string, string];
    kicker: string;
    heading: string;
    intro: string;
    fields: [string, string][];
    /** The long answer, typed last. */
    request: [string, string];
    button: string;
    /** The button in the site's header. */
    cta: string;
    thanks: { title: string; body: string; reference?: string };
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
    /** "sort" mode: the label tree in the side bar. */
    labels?: string[];
    /** The email that arrives in "arrive" mode. */
    newEmail?: InboxEmail;
    /** What the search box shows in "match" mode. */
    search?: string;
    /** "pile" mode: order emails, repeated to fill a long inbox. */
    pile?: InboxEmail[];
    open?: {
      from: string;
      subject: string;
      time: string;
      body: Output;
      /** Written as a letter instead of label and value rows. */
      text?: string[];
      /** A shorter letter for narrow screens. */
      brief?: string[];
      attachments?: Attachment[];
    };
    /** "thread" mode: one email conversation, oldest first. */
    thread?: {
      subject: string;
      messages: {
        from: string;
        time: string;
        body: string;
        note?: string;
        /** The newest message, opened: shown in full, line by line. */
        lines?: string[];
        attachments?: number;
      }[];
    };
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
    taken?: CalendarEvent;
    booked?: CalendarEvent & { when: string; details: string[] };
    /** "moved" mode: an appointment dragged to a new time. */
    move?: { from: CalendarEvent; to: CalendarEvent; note: string };
  };
  /** A CRM contact record ("crm" scenes). */
  /** A Slack channel where approval requests arrive ("slack" scenes). */
  slack?: {
    workspace: string;
    channel: string;
    channels: string[];
    bot: string;
    approvedBy: string;
    messages: SlackMessage[];
  };
  /** HubSpot's Contacts and Tasks tables ("crm" scenes). */
  crm?: {
    /** Contacts already in the table, under the new lead. */
    contacts: { name: string; initials: string; stage: string }[];
    lead: { name: string; initials: string; email: string; phone: string };
    /** The lead's lifecycle stage: on arrival, during the sequence, after
     *  the reply. */
    stages: { lead: string; sequence: string; responded: string };
    task: { title: string; stage: string };
    /** The status column's heading; "Lifecycle stage" when omitted. */
    stageLabel?: string;
  };
  end: { headline: string; points: { value: string; label: string }[] };
  beats: Beat[];
  /** Length of each beat's narration clip in ms, null for none. Filled in
   *  from lib/demos/voice.json; never written by hand. */
  voice?: (number | null)[];
  /** The beats at their scripted length, for playing silently on a card. */
  silentBeats?: Beat[];
};
