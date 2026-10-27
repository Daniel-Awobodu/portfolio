import type { ChatMessage, Demo } from "@/lib/demos/types";

/*
 * The dental chat assistant, as it really runs (see content/automation/
 * dental-chatbot.mdx and its screenshots). The opening lines follow the real
 * chat. The workflow is shown as its plain steps, in the order the write-up
 * gives them, including the recheck that caught a taken slot in testing.
 * Every name, number and time here is sample data.
 */

const opening: ChatMessage[] = [
  {
    from: "them",
    time: "",
    text: "Welcome to STACKEDHQ Dental. What can we help you with today?",
  },
  { from: "me", time: "", text: "I want to whiten my teeth" },
  {
    from: "them",
    time: "",
    text: "Teeth whitening is a great way to boost your smile. Are you an existing patient with us or new to STACKEDHQ Dental?",
  },
];

const offer: ChatMessage = {
  from: "them",
  time: "",
  text: "I have Thursday 5 November at 9am, 10am or 11am. Which works best for you?",
};

export const dentalChatbot: Demo = {
  slug: "dental-chatbot",
  journey: "from a website visitor’s first message to a booked appointment",
  sceneLabels: {
    chat: "Visitor’s phone · website chat",
    steps: "Behind the chat · n8n",
    calendar: "Practice calendar",
    sheet: "Chat log · Google Sheets",
    end: "Done",
  },
  chat: {
    app: "web",
    contact: "Hi there! 👋",
    status: "Start a chat. We're here to help you 24/7.",
    initials: "SD",
  },
  steps: {
    main: {
      title: "Behind the chat · n8n",
      items: [
        { title: "Emergency symptoms checked first", kind: "if" },
        { title: "AI reads the conversation", kind: "ai" },
        { title: "Route: book, nurture or emergency", kind: "switch" },
        { title: "Open slots read from the live calendar", kind: "calendar" },
        { title: "Chosen slot rechecked, then booked", kind: "calendar" },
        { title: "Logged for the team", kind: "sheets" },
      ],
    },
  },
  calendar: {
    title: "Practice · Google Calendar",
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
    hours: [8, 14],
    calendars: [{ name: "Practice", color: "#039be5", on: true }],
    events: [
      { day: 1, start: 9, end: 10, title: "Check-up", color: "#039be5" },
      { day: 2, start: 11, end: 12, title: "Filling", color: "#039be5" },
      { day: 4, start: 8, end: 9, title: "Cleaning", color: "#039be5" },
      { day: 4, start: 12, end: 13, title: "Check-up", color: "#039be5" },
      { day: 5, start: 10, end: 11, title: "Crown fitting", color: "#039be5" },
    ],
    taken: {
      day: 4,
      start: 10,
      end: 11,
      title: "Walk-in · booked by staff",
      color: "#616161",
    },
    booked: {
      day: 4,
      start: 11,
      end: 12,
      title: "New Patient Consultation",
      color: "#039be5",
      when: "Thursday, November 5 · 11:00am - 12:00pm",
      details: [
        "Booked via website chat",
        "Ada Okafor",
        "0803 ••• 4821",
        "Interest: teeth whitening",
      ],
    },
  },
  sheet: {
    title: "Chat log",
    columns: ["Date", "Name", "Service", "Route", "Notes"],
    rows: [
      ["3 Nov", "Bayo", "Braces", "nurture", "Wants prices first"],
      ["4 Nov", "Chidi", "Check-up", "booked", "Mon 9 Nov, 9am"],
    ],
    newRow: [
      "5 Nov",
      "Kemi",
      "Toothache",
      "emergency",
      "Swelling, safety message sent",
    ],
    wideColumns: [0, 1, 2, 3, 4],
    narrowColumns: [1, 3, 4],
  },
  end: {
    headline: "From website visitor to booked patient.",
    points: [
      { value: "24/7", label: "booking from the chat, into the live calendar" },
      { value: "0", label: "staff steps from “hi” to a booked slot" },
    ],
  },
  beats: [
    {
      scene: "chat",
      duration: 6200,
      caption:
        "A visitor opens the website chat. The assistant answers naturally, then asks the next question.",
      messages: [
        { ...opening[0], at: 0.04 },
        { ...opening[1], at: 0.24 },
        { ...opening[2], at: 0.48 },
      ],
    },
    {
      scene: "chat",
      duration: 5000,
      caption:
        "It qualifies them in conversation, not with a form: new or existing, which service, and when.",
      messages: [
        ...opening.slice(1),
        {
          from: "me",
          at: 0.08,
          time: "",
          text: "I'm new. Thursday morning would be good",
        },
      ],
    },
    {
      scene: "steps",
      step: 2,
      duration: 5200,
      caption:
        "Behind the chat, emergencies are checked first. Then the AI picks the route: book, nurture or emergency.",
      output: [
        ["emergency", "no"],
        ["route", "book"],
        ["service", "teeth whitening"],
      ],
    },
    {
      scene: "steps",
      step: 3,
      duration: 4400,
      caption:
        "The times it offers come from the live calendar, never from the AI.",
      output: [["Thu 5 Nov", "9am, 10am, 11am open"]],
    },
    {
      scene: "chat",
      duration: 5000,
      caption: "It offers the real open times. The visitor picks 10am.",
      messages: [
        opening[2],
        {
          from: "me",
          time: "",
          text: "I'm new. Thursday morning would be good",
        },
        { ...offer, at: 0.08 },
        { from: "me", at: 0.55, time: "", text: "10am please" },
      ],
    },
    {
      scene: "calendar",
      mode: "taken",
      duration: 4400,
      caption:
        "In that same moment, a staff member books 10am for someone else.",
    },
    {
      scene: "steps",
      step: 4,
      duration: 4800,
      caption:
        "Right before booking, the slot is checked again. The clash is caught, so nobody is double-booked.",
      output: [
        ["10am Thu", "just taken"],
        ["next step", "offer the open times"],
      ],
    },
    {
      scene: "chat",
      duration: 6200,
      caption:
        "The visitor is offered the times still free, and 11am is booked.",
      messages: [
        offer,
        { from: "me", time: "", text: "10am please" },
        {
          from: "them",
          at: 0.06,
          time: "",
          text: "Sorry, 10am was just taken. I can still do 9am or 11am on Thursday.",
        },
        { from: "me", at: 0.36, time: "", text: "11am then" },
        {
          from: "them",
          at: 0.6,
          time: "",
          text: "You're booked for Thursday 5 November at 11am. See you then!",
        },
      ],
    },
    {
      scene: "calendar",
      mode: "booked",
      duration: 5000,
      caption:
        "It goes straight into the practice calendar, with the patient's details and what they came for.",
    },
    {
      scene: "chat",
      duration: 5600,
      caption:
        "Urgent symptoms skip booking entirely. The visitor gets a safety message straight away.",
      messages: [
        {
          from: "them",
          time: "",
          text: "Welcome to STACKEDHQ Dental. What can we help you with today?",
        },
        {
          from: "me",
          at: 0.06,
          time: "",
          text: "My tooth is badly swollen and really painful",
        },
        {
          from: "them",
          at: 0.34,
          time: "",
          text: "That sounds urgent. Please call the clinic now so a dentist can see you today. If the swelling spreads or you find it hard to breathe, go to the nearest emergency department.",
        },
      ],
    },
    {
      scene: "sheet",
      duration: 4800,
      caption:
        "Emergencies and leads not ready to book are logged, so the team can follow up.",
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "Triage, live booking and follow-up, with no staff needed from the first hello.",
    },
  ],
};
