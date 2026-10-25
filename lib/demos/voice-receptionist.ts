import type { CallLine, Demo } from "@/lib/demos/types";

/*
 * The phone receptionist, as it really runs (see content/automation/
 * voice-receptionist.mdx and its workflow screenshot). The node names and
 * branches match the n8n canvas, which the voice agent calls twice: once to
 * check availability, once to book. The run shown is the one tested in the
 * write-up: the chosen slot is taken mid-call, the recheck catches it, and the
 * caller picks another time. Every name, number and time here is sample data.
 */

const greeting: CallLine[] = [
  {
    who: "agent",
    at: 0.03,
    text: "Hello, thank you for calling STACKEDHQ Dentals. How can I help you today?",
  },
  {
    who: "caller",
    at: 0.5,
    text: "Hi, I’d like to book a cleaning at your Abuja branch, Monday afternoon if possible.",
  },
];

const said = (lines: CallLine[]) => lines.map((line) => ({ ...line, at: -1 }));

const offer: CallLine[] = [
  {
    who: "agent",
    at: 0.03,
    text: "At our Abuja branch on Monday, I have 3pm, 4pm or 5pm. Which works for you?",
  },
  {
    who: "caller",
    at: 0.36,
    text: "5pm, please. I’m Ada Okafor, on 0803 ••• 4821.",
  },
  {
    who: "agent",
    at: 0.66,
    text: "That’s Ada Okafor, 0803 ••• 4821. Booking 5pm now.",
  },
];

