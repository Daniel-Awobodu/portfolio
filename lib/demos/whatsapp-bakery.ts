import type { ChatMessage, Demo } from "@/lib/demos/types";

/*
 * The bakery ordering assistant, as it really runs (see content/automation/
 * whatsapp-bakery.mdx and its screenshots). The order summary follows the
 * real one, prices included; the evening workflow uses the real node names.
 * The main workflow is shown as its plain steps. Every customer name and
 * order number here is sample data.
 */

const order: ChatMessage = {
  from: "me",
  time: "9:12",
  text: "Hi, can I get 3 sourdough for Tuesday, 10 sausage rolls for Thursday and 5 chelsea buns for Saturday? Saturday's under Richard",
};

const summary: ChatMessage = {
  from: "them",
  time: "9:12",
  text: [
    "Here are your 3 orders 🧾",
    "",
    "Order 1 · Tuesday 13 October",
    "3 × Sourdough Loaf · £15.60",
    "",
    "Order 2 · Thursday 15 October",
    "10 × Sausage Roll · £32.00",
    "",
    "Order 3 · Saturday 17 October",
    "5 × Chelsea Bun · £14.00",
    "Note: collect as Richard",
    "",
    "Total: £61.60",
    "Reply YES to confirm all 3, or tell me what to change.",
  ].join("\n"),
};

