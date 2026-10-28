import type { Demo } from "@/lib/demos/types";

/*
 * The multichannel intake, as it really runs (see content/automation/
 * multichannel-intake.mdx and its screenshots). The canvas is drawn from the
 * workflow's export: real node names, connections and layout. The run follows
 * the real tests: a critical web request that alerts Slack, requests from
 * email and a staff note in the same table, an email follow-up recognised as
 * one, and the same web request sent twice. Every name here is sample data.
 */

const reference = "SHQ-261005-XLL6Q6";

export const multichannelIntake: Demo = {
  slug: "multichannel-intake",
  journey: "from a request on any channel to one sorted table",
  sceneLabels: {
    webform: "Client’s browser · website form",
    canvas: "The intake workflow · n8n",
    slack: "Team alerts · Slack",
    sheet: "Intake table · Airtable",
    end: "Done",
  },
  outputUnder: true,
  workflow: {
    nodes: [
      { id: "webhook", label: "Webhook", kind: "webhook", x: 0, y: 146 },
      {
        id: "routeWebFormSubmission",
        label: "Route Web Form Submission",
        kind: "switch",
        x: 170,
        y: 134,
      },
      {
        id: "respond200ToBot",
        label: "Respond 200 To Bot",
        kind: "respond",
        x: 340,
        y: 0,
      },
      {
        id: "respond400ToInvalidRequest",
        label: "Respond 400 To Invalid Request",
        kind: "respond",
        x: 340,
        y: 146,
      },
      {
        id: "respond200ToValidRequest",
        label: "Respond 200 To Valid Request",
        kind: "respond",
        x: 340,
        y: 291,
      },
      {
        id: "buildCanonicalRequest",
        label: "Build Canonical Request",
        kind: "code",
        x: 510,
        y: 291,
      },
      {
        id: "checkForDuplicateRequest",
        label: "Check For Duplicate Request",
        sub: "search: record",
        kind: "airtable",
        x: 850,
        y: 437,
      },
      {
        id: "routeNewVsDuplicate",
        label: "Route New Vs Duplicate",
        kind: "if",
        x: 1020,
        y: 437,
      },
      {
        id: "classifyAndDraftResponse",
        label: "Classify And Draft Response",
        kind: "ai",
        x: 1360,
        y: 437,
      },
      {
        id: "validateAIClassification",
        label: "Validate AI Classification",
        kind: "code",
        x: 1627,
        y: 364,
      },
      {
        id: "createIntakeRecord",
        label: "Create Intake Record",
        sub: "create: record",
        kind: "airtable",
        x: 1190,
        y: 437,
      },
      {
        id: "flagClassificationFailure",
        label: "Flag Classification Failure",
        sub: "update: record",
        kind: "airtable",
        x: 1627,
        y: 510,
      },
      {
        id: "onFormSubmission",
        label: "On form submission",
        kind: "webhook",
        x: 340,
        y: 437,
      },
      {
        id: "normalizeInternalNote",
        label: "Normalize Internal Note",
        kind: "code",
        x: 510,
        y: 437,
      },
      {
        id: "mergeIntakeRoutes",
        label: "Merge Intake Routes",
        kind: "merge",
        x: 680,
        y: 425,
      },
      {
        id: "watchAdvisoryInbox",
        label: "Watch Advisory Inbox",
        kind: "gmail",
        x: 340,
        y: 583,
      },
      {
        id: "normalizeEmailRequest",
        label: "Normalize Email Request",
        kind: "code",
        x: 510,
        y: 583,
      },
      {
        id: "routeUrgentForAlert",
        label: "Route Urgent For Alert",
        kind: "if",
        x: 1967,
        y: 364,
      },
      {
        id: "enrichIntakeRecord",
        label: "Enrich Intake Record",
        sub: "update: record",
        kind: "airtable",
        x: 1797,
        y: 364,
      },
      {
        id: "postUrgentAlertToSlack",
        label: "Post Urgent Alert To Slack",
        kind: "slack",
        x: 2137,
        y: 364,
      },
      {
        id: "postFailureAlertToSlack",
        label: "Post Failure Alert To Slack",
        kind: "slack",
        x: 1797,
        y: 510,
      },
    ],
    edges: [
      { from: "webhook", to: "routeWebFormSubmission" },
      { from: "routeWebFormSubmission", to: "respond200ToBot" },
      { from: "routeWebFormSubmission", to: "respond400ToInvalidRequest" },
      { from: "routeWebFormSubmission", to: "respond200ToValidRequest" },
      { from: "respond200ToValidRequest", to: "buildCanonicalRequest" },
      { from: "buildCanonicalRequest", to: "mergeIntakeRoutes" },
      { from: "checkForDuplicateRequest", to: "routeNewVsDuplicate" },
      { from: "routeNewVsDuplicate", to: "createIntakeRecord" },
      { from: "classifyAndDraftResponse", to: "validateAIClassification" },
      { from: "classifyAndDraftResponse", to: "flagClassificationFailure" },
      { from: "createIntakeRecord", to: "classifyAndDraftResponse" },
      { from: "validateAIClassification", to: "enrichIntakeRecord" },
      { from: "onFormSubmission", to: "normalizeInternalNote" },
      { from: "normalizeInternalNote", to: "mergeIntakeRoutes" },
      { from: "mergeIntakeRoutes", to: "checkForDuplicateRequest" },
      { from: "watchAdvisoryInbox", to: "normalizeEmailRequest" },
      { from: "normalizeEmailRequest", to: "mergeIntakeRoutes" },
      { from: "routeUrgentForAlert", to: "postUrgentAlertToSlack" },
      { from: "enrichIntakeRecord", to: "routeUrgentForAlert" },
      { from: "flagClassificationFailure", to: "postFailureAlertToSlack" },
    ],
  },
  webform: {
    site: "Request a consultation · STACKEDHQ Health Advisory",
    brand: ["STACKEDHQ", "Health Advisory"],
    kicker: "Start here",
    heading: "Request a consultation",
    intro:
      "Share a few details and our advisory team will reach out within one business day.",
    fields: [
      ["Name", "Adaeze Nnaji"],
      ["Email", "a.nnaji@•••••.ng"],
      ["Organization (optional)", "Lakeside Medical Group"],
    ],
    request: [
      "Request",
      "The state regulator found that patient records on our shared drive were open to all staff. We must respond within 14 days. Can you help us prepare?",
    ],
    button: "Send request",
    thanks: {
      title: "Request received",
      body: "An advisor will reach out within one business day. Quote this reference in any follow-up:",
      reference,
    },
  },
  slack: {
    workspace: "StackedHQ",
    channel: "intake-alerts",
    channels: ["general", "advisors", "intake-alerts"],
    bot: "Stackoo",
    approvedBy: "",
    messages: [
      {
        time: "4:23 PM",
        title: "🚨 Critical: Regulatory & Compliance",
        lead: ["Regulator Response on Shared-Drive Records"],
        meta: [
          [
            "",
            "From Adaeze Nnaji at Lakeside Medical Group · via Website Form",
          ],
        ],
        items: [],
        quote:
          "Please route this to a regulatory compliance advisor promptly, noting the regulator's 14-day response deadline and the patient records staff could open. The advisor should review the letter and scope the response.",
        link: ["Open the record", reference],
        footer: "Automated with this n8n workflow",
      },
    ],
  },
  sheet: {
    title: "Requests",
    app: "airtable",
    columns: [
      "Source",
      "Requester Name",
      "Requester Org",
      "Category",
      "Urgency",
      "AI Confidence",
      "Classification Notes",
    ],
    fieldKinds: [
      "select",
      "text",
      "text",
      "select",
      "select",
      "number",
      "long",
    ],
    rows: [
      [
        "Internal Note",
        "Dr Femi Adebayo",
        "Riverside Specialist Hospital",
        "Billing & Reimbursement",
        "Normal",
        "0.98",
        "Logged by Anne after a call",
      ],
      [
        "Website Form",
        "Kemi Adeyemi",
        "Brightpath Clinics",
        "Staffing & Training",
        "Low",
        "0.98",
        "",
      ],
      [
        "Email",
        "Tolu Martins",
        "",
        "Regulatory & Compliance",
        "Normal",
        "0.96",
        "",
      ],
    ],
    newRows: [
      [
        "Website Form",
        "Adaeze Nnaji",
        "Lakeside Medical Group",
        "Regulatory & Compliance",
        "Critical",
        "0.99",
        "Patient details: handle with care",
      ],
      [
        "Email",
        "Tolu Martins",
        "",
        "Regulatory & Compliance",
        "Normal",
        "0.98",
        "Follow-up on an earlier email",
      ],
    ],
    wideColumns: [0, 1, 3, 4, 5, 6],
    narrowColumns: [0, 1, 4],
  },
  end: {
    headline: "Three channels in, one sorted table out.",
    points: [
      {
        value: "0",
        label: "requests lost if the AI fails: each is saved before it runs",
      },
      {
        value: "5 of 5",
        label: "test requests classified, all with confidence of 0.96 or more",
      },
    ],
  },
  beats: [
    {
      scene: "webform",
      duration: 6400,
      caption:
        "A clinic sends a request through the website form, and gets a reference number on screen straight away.",
    },
    {
      scene: "canvas",
      node: "buildCanonicalRequest",
      via: ["webhook", "routeWebFormSubmission", "respond200ToValidRequest"],
      duration: 5600,
      caption:
        "Bots are quietly ignored, and broken forms are sent back to be fixed. This one is valid, so it gets its reference.",
      output: [
        ["route", "valid: not a bot"],
        ["source", "Website Form"],
        ["reference", reference],
      ],
    },
    {
      scene: "canvas",
      node: "createIntakeRecord",
      via: [
        "mergeIntakeRoutes",
        "checkForDuplicateRequest",
        "routeNewVsDuplicate",
      ],
      duration: 5800,
      caption:
        "Emails and staff notes join the same path. The request is saved before the AI runs, so nothing is lost if the AI fails.",
      output: [
        ["duplicate?", "no: new request"],
        ["saved", "wording kept as sent"],
      ],
    },
    {
      scene: "canvas",
      node: "validateAIClassification",
      via: ["classifyAndDraftResponse"],
      duration: 6000,
      caption:
        "AI picks a category and urgency from approved options only, suggests the next step and drafts a reply. Code checks every answer.",
      output: [
        ["category", "Regulatory & Compliance"],
        ["urgency", "Critical"],
        ["confidence", "0.99"],
        ["patient info", "flagged"],
        ["draft reply", "drafted, no advice"],
      ],
    },
    {
      scene: "slack",
      message: 0,
      duration: 5600,
      caption:
        "Only Critical and High requests ping the team, with the next step and a link to the record.",
    },
    {
      scene: "sheet",
      duration: 5600,
      caption:
        "Website, email and staff notes all land in one table. A reply to an earlier email is marked as a follow-up.",
    },
    {
      scene: "canvas",
      run: 1,
      node: "routeNewVsDuplicate",
      via: [
        "webhook",
        "routeWebFormSubmission",
        "respond200ToValidRequest",
        "buildCanonicalRequest",
        "mergeIntakeRoutes",
        "checkForDuplicateRequest",
      ],
      duration: 5800,
      caption:
        "The same request sent twice? The second copy is caught at the duplicate check, even if the spacing changes.",
      output: [
        ["same person", "same request, same day"],
        ["result", "duplicate: not saved again"],
      ],
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "Logged the moment it arrives, sorted by AI, and the team only hears about what can't wait.",
    },
  ],
};