export const voiceReceptionist: Demo = {
  slug: "voice-receptionist",
  journey: "from the patient’s call to the booking and the confirmation text",
  sceneLabels: {
    call: "Caller’s phone",
    canvas: "The automation · n8n",
    calendar: "Abuja branch calendar",
    chat: "Caller’s phone",
    end: "Done",
  },
  threads: {
    sms: { app: "sms", contact: "STACKEDHQ", initials: "S" },
  },
  call: {
    name: "STACKEDHQ Dentals",
    initials: "SD",
    sub: "Calling…",
    labels: { caller: "Caller", agent: "Receptionist (AI)" },
  },
  workflow: {
    nodes: [
      {
        id: "webhook",
        label: "Webhook",
        sub: "POST",
        kind: "webhook",
        x: 0,
        y: 200,
      },
      {
        id: "code0",
        label: "Code in JavaScript",
        kind: "code",
        x: 170,
        y: 200,
      },
      {
        id: "switch",
        label: "Switch",
        sub: "mode: Rules",
        kind: "switch",
        x: 340,
        y: 200,
      },
      {
        id: "calId",
        label: "Get calendar ID",
        sub: "read: sheet",
        kind: "sheets",
        x: 510,
        y: 50,
      },
      {
        id: "events",
        label: "Get many events",
        sub: "getAll: event",
        kind: "calendar",
        x: 680,
        y: 50,
      },
      {
        id: "code1",
        label: "Code in JavaScript1",
        kind: "code",
        x: 850,
        y: 50,
      },
      {
        id: "code2",
        label: "Code in JavaScript2",
        kind: "code",
        x: 1020,
        y: 50,
      },
      {
        id: "respond",
        label: "Respond to Webhook",
        kind: "respond",
        x: 1190,
        y: 50,
      },
      {
        id: "calId1",
        label: "Get calendar ID1",
        sub: "read: sheet",
        kind: "sheets",
        x: 510,
        y: 340,
      },
      {
        id: "avail",
        label: "Get availability in a calendar",
        sub: "availability: calendar",
        kind: "calendar",
        x: 680,
        y: 340,
      },
      { id: "ifFree", label: "If", kind: "if", x: 850, y: 340 },
      {
        id: "create",
        label: "Create an event",
        sub: "create: event",
        kind: "calendar",
        x: 1020,
        y: 200,
      },
      {
        id: "code5",
        label: "Code in JavaScript5",
        kind: "code",
        x: 1190,
        y: 200,
      },
      {
        id: "respond1",
        label: "Respond to Webhook1",
        kind: "respond",
        x: 1360,
        y: 200,
      },
      { id: "wait", label: "Wait", kind: "wait", x: 1530, y: 200 },
      {
        id: "sms",
        label: "Send SMS2",
        sub: "POST: Termii",
        kind: "http",
        x: 1700,
        y: 200,
      },
      {
        id: "events1",
        label: "Get many events1",
        sub: "getAll: event",
        kind: "calendar",
        x: 1020,
        y: 480,
      },
      {
        id: "code3",
        label: "Code in JavaScript3",
        kind: "code",
        x: 1190,
        y: 480,
      },
      {
        id: "code4",
        label: "Code in JavaScript4",
        kind: "code",
        x: 1360,
        y: 480,
      },
      {
        id: "respond2",
        label: "Respond to Webhook2",
        kind: "respond",
        x: 1530,
        y: 480,
      },
    ],
    edges: [
      { from: "webhook", to: "code0" },
      { from: "code0", to: "switch" },
      { from: "switch", to: "calId", label: "Availability" },
      { from: "switch", to: "calId1", label: "Appointment" },
      { from: "calId", to: "events" },
      { from: "events", to: "code1" },
      { from: "code1", to: "code2" },
      { from: "code2", to: "respond" },
      { from: "calId1", to: "avail" },
      { from: "avail", to: "ifFree" },
      { from: "ifFree", to: "create", label: "true" },
      { from: "ifFree", to: "events1", label: "false" },
      { from: "create", to: "code5" },
      { from: "code5", to: "respond1" },
      { from: "respond1", to: "wait" },
      { from: "wait", to: "sms" },
      { from: "events1", to: "code3" },
      { from: "code3", to: "code4" },
      { from: "code4", to: "respond2" },
    ],
  },
  calendar: {
    title: "Abuja · Google Calendar",
    month: "November 2026",
    days: [
      ["SUN", 1],
      ["MON", 2],
      ["TUE", 3],
      ["WED", 4],
      ["THU", 5],
      ["FRI", 6],
      ["SAT", 7],
    ],
    hours: [13, 19],
    calendars: [
      { name: "Abuja", color: "#e8a200", on: true },
      { name: "Lagos", color: "#8e24aa", on: false },
      { name: "Port Harcourt", color: "#33b679", on: false },
      { name: "Delta", color: "#f4511e", on: false },
    ],
    events: [
      {
        day: 1,
        start: 14,
        end: 15,
        title: "Tunde Bello - filling",
        color: "#e8a200",
      },
      {
        day: 2,
        start: 15,
        end: 16,
        title: "Ngozi Eze - check-up",
        color: "#e8a200",
      },
      {
        day: 4,
        start: 14,
        end: 15,
        title: "Musa Ali - consultation",
        color: "#e8a200",
      },
    ],
    taken: {
      day: 1,
      start: 17,
      end: 18,
      title: "Emeka Uche - extraction",
      color: "#e8a200",
    },
    booked: {
      day: 1,
      start: 16,
      end: 17,
      title: "Ada Okafor - cleaning",
      color: "#e8a200",
      when: "Monday, November 2 · 4:00 - 5:00pm",
      details: [
        "Ada Okafor",
        "0803 ••• 4821",
        "Appointment booked for cleaning",
        "Abuja branch",
        "Created by: Agent",
      ],
    },
  },
  end: {
    headline: "Every call answered, and booked in the right diary.",
    points: [
      { value: "24/7", label: "answering, including busy hours" },
      { value: "10", label: "branches, served by one phone line" },
    ],
  },
  beats: [
    {
      scene: "call",
      mode: "ringing",
      duration: 2600,
      caption: "Ada calls the clinic to book a cleaning.",
    },
    {
      scene: "call",
      mode: "live",
      clock: 0,
      duration: 8000,
      caption:
        "The AI receptionist answers straight away, and asks what she needs.",
      lines: greeting,
    },
    {
      scene: "canvas",
      run: 0,
      node: "switch",
      via: ["webhook", "code0"],
      duration: 3800,
      caption:
        "The agent asks the workflow for open times. A switch sends it down the availability path.",
      output: [
        ["action", "check availability"],
        ["branch", "Abuja"],
        ["when", "Monday afternoon"],
      ],
    },
    {
      scene: "canvas",
      run: 0,
      node: "events",
      via: ["calId"],
      duration: 4000,
      caption:
        "A sheet points it to the Abuja branch’s own calendar, and it reads that day’s bookings.",
      output: [
        ["calendar", "Abuja branch"],
        ["booked", "2pm"],
      ],
    },
    {
      scene: "canvas",
      run: 0,
      node: "respond",
      via: ["code1", "code2"],
      duration: 4200,
      caption:
        "It finds the free one-hour slots, never the lunch hour, and sends back the first three.",
      output: [["open", "3pm, 4pm, 5pm"]],
    },
    {
      scene: "call",
      mode: "live",
      clock: 11,
      duration: 8000,
      caption:
        "Ada picks 5pm, and the agent reads her name and number back to check them.",
      lines: [...said(greeting), ...offer],
    },
    {
      scene: "calendar",
      mode: "taken",
      duration: 4000,
      caption:
        "Meanwhile, someone at the clinic books 5pm for another patient.",
    },
    {
      scene: "canvas",
      run: 1,
      node: "ifFree",
      via: ["webhook", "code0", "switch", "calId1", "avail"],
      duration: 4600,
      caption:
        "Before booking, the workflow checks 5pm again. It has just been taken.",
      output: [
        ["slot", "Monday 5pm"],
        ["still free", "no"],
      ],
    },
    {
      scene: "canvas",
      run: 1,
      node: "respond2",
      via: ["events1", "code3", "code4"],
      duration: 4000,
      caption: "So it finds three new times and sends those back instead.",
      output: [["new times", "3pm, 4pm, Tue 2pm"]],
    },
    {
      scene: "call",
      mode: "live",
      clock: 23,
      duration: 6000,
      caption: "The agent tells Ada 5pm has gone and offers the new times.",
      lines: [
        ...said(offer),
        {
          who: "agent",
          at: 0.03,
          text: "Sorry, 5pm was just taken. I can offer 3pm, 4pm, or Tuesday at 2pm.",
        },
        { who: "caller", at: 0.62, text: "4pm, then." },
      ],
    },
    {
      scene: "canvas",
      run: 2,
      node: "create",
      via: ["webhook", "code0", "switch", "calId1", "avail", "ifFree"],
      duration: 5000,
      caption:
        "4pm is still free, so the booking goes into the Abuja calendar.",
      output: [
        ["slot", "Monday 4pm"],
        ["calendar", "Abuja branch"],
        ["patient", "Ada Okafor"],
      ],
    },
    {
      scene: "canvas",
      run: 2,
      node: "sms",
      via: ["code5", "respond1", "wait"],
      duration: 4600,
      caption:
        "The agent confirms on the call. A short while later, a text goes out through Termii.",
      output: [
        ["to", "0803 ••• 4821"],
        ["sent", "booking confirmation"],
      ],
    },
    {
      scene: "calendar",
      mode: "booked",
      duration: 5200,
      caption:
        "The booking sits in the Abuja calendar, with her name, number and the reason for the visit.",
    },
    {
      scene: "chat",
      thread: "sms",
      duration: 4400,
      caption: "Ada gets a text with the branch, date and time.",
      messages: [
        {
          from: "them",
          at: 0.15,
          time: "10:42",
          text: "Hi Ada Okafor, your appointment at STACKEDHQ Dentals, Abuja, has been successfully booked for November 2, 2026 at 4:00 PM",
        },
      ],
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "Every call answered, every booking in the right branch’s diary.",
    },
  ],
};
