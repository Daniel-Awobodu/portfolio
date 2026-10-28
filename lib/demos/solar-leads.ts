import type { Demo } from "@/lib/demos/types";

/*
 * The solar lead system, as it really runs (see content/automation/
 * solar-leads.mdx and its screenshots). The canvas is drawn from the
 * workflow's export: real node names, connections and layout. The run follows
 * the write-up's tests: a HOT lead researched and emailed with trusted facts
 * only, a lead whose deed and roof contradict the form sent to a person, and
 * an address that can't be verified, never researched. The first email
 * follows the real one. Every name and address here is sample data.
 */

const reviewAlert = [
  "⚠️ REVIEW NEEDED: Dana Brooks",
  "",
  "Score: 60/100 · REVIEW",
  "📍 2207 Riverside Drive, Austin, TX 78741",
  "",
  "Why: strong signals (bill $500+, timeline Now), but the name isn't on the deed and the roof doesn't match the county record.",
  "",
  "Concerns:",
  "• name not found on deed",
  "• roof: form says Flat, county says Metal",
].join("\n");

const addressAlert = [
  "📍 ADDRESS NEEDS CHECKING: Mark Ellis",
  "",
  "Couldn't verify this address, so it wasn't researched or scored. Call to confirm.",
  "",
  "Submitted: 4471 Willowmere Crescent, Fairhaven, TX 78999",
  "Confidence: 0.25",
].join("\n");

