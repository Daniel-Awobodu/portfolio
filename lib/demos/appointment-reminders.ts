import type { Demo } from "@/lib/demos/types";

/*
 * The clinic reminders, as they really run (see content/automation/
 * appointment-reminders.mdx and its workflow screenshot). The node names and
 * branches match the n8n canvas. The run shown is the live test from the
 * write-up: a queued reminder whose appointment is moved mid-flow is skipped
 * and logged, and the new time gets its own reminder. Every name, number and
 * time here is sample data.
 */

export const appointmentReminders: Demo = {
  slug: "appointment-reminders",
  journey:
    "from the clinic calendar to the right reminder on the patient’s phone",
  sceneLabels: {
    chat: "Patient’s phone",
    calendar: "Clinic calendar",
    canvas: "The reminder workflow · n8n",
    sheet: "Reminder log",
    end: "Done",
  },
  threads: {
    sms: { app: "sms", contact: "CLINIC", initials: "C" },
  },
  calendar: {
    title: "Clinic · Google Calendar",
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
    hours: [9, 17],
    calendars: [{ name: "Clinic", color: "#7986cb", on: true }],
    events: [
      {
        day: 1,
        start: 9,
        end: 10,
        title: "Femi A. - check-up",
        color: "#7986cb",
      },
      {
        day: 2,
        start: 11,
        end: 12,
        title: "Joy O. - scaling",
        color: "#7986cb",
      },
      {
        day: 2,
        start: 13,
        end: 14,
        title: "Ali M. - filling",
        color: "#7986cb",
      },
      { day: 3, start: 9, end: 10, title: "Ken U. - review", color: "#7986cb" },
      {
        day: 4,
        start: 14,
        end: 15,
        title: "Rita N. - crown",
        color: "#7986cb",
      },
    ],
    move: {
      from: {
        day: 2,
        start: 10,
        end: 11,
        title: "Ngozi Eze - check-up",
        color: "#e67c73",
      },
      to: {
        day: 2,
        start: 15,
        end: 16,
        title: "Ngozi Eze - check-up",
        color: "#e67c73",
      },
      note: "Ngozi Eze moved: 10am → 3pm",
    },
  },
  workflow: {
    nodes: [
      {
        id: "every15",
        label: "Every 15 Minutes",
        kind: "schedule",
        x: 0,
        y: 200,
      },
      {
        id: "fetch",
        label: "Fetch Appointments (Next 25h)",
        sub: "getAll: event",
        kind: "calendar",
        x: 170,
        y: 200,
      },
      {
        id: "compute",
        label: "Compute due reminders",
        kind: "code",
        x: 340,
        y: 200,
      },
      {
        id: "filter",
        label: "Filter Already-Sent Reminders",
        kind: "table",
        x: 510,
        y: 200,
      },
      {
        id: "delay",
        label: "Safety Delay Before Send",
        kind: "wait",
        x: 680,
        y: 200,
      },
      {
        id: "recheck",
        label: "Recheck Live Calendar",
        sub: "get: event",
        kind: "calendar",
        x: 850,
        y: 200,
      },
      {
        id: "checkRes",
        label: "Check For Reschedule Or Cancellation",
        kind: "code",
        x: 1020,
        y: 200,
      },
      { id: "stillValid", label: "Still Valid?", kind: "if", x: 1190, y: 200 },
      {
        id: "normalize",
        label: "Normalize Phone Number",
        sub: "manual",
        kind: "edit",
        x: 1360,
        y: 90,
      },
      {
        id: "sendSms",
        label: "Send SMS",
        sub: "POST: Termii",
        kind: "http",
        x: 1530,
        y: 90,
      },
      {
        id: "checkSms",
        label: "Check SMS Send Result",
        kind: "code",
        x: 1700,
        y: 90,
      },
      {
        id: "logSent",
        label: "Log Reminder Sent",
        kind: "table",
        x: 1870,
        y: 90,
      },
      {
        id: "logSkip",
        label: "Log Skipped Reminder",
        kind: "table",
        x: 1360,
        y: 320,
      },
    ],
    edges: [
      { from: "every15", to: "fetch" },
      { from: "fetch", to: "compute" },
      { from: "compute", to: "filter" },
      { from: "filter", to: "delay" },
      { from: "delay", to: "recheck" },
      { from: "recheck", to: "checkRes" },
      { from: "checkRes", to: "stillValid" },
      { from: "stillValid", to: "normalize", label: "true" },
      { from: "stillValid", to: "logSkip", label: "false" },
      { from: "normalize", to: "sendSms" },
      { from: "sendSms", to: "checkSms" },
      { from: "checkSms", to: "logSent" },
    ],
  },
  sheet: {
    title: "Reminder log",
    app: "n8n",
    columns: ["Patient", "Appointment", "Reminder", "Result", "Reason"],
    rows: [
      ["Ngozi Eze", "Tue 10:00", "24h", "Sent", "Termii accepted"],
      ["Joy O.", "Tue 11:00", "24h", "Sent", "Termii accepted"],
    ],
    newRow: ["Ngozi Eze", "Tue 10:00", "2h", "Skipped", "Moved to 15:00"],
    wideColumns: [0, 1, 2, 3, 4],
    narrowColumns: [0, 2, 3, 4],
  },
  end: {
    headline: "Reminders that match the calendar when they send.",
    points: [
      { value: "24h + 2h", label: "SMS reminders before every visit" },
      { value: "0", label: "stale reminders sent in testing" },
    ],
  },
  beats: [
    {
      scene: "chat",
      thread: "sms",
      duration: 4600,
      caption:
        "Patients get a text 24 hours before their visit, and another 2 hours before.",
      messages: [
        {
          from: "them",
          at: 0.12,
          time: "Mon 10:00",
          text: "Hi Ngozi, a reminder of your check-up at the clinic tomorrow, Tuesday 3 November, at 10:00 AM.",
        },
      ],
    },
    {
      scene: "calendar",
      mode: "view",
      duration: 4000,
      caption: "Every reminder comes from the clinic's own calendar.",
    },
    {
      scene: "canvas",
      node: "delay",
      via: ["every15", "fetch", "compute", "filter"],
      duration: 5600,
      caption:
        "On Tuesday at 8am, her 2-hour reminder is due. Anything already sent is skipped, then it waits briefly.",
      output: [
        ["due", "Ngozi · 2h before 10am"],
        ["sent before?", "no"],
      ],
    },
    {
      scene: "calendar",
      mode: "moved",
      duration: 4600,
      caption: "In that moment, a receptionist moves Ngozi to 3pm.",
    },
    {
      scene: "canvas",
      node: "logSkip",
      via: ["recheck", "checkRes", "stillValid"],
      duration: 5600,
      caption:
        "Seconds before sending, the live calendar is checked again, and the change is spotted.",
      output: [
        ["planned", "Tue 10:00"],
        ["calendar now", "Tue 15:00"],
        ["result", "moved: skip"],
      ],
    },
    {
      scene: "sheet",
      duration: 4800,
      caption:
        "The 10am reminder never goes out, and the reason is logged. Nothing is skipped silently.",
    },
    {
      scene: "chat",
      thread: "sms",
      duration: 5000,
      caption:
        "A moved appointment counts as a new one, so she gets the right reminder: 3pm, not 10am.",
      messages: [
        {
          from: "them",
          time: "Mon 10:00",
          text: "Hi Ngozi, a reminder of your check-up at the clinic tomorrow, Tuesday 3 November, at 10:00 AM.",
        },
        {
          from: "them",
          at: 0.14,
          time: "Tue 13:00",
          text: "Hi Ngozi, a reminder of your check-up at the clinic today at 3:00 PM.",
        },
      ],
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "Every reminder checked against the calendar, right before it sends.",
    },
  ],
};
