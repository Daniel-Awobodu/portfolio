import type { Demo } from "@/lib/demos/types";

/*
 * The brokerage follow-ups, as they really run (see content/automation/
 * crm-follow-ups.mdx and its canvas screenshot). The three n8n workflows use
 * their real node names. The run shown is the one tested in the write-up: a
 * reply that lands just before a follow-up is due stops it, and the lead is
 * handed to an agent. Every name, email and amount here is sample data.
 */

const first = {
  from: "Tolu · Keystone Homes",
  time: "Mon 2 Nov, 9:02",
  body: "Hi Amaka, thanks for asking about 3-bed duplexes in Lekki Phase 1. I've found a few within your ₦150m budget. Would a viewing this week suit you?",
};
const followUp = {
  from: "Tolu · Keystone Homes",
  time: "Thu 5 Nov, 9:00",
  note: "follow-up · day 3",
  body: "Hi Amaka, just checking in on the Lekki duplexes. One of them has a viewing slot free this Saturday.",
};
const reply = {
  from: "Amaka Eze",
  time: "Mon 9 Nov, 8:58",
  note: "reply",
  body: "Hi Tolu, sorry for the slow reply. Yes please, can we see it Saturday morning?",
};

export const crmFollowUps: Demo = {
  slug: "crm-follow-ups",
  journey: "from a new lead in HubSpot to a reply in the agent’s hands",
  sceneLabels: {
    crm: "HubSpot",
    canvas: "The follow-up workflows · n8n",
    inbox: "Lead’s inbox",
    end: "Done",
  },
  crm: {
    contacts: [
      { name: "Kunle Adeyemi", initials: "KA", stage: "In Sequence" },
      { name: "Ifeoma Obi", initials: "IO", stage: "Responded" },
    ],
    lead: {
      name: "Amaka Eze",
      initials: "AE",
      email: "amaka•••@gmail.com",
      phone: "0803 ••• 1172",
    },
    stages: { lead: "Lead", sequence: "In Sequence", responded: "Responded" },
    task: { title: "Lead replied - follow up", stage: "Not Started" },
  },
  outputUnder: true,
  workflows: {
    first: {
      label: "First email workflow · n8n",
      nodes: [
        {
          id: "receive",
          label: "Receive HubSpot Lead Event",
          sub: "POST",
          kind: "webhook",
          x: 0,
          y: 200,
        },
        {
          id: "flatten",
          label: "Flatten Contact Fields",
          sub: "manual",
          kind: "edit",
          x: 170,
          y: 200,
        },
        {
          id: "write",
          label: "Write Personalized...",
          kind: "ai",
          x: 340,
          y: 200,
        },
        {
          id: "parse",
          label: "Parse AI Message Output",
          kind: "code",
          x: 510,
          y: 200,
        },
        {
          id: "send",
          label: "Send First Message",
          sub: "send: message",
          kind: "gmail",
          x: 680,
          y: 200,
        },
        {
          id: "log",
          label: "Log Sequence State",
          sub: "appendOrUpdate: sheet",
          kind: "sheets",
          x: 850,
          y: 200,
        },
        {
          id: "advance",
          label: "Advance Stage to In Sequence",
          sub: "upsert: contact",
          kind: "hubspot",
          x: 1020,
          y: 200,
        },
      ],
      edges: [
        { from: "receive", to: "flatten" },
        { from: "flatten", to: "write" },
        { from: "write", to: "parse" },
        { from: "parse", to: "send" },
        { from: "send", to: "log" },
        { from: "log", to: "advance" },
      ],
    },
    reply: {
      label: "Reply watcher workflow · n8n",
      nodes: [
        {
          id: "watch",
          label: "Watch Gmail Inbox",
          sub: "Gmail Trigger",
          kind: "gmail",
          x: 0,
          y: 200,
        },
        {
          id: "confirm",
          label: "Confirm Genuinely Inbound",
          kind: "if",
          x: 170,
          y: 200,
        },
        {
          id: "match",
          label: "Match Reply to Active Sequence",
          sub: "read: sheet",
          kind: "sheets",
          x: 340,
          y: 200,
        },
        {
          id: "never",
          label: "If Lead has never replied",
          kind: "if",
          x: 510,
          y: 200,
        },
        {
          id: "mark",
          label: "Mark Sequence Responded",
          sub: "update: sheet",
          kind: "sheets",
          x: 680,
          y: 200,
        },
        {
          id: "stage",
          label: "Advance Stage to Responded",
          sub: "upsert: contact",
          kind: "hubspot",
          x: 850,
          y: 200,
        },
        {
          id: "task",
          label: "Create Follow-up Task",
          sub: "create: engagement",
          kind: "hubspot",
          x: 1020,
          y: 200,
        },
      ],
      edges: [
        { from: "watch", to: "confirm" },
        { from: "confirm", to: "match", label: "true" },
        { from: "match", to: "never" },
        { from: "never", to: "mark", label: "true" },
        { from: "mark", to: "stage" },
        { from: "stage", to: "task" },
      ],
    },
    followUp: {
      label: "Follow-up workflow · n8n",
      nodes: [
        {
          id: "due",
          label: "Check Due Follow-ups",
          kind: "schedule",
          x: 0,
          y: 200,
        },
        {
          id: "rows",
          label: "Get All Sequence Rows",
          sub: "read: sheet",
          kind: "sheets",
          x: 170,
          y: 200,
        },
        {
          id: "filter",
          label: "Filter Due Follow-ups",
          kind: "code",
          x: 340,
          y: 200,
        },
        {
          id: "wait",
          label: "Wait, Incase a Lead Responds at this time",
          kind: "wait",
          x: 510,
          y: 200,
        },
        {
          id: "recheck",
          label: "Recheck Sequence Status",
          sub: "read: sheet",
          kind: "sheets",
          x: 680,
          y: 200,
        },
        {
          id: "active",
          label: "Check If Still Active",
          kind: "if",
          x: 850,
          y: 200,
        },
        {
          id: "firstMsg",
          label: "Get First Message",
          sub: "get: thread",
          kind: "gmail",
          x: 1020,
          y: 200,
        },
        {
          id: "convert",
          label: "Convert Base64 to string",
          kind: "code",
          x: 1190,
          y: 200,
        },
        {
          id: "contact",
          label: "Get Contact Personalization Data",
          sub: "get: contact",
          kind: "hubspot",
          x: 1360,
          y: 200,
        },
        {
          id: "writeF",
          label: "Write Personalized...",
          kind: "ai",
          x: 1530,
          y: 200,
        },
        {
          id: "parseF",
          label: "Parse AI Message Output - Follow-up",
          kind: "code",
          x: 1700,
          y: 200,
        },
        {
          id: "sendF",
          label: "Send Follow-up Reply",
          sub: "reply: message",
          kind: "gmail",
          x: 1870,
          y: 200,
        },
        {
          id: "next",
          label: "Compute Next Follow-up State",
          kind: "code",
          x: 2040,
          y: 200,
        },
        {
          id: "ended",
          label: "Check If Sequence Just Ended",
          kind: "if",
          x: 2210,
          y: 200,
        },
        {
          id: "noResp",
          label: "Advance Stage to No Response",
          sub: "upsert: contact",
          kind: "hubspot",
          x: 2380,
          y: 90,
        },
        {
          id: "update",
          label: "Update Sequence After Follow-up",
          sub: "update: sheet",
          kind: "sheets",
          x: 2550,
          y: 200,
        },
      ],
      edges: [
        { from: "due", to: "rows" },
        { from: "rows", to: "filter" },
        { from: "filter", to: "wait" },
        { from: "wait", to: "recheck" },
        { from: "recheck", to: "active" },
        { from: "active", to: "firstMsg", label: "true" },
        { from: "firstMsg", to: "convert" },
        { from: "convert", to: "contact" },
        { from: "contact", to: "writeF" },
        { from: "writeF", to: "parseF" },
        { from: "parseF", to: "sendF" },
        { from: "sendF", to: "next" },
        { from: "next", to: "ended" },
        { from: "ended", to: "noResp", label: "true" },
        { from: "ended", to: "update", label: "false" },
        { from: "noResp", to: "update" },
      ],
    },
  },
  inbox: {
    count: "4",
    emails: [],
    thread: {
      subject: "Your Lekki duplex search",
      messages: [first, followUp, reply],
    },
  },
  end: {
    headline: "Every lead followed up, never chased after a reply.",
    points: [
      { value: "100%", label: "of new leads get a personal first email" },
      { value: "0", label: "follow-ups sent after a lead replies" },
    ],
  },
  beats: [
    {
      scene: "crm",
      mode: "lead",
      duration: 4400,
      caption: "A new lead lands in HubSpot. That alone starts her sequence.",
      say: "A new leed lands in HubSpot. That alone starts her sequence.",
    },
    {
      scene: "canvas",
      flow: "first",
      node: "flatten",
      via: ["receive"],
      duration: 5000,
      caption:
        "n8n receives her details: her area, her budget and what she asked about.",
      output: [
        ["name", "Amaka Eze"],
        ["area", "Lekki Phase 1"],
        ["budget", "₦150m"],
        ["asked about", "3-bed duplexes"],
      ],
    },
    {
      scene: "canvas",
      flow: "first",
      node: "write",
      duration: 5200,
      caption:
        "AI writes a first email around those details. If one is missing, it simply leaves it out.",
      output: [
        ["mentions", "Lekki Phase 1, ₦150m"],
        ["asked about", "3-bed duplexes"],
        ["missing", "none"],
      ],
    },
    {
      scene: "canvas",
      flow: "first",
      node: "advance",
      via: ["parse", "send", "log"],
      duration: 5200,
      caption:
        "It's sent from Gmail, the thread is saved, and HubSpot marks her In Sequence.",
      output: [
        ["sent", "Mon 2 Nov, 9:02"],
        ["thread", "saved for follow-ups"],
        ["stage", "In Sequence"],
      ],
    },
    {
      scene: "inbox",
      mode: "thread",
      show: 1,
      duration: 4800,
      caption: "It lands in her inbox, reading like the agent wrote it.",
    },
    {
      scene: "inbox",
      mode: "thread",
      show: 2,
      duration: 4800,
      caption:
        "No reply after three days? A follow-up goes out in the same thread, not as a new email.",
    },
    {
      scene: "inbox",
      mode: "thread",
      show: 3,
      duration: 5000,
      caption:
        "On day seven she replies at 8:58, two minutes before the next follow-up was due.",
      say: "On day seven she replies at eight fifty-eight, two minutes before the next follow-up was due.",
    },
    {
      scene: "canvas",
      flow: "reply",
      node: "task",
      via: ["watch", "confirm", "match", "never", "mark", "stage"],
      duration: 5600,
      caption:
        "A second workflow spots her reply and matches it to her thread.",
      output: [
        ["from", "Amaka Eze, 8:58"],
        ["thread", "Your Lekki duplex search"],
        ["first reply?", "yes"],
        ["stage", "Responded"],
      ],
    },
    {
      scene: "canvas",
      flow: "followUp",
      node: "active",
      via: ["due", "rows", "filter", "wait", "recheck"],
      duration: 6000,
      caption:
        "Seconds before sending, her status is checked again. The follow-up is held back, so she's never chased after replying.",
      output: [
        ["follow-up 2", "due Mon 9:00"],
        ["status now", "Responded at 8:58"],
        ["still active?", "false: nothing sent"],
      ],
    },
    {
      scene: "crm",
      mode: "responded",
      duration: 6000,
      caption:
        "HubSpot moves her to Responded, and the agent gets a task to call her back.",
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "A personal first email, timed follow-ups, and a clean handoff the moment she replies.",
    },
  ],
};