export const whatsappBakery: Demo = {
  slug: "whatsapp-bakery",
  journey: "from a customer’s WhatsApp message to the bakery’s order book",
  sceneLabels: {
    chat: "Customer’s phone",
    steps: "The ordering workflow · n8n",
    sheet: "Order book · Airtable",
    canvas: "Every evening · n8n",
    inbox: "Staff inbox",
    end: "Done",
  },
  chat: { contact: "Millstone Bakery", status: "online", initials: "MB" },
  steps: {
    main: {
      title: "The ordering workflow · n8n",
      items: [
        { title: "Text or voice note? Voice is transcribed", kind: "switch" },
        { title: "Greetings, menu, YES: plain rules, no AI", kind: "code" },
        { title: "AI reads the order, with menu and calendar", kind: "ai" },
        { title: "Code checks items, prices, days, notice", kind: "code" },
        { title: "Summary sent, waits for YES", kind: "whatsapp" },
        { title: "Confirmed orders saved", kind: "airtable" },
      ],
    },
  },
  sheet: {
    title: "Orders",
    app: "airtable",
    columns: ["Order ID", "Customer", "Pickup", "Items", "Total", "Status"],
    rows: [
      [
        "MB-4K8D2Q",
        "Sarah",
        "Mon 12 Oct",
        "6 × Sausage Roll",
        "£19.20",
        "Confirmed",
      ],
      [
        "MB-4K9F7N",
        "Tom",
        "Tue 13 Oct",
        "4 × Chelsea Bun",
        "£11.20",
        "Confirmed",
      ],
    ],
    newRows: [
      [
        "MB-7Q2KD1",
        "Daniel",
        "Tue 13 Oct",
        "3 × Sourdough Loaf",
        "£15.60",
        "Confirmed",
      ],
      [
        "MB-7Q2KD2",
        "Daniel",
        "Thu 15 Oct",
        "10 × Sausage Roll",
        "£32.00",
        "Confirmed",
      ],
      [
        "MB-7Q2KD3",
        "Richard",
        "Sat 17 Oct",
        "5 × Chelsea Bun",
        "£14.00",
        "Confirmed",
      ],
    ],
    wideColumns: [0, 1, 2, 3, 4, 5],
    narrowColumns: [1, 2, 3],
  },
  workflow: {
    label: "Every evening at 6pm · n8n",
    nodes: [
      {
        id: "sched",
        label: "Every Evening 6pm",
        kind: "schedule",
        x: 0,
        y: 200,
      },
      {
        id: "findExpired",
        label: "Find Expired Pending Orders",
        sub: "search: record",
        kind: "airtable",
        x: 170,
        y: 80,
      },
      {
        id: "markExpired",
        label: "Mark Orders Expired",
        sub: "update: record",
        kind: "airtable",
        x: 340,
        y: 80,
      },
      {
        id: "findStale",
        label: "Find Stale Conversations",
        sub: "search: record",
        kind: "airtable",
        x: 510,
        y: 80,
      },
      {
        id: "resetStale",
        label: "Reset Stale Conversations",
        sub: "update: record",
        kind: "airtable",
        x: 680,
        y: 80,
      },
      {
        id: "loadInfo",
        label: "Load Bakery Info1",
        sub: "search: record",
        kind: "airtable",
        x: 170,
        y: 320,
      },
      {
        id: "findTomorrow",
        label: "Find Orders for Tomorrow",
        sub: "search: record",
        kind: "airtable",
        x: 340,
        y: 320,
      },
      { id: "build", label: "Build Bake List", kind: "code", x: 510, y: 320 },
      {
        id: "email",
        label: "Email Bake List",
        sub: "send: message",
        kind: "gmail",
        x: 680,
        y: 320,
      },
    ],
    edges: [
      { from: "sched", to: "findExpired" },
      { from: "findExpired", to: "markExpired" },
      { from: "markExpired", to: "findStale" },
      { from: "findStale", to: "resetStale" },
      { from: "sched", to: "loadInfo" },
      { from: "loadInfo", to: "findTomorrow" },
      { from: "findTomorrow", to: "build" },
      { from: "build", to: "email" },
    ],
  },
  inbox: {
    count: "3",
    emails: [],
    open: {
      from: "Bakery Bot",
      subject: "Bake list · Thursday 15 October",
      time: "Wed 6:00 PM",
      body: [
        ["Sausage Roll", "22"],
        ["Sourdough Loaf", "8"],
        ["Chelsea Bun", "6"],
        ["Victoria Sponge", "1"],
        ["Pickups", "9 customers"],
        ["First pickup", "8:00 AM · Daniel"],
      ],
    },
  },
  end: {
    headline: "Messy messages in, clean confirmed orders out.",
    points: [
      { value: "3", label: "orders read from one WhatsApp message" },
      { value: "0", label: "AI tokens spent on greetings, menus and YES" },
    ],
  },
  beats: [
    {
      scene: "chat",
      duration: 4800,
      caption:
        "A customer orders the way they'd text a friend: three items, three different days, one message.",
      messages: [{ ...order, at: 0.1 }],
    },
    {
      scene: "steps",
      step: 2,
      duration: 5200,
      caption:
        "The AI reads it against the real menu and the bakery's calendar, and finds three orders.",
      output: [
        ["sourdough", "3 · Tuesday 13 Oct"],
        ["sausage roll", "10 · Thursday 15 Oct"],
        ["chelsea bun", "5 · Saturday 17 Oct"],
      ],
    },
    {
      scene: "steps",
      step: 3,
      duration: 4600,
      caption:
        "Then code checks every detail. Prices come from the menu, never from the AI.",
      output: [
        ["items", "all on the menu"],
        ["prices", "from the menu"],
        ["days", "open, enough notice"],
      ],
    },
    {
      scene: "chat",
      duration: 6000,
      caption:
        "One message becomes three orders, each with its own day and price.",
      messages: [
        order,
        { from: "them", typing: true, at: 0.04, until: 0.2, time: "9:12" },
        { ...summary, at: 0.2 },
      ],
    },
    {
      scene: "chat",
      duration: 5200,
      caption:
        "Nothing is final until the customer replies YES. Then each order gets its own number.",
      messages: [
        summary,
        { from: "me", at: 0.1, time: "9:13", text: "YES" },
        { from: "them", typing: true, at: 0.22, until: 0.42, time: "9:13" },
        {
          from: "them",
          at: 0.42,
          time: "9:13",
          text: "✅ All 3 orders confirmed!\nMB-7Q2KD1 · Tue 13 Oct\nMB-7Q2KD2 · Thu 15 Oct\nMB-7Q2KD3 · Sat 17 Oct",
        },
      ],
    },
    {
      scene: "sheet",
      duration: 5000,
      caption: "All three land in the bakery's order book, clean and priced.",
    },
    {
      scene: "chat",
      duration: 7200,
      caption:
        "Voice notes work too. Ask for bread it doesn't sell, on a day it's closed, and it says so instead of guessing.",
      messages: [
        {
          from: "me",
          at: 0.06,
          time: "11:40",
          voice: "0:06",
          text: "“A sardine loaf and two sourdough for Sunday, please.”",
        },
        { from: "them", typing: true, at: 0.18, until: 0.4, time: "11:40" },
        {
          from: "them",
          at: 0.4,
          time: "11:41",
          text: "Sorry, we don't sell sardine bread, so I've left that off. We're closed on Sundays, so the earliest is Monday 19 October.\n\n2 × Sourdough Loaf · £10.40\nReply YES to confirm.",
        },
      ],
    },
    {
      scene: "chat",
      duration: 4800,
      caption: "No number given? It asks, instead of guessing a quantity.",
      messages: [
        {
          from: "me",
          at: 0.06,
          time: "11:43",
          text: "Can I also get sausage rolls for Friday?",
        },
        { from: "them", typing: true, at: 0.2, until: 0.4, time: "11:43" },
        {
          from: "them",
          at: 0.4,
          time: "11:43",
          text: "How many sausage rolls would you like for Friday 16 October?",
        },
      ],
    },
    {
      scene: "canvas",
      run: 0,
      node: "resetStale",
      via: ["sched", "findExpired", "markExpired", "findStale"],
      duration: 4800,
      caption:
        "At 6pm every evening, orders nobody confirmed within 48 hours are marked Expired.",
      output: [["unconfirmed", "marked Expired"]],
    },
    {
      scene: "canvas",
      run: 1,
      node: "email",
      via: ["sched", "loadInfo", "findTomorrow", "build"],
      duration: 4800,
      caption:
        "Then tomorrow's bake list is built from the confirmed orders and emailed.",
      output: [["to", "bakery staff"]],
    },
    {
      scene: "inbox",
      mode: "open",
      duration: 4800,
      caption:
        "Staff start the day with item totals and every pickup, with nothing retyped.",
    },
    {
      scene: "end",
      duration: 3200,
      caption: "Messy messages in, clean and confirmed orders out.",
    },
  ],
};