export const solarLeads: Demo = {
  slug: "solar-leads",
  journey:
    "from a homeowner's form to a researched, scored and followed-up lead",
  sceneLabels: {
    webform: "Homeowner’s browser · company website",
    canvas: "The lead workflow · n8n",
    inbox: "Homeowner’s inbox · Gmail",
    chat: "Sales team · WhatsApp",
    end: "Done",
  },
  outputUnder: true,
  workflow: {
    nodes: [
      {
        id: "receiveLeadFormSubmission",
        label: "Receive Lead Form Submission",
        kind: "webhook",
        x: 0,
        y: 291,
      },
      {
        id: "routeNewVsReturning",
        label: "Route New vs Returning",
        kind: "if",
        x: 680,
        y: 219,
      },
      {
        id: "findExistingContact",
        label: "Find Existing Contact",
        sub: "search: contact",
        kind: "hubspot",
        x: 510,
        y: 219,
      },
      {
        id: "routeValidVsRejected",
        label: "Route Valid vs Rejected",
        kind: "if",
        x: 340,
        y: 291,
      },
      {
        id: "alertSalesOnRepeatLead",
        label: "Alert Sales On Repeat Lead",
        kind: "whatsapp",
        x: 1020,
        y: 291,
      },
      {
        id: "updateReturningLead",
        label: "Update Returning Lead",
        kind: "hubspot",
        x: 850,
        y: 291,
      },
      {
        id: "normalizeAndValidateLead",
        label: "Normalize And Validate Lead",
        kind: "code",
        x: 170,
        y: 291,
      },
      {
        id: "markLeadsDisqualified",
        label: "Mark Leads Disqualified",
        kind: "hubspot",
        x: 510,
        y: 364,
      },
      {
        id: "geocodeLeadAddress",
        label: "Geocode Lead Address",
        kind: "http",
        x: 850,
        y: 146,
      },
      {
        id: "lookupPropertyOwnership",
        label: "Lookup Property Ownership",
        kind: "http",
        x: 1190,
        y: 73,
      },
      {
        id: "checkGeocodePrecision",
        label: "Check Geocode Precision",
        kind: "if",
        x: 1020,
        y: 146,
      },
      {
        id: "fetchRoofSolarPotential",
        label: "Fetch Roof Solar Potential",
        kind: "http",
        x: 1360,
        y: 73,
      },
      {
        id: "resolveStateElectricityRate",
        label: "Resolve State Electricity Rate",
        kind: "code",
        x: 1530,
        y: 73,
      },
      {
        id: "assembleEnrichmentProfile",
        label: "Assemble Enrichment Profile",
        kind: "code",
        x: 1700,
        y: 73,
      },
      {
        id: "scoreLeadWithAI",
        label: "Score Lead With AI",
        kind: "ai",
        x: 1870,
        y: 73,
      },
      {
        id: "openaiChatModel",
        label: "OpenAI Chat Model",
        kind: "model",
        x: 1931,
        y: 243,
        round: true,
      },
      {
        id: "parseScoringOutput",
        label: "Parse Scoring Output",
        kind: "code",
        x: 2137,
        y: 73,
      },
      {
        id: "upsertQualifiedLead",
        label: "Upsert Qualified Lead",
        kind: "hubspot",
        x: 2307,
        y: 73,
      },
      { id: "switch", label: "Switch", kind: "switch", x: 2477, y: 49 },
      {
        id: "writeFirstTouchEmail",
        label: "Write First Touch Email",
        kind: "ai",
        x: 2647,
        y: 0,
      },
      {
        id: "sendAMessage",
        label: "Send a message",
        kind: "gmail",
        x: 3084,
        y: 0,
      },
      {
        id: "alertSalesOnBadAddress",
        label: "Alert Sales On Bad Address",
        kind: "whatsapp",
        x: 1360,
        y: 219,
      },
      {
        id: "alertHumanReviewer",
        label: "Alert Human Reviewer",
        kind: "whatsapp",
        x: 2696,
        y: 146,
      },
      {
        id: "logUnverifiedLead",
        label: "Log Unverified Lead",
        kind: "hubspot",
        x: 1190,
        y: 219,
      },
      { id: "wait", label: "Wait", kind: "wait", x: 2914, y: 0 },
    ],
    edges: [
      { from: "receiveLeadFormSubmission", to: "normalizeAndValidateLead" },
      { from: "routeNewVsReturning", to: "geocodeLeadAddress" },
      { from: "routeNewVsReturning", to: "updateReturningLead" },
      { from: "findExistingContact", to: "routeNewVsReturning" },
      { from: "updateReturningLead", to: "alertSalesOnRepeatLead" },
      { from: "normalizeAndValidateLead", to: "routeValidVsRejected" },
      { from: "routeValidVsRejected", to: "findExistingContact" },
      { from: "routeValidVsRejected", to: "markLeadsDisqualified" },
      { from: "geocodeLeadAddress", to: "checkGeocodePrecision" },
      { from: "checkGeocodePrecision", to: "lookupPropertyOwnership" },
      { from: "checkGeocodePrecision", to: "logUnverifiedLead" },
      { from: "lookupPropertyOwnership", to: "fetchRoofSolarPotential" },
      { from: "fetchRoofSolarPotential", to: "resolveStateElectricityRate" },
      { from: "resolveStateElectricityRate", to: "assembleEnrichmentProfile" },
      { from: "assembleEnrichmentProfile", to: "scoreLeadWithAI" },
      { from: "scoreLeadWithAI", to: "openaiChatModel", model: true },
      { from: "scoreLeadWithAI", to: "parseScoringOutput" },
      { from: "parseScoringOutput", to: "upsertQualifiedLead" },
      { from: "upsertQualifiedLead", to: "switch" },
      { from: "switch", to: "writeFirstTouchEmail" },
      { from: "switch", to: "alertHumanReviewer" },
      { from: "writeFirstTouchEmail", to: "wait" },
      { from: "logUnverifiedLead", to: "alertSalesOnBadAddress" },
      { from: "wait", to: "sendAMessage" },
    ],
  },
  webform: {
    site: "Free solar assessment · SunStackedHQ",
    brand: ["SunStackedHQ", ""],
    kicker: "Go solar",
    heading: "Get your free solar assessment",
    intro: "Tell us about your home and we'll be in touch.",
    fields: [
      ["Name", "Robert Hayes"],
      ["Email", "robert@•••••.com"],
      ["Monthly bill", "$300 - $499"],
      ["Timeline", "Ready now"],
    ],
    request: ["Home address", "1100 Congress Avenue, Austin, TX 78701"],
    button: "Get my assessment",
    cta: "Free assessment",
    thanks: {
      title: "Thanks, Robert!",
      body: "We're looking at your home now. Look out for an email from Mike.",
    },
  },
  inbox: {
    count: "1",
    emails: [],
    open: {
      from: "Mike · SunStackedHQ",
      subject: "Quick next step for your Austin solar inquiry",
      time: "1:51 PM",
      body: [],
      text: [
        "Thanks for reaching out about solar. I noticed your monthly bill is about $300 to $499.",
        "",
        "You mentioned you are ready to move quickly. I can review your details and set up a brief call to go over options and next steps.",
        "",
        "Do you have 15 minutes today or tomorrow for a quick call?",
        "",
        "Mike",
        "SunStackedHQ",
      ],
    },
  },
  threads: {
    wa: {
      app: "whatsapp",
      contact: "Sales alerts (You)",
      status: "Message yourself",
      initials: "SA",
    },
  },
  end: {
    headline: "Every lead researched, scored and followed up in minutes.",
    points: [
      { value: "4", label: "public data sources checked on every lead" },
      { value: "0", label: "unverified facts allowed into the first email" },
    ],
  },
  beats: [
    {
      scene: "webform",
      duration: 6000,
      caption:
        "A homeowner asks for a free solar assessment on the company's website.",
    },
    {
      scene: "canvas",
      node: "checkGeocodePrecision",
      via: [
        "receiveLeadFormSubmission",
        "normalizeAndValidateLead",
        "routeValidVsRejected",
        "findExistingContact",
        "routeNewVsReturning",
        "geocodeLeadAddress",
      ],
      duration: 6200,
      caption:
        "The form is checked, returning leads are spotted, and the address must match a real building with at least 90% confidence.",
      output: [
        ["owns home?", "yes"],
        ["returning?", "no: new"],
        ["address match", "0.98: verified"],
      ],
    },
    {
      scene: "canvas",
      node: "assembleEnrichmentProfile",
      via: [
        "lookupPropertyOwnership",
        "fetchRoofSolarPotential",
        "resolveStateElectricityRate",
      ],
      duration: 6200,
      caption:
        "Then the property is researched in public records: the owner on the deed, the roof, the sunlight and the state's power price.",
      output: [
        ["owner on deed", "Robert Hayes: matches"],
        ["roof", "metal: matches the county"],
        ["sunlight", "5.4 hours a day"],
        ["power price", "Texas, from the EIA"],
      ],
    },
    {
      scene: "canvas",
      node: "parseScoringOutput",
      via: ["scoreLeadWithAI"],
      duration: 5600,
      caption:
        "AI scores the lead from 0 to 100, with its reasons, its concerns and the next step.",
      output: [
        ["score", "88 of 100"],
        ["tier", "HOT"],
        ["why", "high bill, ready now, owner verified"],
        ["next step", "call within a day"],
      ],
    },
    {
      scene: "canvas",
      node: "writeFirstTouchEmail",
      via: ["upsertQualifiedLead", "switch"],
      duration: 6000,
      caption:
        "It's saved in HubSpot, and a HOT lead gets a first email. It may only use facts the system is sure of.",
      output: [
        ["may use", "bill, timeline, roof, sunlight"],
        ["never uses", "savings, system size: estimates"],
        ["tone", "HOT: ask for a quick call"],
      ],
    },
    {
      scene: "inbox",
      mode: "open",
      duration: 6000,
      caption:
        "Minutes after the form, the homeowner has a personal email. No promised savings, because those would only be estimates.",
    },
    {
      scene: "canvas",
      run: 1,
      node: "alertHumanReviewer",
      via: [
        "receiveLeadFormSubmission",
        "normalizeAndValidateLead",
        "routeValidVsRejected",
        "findExistingContact",
        "routeNewVsReturning",
        "geocodeLeadAddress",
        "checkGeocodePrecision",
        "lookupPropertyOwnership",
        "fetchRoofSolarPotential",
        "resolveStateElectricityRate",
        "assembleEnrichmentProfile",
        "scoreLeadWithAI",
        "parseScoringOutput",
        "upsertQualifiedLead",
        "switch",
      ],
      duration: 7000,
      caption:
        "Another lead scores 60, but the name isn't on the deed, and the roof the form calls flat is metal on the county record. A person reviews it, whatever the score.",
      output: [
        ["name on deed", "no"],
        ["roof", "form: flat · county: metal"],
        ["tier", "REVIEW: to a person"],
      ],
    },
    {
      scene: "canvas",
      run: 2,
      node: "alertSalesOnBadAddress",
      via: [
        "receiveLeadFormSubmission",
        "normalizeAndValidateLead",
        "routeValidVsRejected",
        "findExistingContact",
        "routeNewVsReturning",
        "geocodeLeadAddress",
        "checkGeocodePrecision",
        "logUnverifiedLead",
      ],
      duration: 6000,
      caption:
        "An address that can't be matched isn't researched at all. Nothing is looked up on a guessed address.",
      output: [
        ["address match", "0.25: below 0.90"],
        ["researched?", "no"],
        ["sales", "asked to confirm by phone"],
      ],
    },
    {
      scene: "chat",
      thread: "wa",
      duration: 7000,
      caption:
        "Sales get both on WhatsApp with the reasons, so only the calls that need a person go to a person.",
      messages: [
        { from: "me", at: 0.08, time: "1:20 PM", text: reviewAlert },
        { from: "me", at: 0.42, time: "1:23 PM", text: addressAlert },
      ],
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "Researched before anyone calls, checked against public records, and followed up in minutes.",
    },
  ],
};
