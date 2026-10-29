import type { Demo } from "@/lib/demos/types";

/*
 * The solar lead system, as it really runs (see content/automation/
 * solar-leads.mdx and its screenshots). The canvas is drawn from the
 * workflow's export: real node names, connections and layout, shown briefly;
 * the data sources, HubSpot, Gmail and WhatsApp carry the story. The power
 * price and monthly sunlight are sample figures. The run follows
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
    crm: "HubSpot",
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
  sites: {
    geo: {
      name: "Geoapify",
      logo: "G",
      color: "#2f7bbd",
      nav: ["Geocoding", "Places", "Maps"],
      search: "1100 Congress Avenue, Austin, TX 78701",
      title: "Address match",
      columns: true,
      blocks: [
        {
          kind: "map",
          label: "1100 Congress Avenue, Austin, TX 78701",
          note: "Building · match 0.98",
        },
        {
          kind: "fields",
          rows: [
            { label: "Matched to", value: "a building", mark: "ok" },
            {
              label: "Confidence",
              value: "0.98",
              mark: "ok",
              note: "needs 0.90",
            },
            { label: "State", value: "Texas" },
            { label: "Next", value: "research the property" },
          ],
        },
      ],
    },
    property: {
      name: "RentCast",
      logo: "RC",
      color: "#1f6feb",
      nav: ["Property data", "Rent estimates", "Market data"],
      search: "1100 Congress Avenue, Austin, TX",
      title: "Property record",
      blocks: [
        {
          kind: "fields",
          title: "Public record vs the form",
          rows: [
            {
              label: "Owner on the deed",
              value: "Robert Hayes",
              mark: "ok",
              note: "matches the form",
            },
            {
              label: "Roof",
              value: "Metal",
              mark: "ok",
              note: "matches the form",
            },
            { label: "Home size", value: "3,291 sq ft" },
            { label: "Property type", value: "Single family" },
          ],
        },
      ],
    },
    sun: {
      name: "NREL PVWatts",
      logo: "N",
      color: "#0079c2",
      nav: ["Calculator", "Results", "Help"],
      title: "Solar resource for this roof",
      blocks: [
        {
          kind: "stats",
          items: [
            { label: "Sun hours a day", value: "5.38" },
            { label: "Location", value: "Austin" },
            { label: "Source", value: "NREL" },
          ],
        },
        {
          kind: "bars",
          title: "Sunlight by month",
          labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          values: [4.1, 4.7, 5.3, 5.8, 6.1, 6.6, 6.8, 6.5, 5.9, 5.2, 4.4, 3.9],
        },
      ],
    },
    price: {
      name: "U.S. EIA",
      logo: "E",
      color: "#0b6e4f",
      nav: ["Electricity", "Data", "Analysis"],
      title: "Average residential electricity price",
      blocks: [
        {
          kind: "table",
          columns: ["State", "Cents per kWh", "Saved for"],
          rows: [
            ["Texas", "15.2", "30 days"],
            ["California", "31.0", "30 days"],
            ["Florida", "15.0", "30 days"],
          ],
          highlight: [0],
        },
      ],
    },
    review: {
      name: "RentCast",
      logo: "RC",
      color: "#1f6feb",
      nav: ["Property data", "Rent estimates", "Market data"],
      search: "2207 Riverside Drive, Austin, TX",
      title: "Property record",
      blocks: [
        {
          kind: "fields",
          title: "Public record vs the form",
          rows: [
            {
              label: "Owner on the deed",
              value: "Riverside Family Trust",
              mark: "no",
              note: "form says Dana Brooks",
            },
            {
              label: "Roof",
              value: "Metal",
              mark: "no",
              note: "form says flat",
            },
            { label: "Home size", value: "2,480 sq ft" },
            { label: "Property type", value: "Single family" },
          ],
        },
      ],
    },
  },
  crm: {
    contacts: [
      {
        name: "Dana Brooks",
        initials: "DB",
        stage: "REVIEW",
        cells: ["60", "Open"],
      },
      {
        name: "Linda Park",
        initials: "LP",
        stage: "WARM",
        cells: ["71", "Open"],
      },
      {
        name: "Mark Ellis",
        initials: "ME",
        stage: "New",
        cells: ["--", "Unverified address"],
      },
    ],
    lead: {
      name: "Robert Hayes",
      initials: "RH",
      email: "",
      phone: "",
      cells: ["88", "Open"],
    },
    middle: ["Lead score", "Lead status"],
    stageLabel: "Tier",
    stages: { lead: "HOT", sequence: "HOT", responded: "HOT" },
    task: { title: "", stage: "" },
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
      node: "geocodeLeadAddress",
      via: [
        "receiveLeadFormSubmission",
        "normalizeAndValidateLead",
        "routeValidVsRejected",
        "findExistingContact",
        "routeNewVsReturning",
      ],
      duration: 5000,
      caption:
        "In n8n, the form is checked and returning leads are spotted. Then the address is looked up.",
      output: [
        ["owns home?", "yes"],
        ["returning?", "no: new"],
      ],
    },
    {
      scene: "site",
      site: "geo",
      duration: 5400,
      caption:
        "Geoapify matches it to a real building, 98% sure. Anything under 90% stops here, and nothing is researched.",
    },
    {
      scene: "site",
      site: "property",
      duration: 5200,
      caption:
        "The public property record confirms the owner on the deed, the roof and the size of the home.",
    },
    {
      scene: "site",
      site: "sun",
      duration: 4800,
      caption: "NREL gives the sunlight on that exact roof, month by month.",
    },
    {
      scene: "site",
      site: "price",
      duration: 4800,
      caption:
        "And the EIA gives the state's power price, saved for a month so Texas isn't looked up twice.",
    },
    {
      scene: "canvas",
      node: "parseScoringOutput",
      via: [
        "lookupPropertyOwnership",
        "fetchRoofSolarPotential",
        "resolveStateElectricityRate",
        "assembleEnrichmentProfile",
        "scoreLeadWithAI",
      ],
      duration: 5000,
      caption:
        "AI scores the lead from 0 to 100, with its reasons and concerns.",
      output: [
        ["score", "88: HOT"],
        ["why", "high bill, ready now, owner verified"],
      ],
    },
    {
      scene: "crm",
      mode: "lead",
      duration: 4800,
      caption:
        "In HubSpot, the lead lands scored and tiered, before anyone picks up the phone.",
    },
    {
      scene: "inbox",
      mode: "open",
      duration: 6200,
      caption:
        "A hot lead gets a first email within minutes. It only uses facts the system is sure of, so no promised savings.",
    },
    {
      scene: "site",
      site: "review",
      duration: 6000,
      caption:
        "Another lead looks strong, but the deed shows a different owner, and the county says the roof is metal, not flat.",
    },
    {
      scene: "chat",
      thread: "wa",
      duration: 7000,
      caption:
        "So it goes to a person on WhatsApp, whatever its score. So does an address that can't be verified.",
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
