import type { Demo } from "@/lib/demos/types";

/*
 * The brokerage follow-ups, as they really run (see content/automation/
 * crm-follow-ups.mdx). The workflow is shown as its plain steps. The run
 * shown is the one tested in the write-up: a reply that lands just before a
 * follow-up is due stops it, and the lead is handed to an agent. Every name,
 * email and amount here is sample data.
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
    steps: "The follow-up workflows · n8n",
    inbox: "Lead’s inbox",
    end: "Done",
  },
  crm: {
    app: "HubSpot",
    name: "Amaka Eze",
    initials: "AE",
    fields: [
      ["Email", "amaka•••@gmail.com"],
      ["Area", "Lekki Phase 1"],
      ["Budget", "₦150m"],
      ["Asked about", "3-bed duplexes"],
    ],
    status: { label: "Stage", from: "Lead", to: "Responded" },
    activity: [
      { text: "Follow-up sent · day 3", time: "Thu 9:00" },
      { text: "First email sent", time: "Mon 9:02" },
    ],
    reply: { text: "Amaka replied", time: "Mon 8:58" },
    task: "Follow up with Amaka · assigned to Tolu",
  },
  steps: {
    main: {
      title: "The follow-up workflows · n8n",
      items: [
        { title: "New lead in HubSpot", kind: "trigger" },
        { title: "AI writes a personal first email", kind: "ai" },
        { title: "Sent through Gmail, thread saved", kind: "gmail" },
        { title: "Follow-ups on day 3 and day 7, same thread", kind: "wait" },
        { title: "Status rechecked right before each send", kind: "if" },
        {
          title: "Reply? Stop, mark Responded, task for agent",
          kind: "sheets",
        },
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
      duration: 4600,
      caption:
        "A new lead lands in HubSpot, with her area, budget and what she asked about.",
    },
    {
      scene: "steps",
      step: 1,
      duration: 5200,
      caption:
        "AI writes a first email around those details. If one is missing, it simply leaves it out.",
      output: [
        ["mentions", "Lekki Phase 1, ₦150m"],
        ["asked about", "3-bed duplexes"],
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
    },
    {
      scene: "steps",
      step: 4,
      duration: 5600,
      caption:
        "Seconds before sending, her status is checked again. The follow-up is held back, so she's never chased after replying.",
      output: [
        ["follow-up 2", "due 9:00"],
        ["status now", "replied 8:58"],
        ["action", "held back"],
      ],
    },
    {
      scene: "crm",
      mode: "responded",
      duration: 5600,
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
