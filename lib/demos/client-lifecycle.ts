import type { Demo } from "@/lib/demos/types";

/*
 * The client lifecycle system, as it really runs (see content/automation/
 * client-lifecycle.mdx and its screenshots). The three n8n workflows use the
 * node names, branches and layout from the canvas screenshot. The run shows
 * what the write-up tested: a lead's messy phone number cleaned before the
 * welcome SMS, Termii's reply read rather than assumed, an incomplete form
 * logged instead of breaking, HubSpot retried when briefly down, and the
 * Monday report. Every name, number and amount here is sample data.
 */

export const clientLifecycle: Demo = {
  slug: "client-lifecycle",
  journey:
    "from a form fill to a welcome text, a paid plan and the Monday report",
  sceneLabels: {
    webform: "Lead’s browser · OpsPilot website",
    canvas: "Lead intake · n8n",
    chat: "Lead’s phone",
    slack: "Sales team · Slack",
    crm: "HubSpot",
    inbox: "Ops manager’s inbox · Gmail",
    end: "Done",
  },
  outputUnder: true,
  webform: {
    site: "Book a demo · OpsPilot",
    brand: ["OpsPilot", ""],
    kicker: "Get started",
    heading: "Book a demo",
    intro: "Tell us about your team and we'll be in touch today.",
    fields: [
      ["Name", "Chika Obi"],
      ["Email", "chika@•••••.com"],
      ["Phone", "0803-123 4567"],
      ["Found us via", "Facebook"],
    ],
    request: ["What do you need?", "We'd like a demo for our ops team of 12."],
    button: "Book my demo",
    cta: "Book a demo",
    thanks: {
      title: "Thanks, Chika!",
      body: "We've got your request. Look out for a text from us.",
    },
  },
  threads: {
    sms: { app: "sms", contact: "OpsPilot", initials: "OP" },
  },
  slack: {
    workspace: "OpsPilot",
    channel: "new-leads",
    channels: ["general", "new-leads", "payments"],
    bot: "Agent",
    approvedBy: "",
    messages: [
      {
        time: "11:01 AM",
        title: "🔥 New Lead: Chika Obi",
        meta: [
          ["", "📧 chika@•••••.com"],
          ["", "📞 +234 803 ••• 4567"],
          ["", "🏷️ Source: facebook"],
          ["", "SMS status: YES"],
          ["", "🔗 HubSpot Contact Created ✅ 7667509•••"],
        ],
        items: [],
        footer: "Automated with this n8n workflow",
      },
    ],
  },
  crm: {
    contacts: [
      { name: "Tunde Bello", initials: "TB", stage: "New" },
      { name: "Grace Eze", initials: "GE", stage: "New" },
    ],
    lead: {
      name: "Chika Obi",
      initials: "CO",
      email: "chika@•••••.com",
      phone: "+234 803 ••• 4567",
    },
    stages: { lead: "New", sequence: "New", responded: "New" },
    task: { title: "", stage: "" },
    stageLabel: "Lead status",
  },
  workflows: {
    leads: {
      label: "Lead intake · n8n",
      nodes: [
        {
          id: "webhook",
          label: "Webhook",
          sub: "POST",
          kind: "webhook",
          x: 0,
          y: 200,
        },
        { id: "if1", label: "If1", kind: "if", x: 170, y: 200 },
        {
          id: "setPhoneNo",
          label: "set phone no",
          sub: "manual",
          kind: "edit",
          x: 340,
          y: 110,
        },
        {
          id: "failedLogs",
          label: "failed logs",
          sub: "append: sheet",
          kind: "sheets",
          x: 340,
          y: 300,
        },
        {
          id: "createOrUpdateAContact1",
          label: "Create or update a contact1",
          sub: "upsert: contact",
          kind: "hubspot",
          x: 510,
          y: 110,
        },
        {
          id: "sendSms",
          label: "Send SMS",
          sub: "POST: Termii",
          kind: "http",
          x: 680,
          y: 110,
        },
        {
          id: "newLeadNotifs",
          label: "new-lead notifs",
          sub: "post: message",
          kind: "slack",
          x: 850,
          y: 110,
        },
        {
          id: "appendRowInSheet1",
          label: "Append row in sheet1",
          sub: "append: sheet",
          kind: "sheets",
          x: 1020,
          y: 110,
        },
      ],
      edges: [
        { from: "webhook", to: "if1" },
        { from: "if1", to: "setPhoneNo", label: "true" },
        { from: "if1", to: "failedLogs", label: "false" },
        { from: "setPhoneNo", to: "createOrUpdateAContact1" },
        { from: "createOrUpdateAContact1", to: "sendSms" },
        { from: "sendSms", to: "newLeadNotifs" },
        { from: "newLeadNotifs", to: "appendRowInSheet1" },
      ],
    },
    payments: {
      label: "Payment sync · n8n",
      nodes: [
        {
          id: "stripeTrigger",
          label: "Stripe Trigger",
          kind: "webhook",
          x: 0,
          y: 200,
        },
        {
          id: "searchContacts",
          label: "Search contacts",
          sub: "search: contact",
          kind: "hubspot",
          x: 170,
          y: 200,
        },
        {
          id: "appendRowInSheet",
          label: "Append row in sheet",
          sub: "append: sheet",
          kind: "sheets",
          x: 170,
          y: 340,
        },
        {
          id: "ifContactExists",
          label: "If Contact exists",
          kind: "if",
          x: 340,
          y: 200,
        },
        {
          id: "createOrUpdateAContact",
          label: "Create or update a contact",
          sub: "upsert: contact",
          kind: "hubspot",
          x: 510,
          y: 110,
        },
        {
          id: "sendAMessage",
          label: "Send a message",
          sub: "send: message",
          kind: "gmail",
          x: 510,
          y: 290,
        },
        {
          id: "paymentLog",
          label: "Payment Log",
          sub: "append: sheet",
          kind: "sheets",
          x: 680,
          y: 200,
        },
        {
          id: "sendAMessage1",
          label: "Send a message1",
          sub: "send: message",
          kind: "gmail",
          x: 850,
          y: 200,
        },
      ],
      edges: [
        { from: "stripeTrigger", to: "searchContacts", label: "success" },
        { from: "stripeTrigger", to: "appendRowInSheet", label: "error" },
        { from: "searchContacts", to: "ifContactExists" },
        {
          from: "ifContactExists",
          to: "createOrUpdateAContact",
          label: "true",
        },
        { from: "ifContactExists", to: "sendAMessage", label: "false" },
        { from: "createOrUpdateAContact", to: "paymentLog" },
        { from: "sendAMessage", to: "paymentLog" },
        { from: "paymentLog", to: "sendAMessage1", label: "error" },
      ],
    },
    report: {
      label: "Weekly report · n8n",
      nodes: [
        {
          id: "scheduleTrigger",
          label: "Schedule Trigger",
          kind: "schedule",
          x: 0,
          y: 200,
        },
        {
          id: "getData",
          label: "get_data",
          sub: "read: sheet",
          kind: "sheets",
          x: 170,
          y: 200,
        },
        { id: "if", label: "If", kind: "if", x: 340, y: 200 },
        {
          id: "sendAMessage4",
          label: "Send a message4",
          sub: "post: message",
          kind: "slack",
          x: 510,
          y: 110,
        },
        {
          id: "sendAMessage5",
          label: "Send a message5",
          sub: "send: message",
          kind: "gmail",
          x: 680,
          y: 110,
        },
        { id: "filter", label: "Filter", kind: "filter", x: 510, y: 290 },
        {
          id: "codeInJavaScript",
          label: "Code in JavaScript",
          kind: "code",
          x: 680,
          y: 290,
        },
        {
          id: "sendAMessage2",
          label: "Send a message2",
          sub: "send: message",
          kind: "gmail",
          x: 850,
          y: 290,
        },
        {
          id: "sendAMessage3",
          label: "Send a message3",
          sub: "post: message",
          kind: "slack",
          x: 1020,
          y: 290,
        },
      ],
      edges: [
        { from: "scheduleTrigger", to: "getData" },
        { from: "getData", to: "if" },
        { from: "if", to: "sendAMessage4", label: "true" },
        { from: "sendAMessage4", to: "sendAMessage5", label: "error" },
        { from: "if", to: "filter", label: "false" },
        { from: "filter", to: "codeInJavaScript" },
        { from: "codeInJavaScript", to: "sendAMessage2" },
        { from: "sendAMessage2", to: "sendAMessage3" },
      ],
    },
  },
  inbox: {
    count: "1",
    emails: [],
    open: {
      from: "OpsPilot Reports",
      subject: "Weekly report · last 7 days",
      time: "Mon 8:30 AM",
      body: [
        ["Revenue", "$1,240.00"],
        ["Payments", "18"],
        ["Starter plan", "11 payments"],
        ["Growth plan", "7 payments"],
        ["Average payment", "$68.89"],
      ],
    },
  },
  end: {
    headline: "Every lead, payment and Monday report, handled.",
    points: [
      {
        value: "<3 sec",
        label: "from a form fill to a CRM record, SMS and team alert",
      },
      {
        value: "3",
        label: "connected workflows: leads, payments, weekly report",
      },
    ],
  },
  beats: [
    {
      scene: "webform",
      duration: 6000,
      caption:
        "A lead books a demo on the website, typing her phone number with a dash and a space.",
    },
    {
      scene: "canvas",
      flow: "leads",
      node: "setPhoneNo",
      via: ["webhook", "if1"],
      duration: 5600,
      caption:
        "Her name, email and phone are checked, and the number is cleaned into international format before any text goes out.",
      output: [
        ["required", "name, email, phone: all there"],
        ["typed", "0803-123 4567"],
        ["cleaned", "+2348031234567"],
      ],
    },
    {
      scene: "canvas",
      flow: "leads",
      node: "sendSms",
      via: ["createOrUpdateAContact1"],
      duration: 5600,
      caption:
        "She's added to HubSpot, and a welcome text goes out through Termii. Whether it sent is read from Termii's reply, not assumed.",
      output: [
        ["HubSpot", "contact created, status New"],
        ["Termii reply", "message accepted"],
        ["SMS sent?", "Yes"],
      ],
    },
    {
      scene: "chat",
      thread: "sms",
      duration: 4800,
      caption:
        "Less than 3 seconds after she pressed the button, the text is on her phone.",
      messages: [
        {
          from: "them",
          at: 0.12,
          time: "11:01",
          text: "Hello Chika, your request has been received. A member of the OpsPilot team will be in touch today to set up your demo.",
        },
      ],
    },
    {
      scene: "slack",
      message: 0,
      duration: 5000,
      caption:
        "The sales team sees her in Slack, with the SMS confirmed and her HubSpot contact already made.",
    },
    {
      scene: "crm",
      mode: "lead",
      duration: 4400,
      caption:
        "In HubSpot, she's a new contact with lead status New. Nobody typed a thing.",
    },
    {
      scene: "canvas",
      flow: "leads",
      run: 1,
      node: "failedLogs",
      via: ["webhook", "if1"],
      duration: 5200,
      caption:
        "A form that arrives without a phone number goes to a Failed Leads sheet, so nothing breaks and nothing is lost.",
      output: [
        ["phone", "missing"],
        ["saved to", "Failed Leads sheet"],
      ],
    },
    {
      scene: "canvas",
      flow: "payments",
      node: "searchContacts",
      via: ["stripeTrigger"],
      duration: 5600,
      caption:
        "When she pays through Stripe, her HubSpot contact is looked up. If HubSpot is briefly down, it tries again, up to 3 times.",
      output: [
        ["Stripe", "checkout completed, $30.00"],
        ["try 1", "HubSpot busy: wait 5 s"],
        ["try 2", "found Chika Obi"],
      ],
    },
    {
      scene: "canvas",
      flow: "payments",
      node: "paymentLog",
      via: ["ifContactExists", "createOrUpdateAContact"],
      duration: 5400,
      caption:
        "Her plan and last payment date are updated, and the payment is logged. A payer missing from HubSpot would email the team instead.",
      output: [
        ["HubSpot", "plan and last payment updated"],
        ["Payment Log", "row added"],
      ],
    },
    {
      scene: "canvas",
      flow: "report",
      node: "sendAMessage3",
      via: [
        "scheduleTrigger",
        "getData",
        "if",
        "filter",
        "codeInJavaScript",
        "sendAMessage2",
      ],
      duration: 5600,
      caption:
        "Every Monday at 8:30am, the payment log becomes a weekly report, sent by email and Slack.",
      output: [
        ["period", "last 7 days"],
        ["revenue", "$1,240.00 from 18 payments"],
        ["sent", "email and Slack"],
      ],
    },
    {
      scene: "inbox",
      mode: "open",
      duration: 4800,
      caption: "The ops manager's 45-minute Monday job now arrives on its own.",
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "Three workflows that feed each other: leads, payments and the Monday report.",
    },
  ],
};
