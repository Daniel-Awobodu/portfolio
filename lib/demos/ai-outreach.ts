import type { Demo } from "@/lib/demos/types";

/*
 * The AI outreach system, as it really runs (see content/automation/
 * ai-outreach.mdx and its screenshots). The canvas is drawn from the
 * research workflow's export: real node names, connections and layout, shown
 * briefly; HubSpot, Apollo, Hunter.io, the news search, Slack and Gmail carry
 * the story. The run follows
 * the write-up's test: a draft opening with real news, its subject rejected in
 * Slack and rewritten, then approved and sent; a draft that reaches the
 * rewrite limit; companies flagged instead of guessed. The real test reached
 * real companies, so every company, person and piece of news here is made up.
 */

const subject1 = "Quick idea for Northwind Robotics";
const subject2 = "Idea after Northwind's Series B";
const draft =
  "Hi Priya, congrats on Northwind's $40M Series B. Scaling robot deployments that fast often brings friction in onboarding and runbooks. Open to a 20-minute call next week?";

export const aiOutreach: Demo = {
  slug: "ai-outreach",
  journey: "from a new company in HubSpot to an approved, personal first email",
  sceneLabels: {
    slack: "Review · Slack",
    inbox: "Prospect’s inbox · Gmail",
    crm: "HubSpot",
    end: "Done",
  },
  outputUnder: true,
  workflows: {
    research: {
      label: "Research and drafting · n8n",
      nodes: [
        {
          id: "scheduleTrigger",
          label: "Schedule Trigger",
          kind: "schedule",
          x: 0,
          y: 146,
        },
        {
          id: "fetchNewCompanies",
          label: 'Fetch "New" Companies',
          kind: "http",
          x: 170,
          y: 146,
        },
        {
          id: "checkDomainExists",
          label: "Check Domain Exists",
          kind: "if",
          x: 510,
          y: 146,
        },
        {
          id: "markForReview",
          label: "Mark for review",
          sub: "update: company",
          kind: "hubspot",
          x: 1870,
          y: 182,
        },
        {
          id: "doesOrganisationEsists",
          label: "Does Organisation esists?",
          kind: "if",
          x: 850,
          y: 97,
        },
        {
          id: "formatCompanyData",
          label: "Format Company Data",
          kind: "edit",
          x: 1020,
          y: 36,
        },
        {
          id: "updateCompanyDetails",
          label: "Update company Details",
          sub: "update: company",
          kind: "hubspot",
          x: 1190,
          y: 36,
        },
        {
          id: "enrichAnOrganization",
          label: "Enrich an organization",
          kind: "http",
          x: 680,
          y: 97,
        },
        {
          id: "scoreSelectBestAgent",
          label: "Score & Select Best Agent",
          kind: "code",
          x: 1530,
          y: 36,
        },
        {
          id: "createAssociatedContact",
          label: "Create Associated contact",
          kind: "hubspot",
          x: 1870,
          y: 0,
        },
        {
          id: "checkAgentFound",
          label: "Check Agent Found",
          kind: "if",
          x: 1700,
          y: 36,
        },
        {
          id: "httpRequest1",
          label: "HTTP Request1",
          kind: "http",
          x: 2040,
          y: 0,
        },
        {
          id: "formatNewsForPrompt",
          label: "Format News For Prompt",
          kind: "code",
          x: 2210,
          y: 0,
        },
        {
          id: "parsePersonalizationHook",
          label: "Parse Personalization Hook",
          kind: "code",
          x: 2647,
          y: 0,
        },
        {
          id: "agentSearch",
          label: "Agent Search",
          kind: "http",
          x: 1360,
          y: 36,
        },
        {
          id: "mergeDataForDraft",
          label: "Merge Data For Draft",
          kind: "code",
          x: 2987,
          y: 0,
        },
        {
          id: "splitOutCompanies",
          label: "Split Out Companies",
          kind: "loop",
          x: 340,
          y: 146,
        },
        {
          id: "draftOutreachMessage",
          label: "Draft Outreach Message",
          kind: "ai",
          x: 3327,
          y: 0,
        },
        {
          id: "parseDraftMessage",
          label: "Parse Draft Message",
          kind: "code",
          x: 3594,
          y: 0,
        },
        {
          id: "prepareDraftContext",
          label: "Prepare Draft Context",
          kind: "code",
          x: 3157,
          y: 0,
        },
        {
          id: "getPersonalizationHook",
          label: "Get Personalization hook",
          kind: "ai",
          x: 2380,
          y: 0,
        },
        {
          id: "updateContactToPendingDraft",
          label: 'Update contact to "Pending" + Draft',
          kind: "hubspot",
          x: 3764,
          y: 0,
        },
        {
          id: "sendAMessage1",
          label: "Send a message1",
          kind: "slack",
          x: 4104,
          y: 0,
        },
        {
          id: "buildSlackBlocks",
          label: "Build Slack Blocks",
          kind: "code",
          x: 3934,
          y: 0,
        },
        {
          id: "updateACompany",
          label: "Update a company",
          sub: "update: company",
          kind: "hubspot",
          x: 2817,
          y: 0,
        },
      ],
      edges: [
        { from: "scheduleTrigger", to: "fetchNewCompanies" },
        { from: "fetchNewCompanies", to: "splitOutCompanies" },
        { from: "checkDomainExists", to: "enrichAnOrganization" },
        { from: "checkDomainExists", to: "markForReview" },
        { from: "doesOrganisationEsists", to: "formatCompanyData" },
        { from: "doesOrganisationEsists", to: "markForReview" },
        { from: "formatCompanyData", to: "updateCompanyDetails" },
        { from: "updateCompanyDetails", to: "agentSearch" },
        { from: "enrichAnOrganization", to: "doesOrganisationEsists" },
        { from: "scoreSelectBestAgent", to: "checkAgentFound" },
        { from: "checkAgentFound", to: "createAssociatedContact" },
        { from: "checkAgentFound", to: "markForReview" },
        { from: "createAssociatedContact", to: "httpRequest1" },
        { from: "httpRequest1", to: "formatNewsForPrompt" },
        { from: "formatNewsForPrompt", to: "getPersonalizationHook" },
        { from: "agentSearch", to: "scoreSelectBestAgent" },
        { from: "parsePersonalizationHook", to: "updateACompany" },
        { from: "splitOutCompanies", to: "checkDomainExists" },
        { from: "mergeDataForDraft", to: "prepareDraftContext" },
        { from: "draftOutreachMessage", to: "parseDraftMessage" },
        { from: "parseDraftMessage", to: "updateContactToPendingDraft" },
        { from: "prepareDraftContext", to: "draftOutreachMessage" },
        { from: "getPersonalizationHook", to: "parsePersonalizationHook" },
        { from: "updateContactToPendingDraft", to: "buildSlackBlocks" },
        { from: "buildSlackBlocks", to: "sendAMessage1" },
        { from: "updateACompany", to: "mergeDataForDraft" },
      ],
    },
  },
  slack: {
    workspace: "StackedHQ",
    channel: "outreach-review",
    channels: ["general", "outreach-review", "sales"],
    bot: "Stackoo",
    approvedBy: "Dan",
    approvedNote: "Sent through Gmail, and the contact is marked Sent.",
    messages: [
      {
        time: "9:14 AM",
        title: "New outreach draft ready for review",
        meta: [
          ["Company", "Northwind Robotics"],
          ["Contact", "Priya Nair, VP of Operations"],
          ["Draft Subject", subject1],
        ],
        items: [],
        quote: draft,
        buttons: true,
      },
      {
        time: "9:31 AM",
        title: "Revised draft ready for review (rewrite 1 of 2)",
        meta: [
          ["Company", "Northwind Robotics"],
          ["Contact", "Priya Nair, VP of Operations"],
          ["Draft Subject", subject2],
        ],
        items: [],
        quote: draft,
        buttons: true,
      },
    ],
  },
  sites: {
    apollo: {
      name: "Apollo",
      logo: "A",
      color: "#e8b100",
      dark: true,
      nav: ["Search", "Companies", "Enrich"],
      search: "northwind.ai",
      title: "Northwind Robotics",
      columns: true,
      blocks: [
        {
          kind: "fields",
          title: "Company",
          rows: [
            { label: "Industry", value: "Robotics", mark: "ok" },
            { label: "Employees", value: "210", mark: "ok" },
            { label: "Annual revenue", value: "$38M", mark: "ok" },
            { label: "Founded", value: "2017" },
            { label: "Headquarters", value: "Austin, Texas" },
          ],
        },
        {
          kind: "text",
          title: "About",
          lines: [
            "Northwind builds autonomous robots for mid-size warehouses, from picking to packing.",
          ],
        },
      ],
    },
    hunter: {
      name: "Hunter.io",
      logo: "H",
      color: "#ff5722",
      nav: ["Domain Search", "Email Finder", "Verifier"],
      search: "northwind.ai",
      title: "14 people at northwind.ai",
      blocks: [
        {
          kind: "list",
          rows: [
            {
              title: "Priya Nair",
              sub: "VP of Operations",
              avatar: "PN",
              mark: "pick",
              note: "can act on it",
            },
            {
              title: "Daniel Osei",
              sub: "Executive Assistant",
              avatar: "DO",
              mark: "no",
              note: "assistant",
            },
            {
              title: "Ana Lopez",
              sub: "Operations Coordinator",
              avatar: "AL",
              mark: "no",
              note: "coordinator",
            },
            {
              title: "Jay Park",
              sub: "Marketing Intern",
              avatar: "JP",
              mark: "no",
              note: "intern",
            },
            {
              title: "Sam Cole",
              sub: "Recruiter",
              avatar: "SC",
              mark: "no",
              note: "wrong team",
            },
          ],
        },
      ],
    },
    news: {
      name: "Google News",
      logo: "G",
      color: "#1a73e8",
      nav: ["All", "News", "Images"],
      search: "Northwind Robotics",
      title: "News · past month",
      blocks: [
        {
          kind: "list",
          rows: [
            {
              title:
                "Northwind Robotics raises $40M Series B to scale warehouse robots",
              sub: "TechWire · 12 days ago",
              mark: "pick",
              note: "a real reason",
            },
            {
              title: "Northwind named a 'Top Logistics Startup to Watch'",
              sub: "Logistics Weekly · 3 weeks ago",
              mark: "no",
              note: "an award",
            },
            {
              title: "Northwind to host a webinar on warehouse automation",
              sub: "Press release · 2 weeks ago",
              mark: "no",
              note: "a press release",
            },
            {
              title: "5 robotics companies hiring this month",
              sub: "JobsDaily · 4 days ago",
              mark: "no",
              note: "not about them",
            },
          ],
        },
      ],
    },
  },
  inbox: {
    count: "1",
    emails: [],
    open: {
      from: "Dan · StackedHQ",
      subject: subject2,
      time: "9:33 AM",
      body: [],
      text: [
        "Hi Priya, congrats on Northwind's $40M Series B. Scaling warehouse robot deployments at that pace often surfaces friction in onboarding, orchestration and runbooks.",
        "",
        "I lead a team that builds automation to reduce those ops bottlenecks, so teams can move faster without adding headcount.",
        "",
        "Would you be open to a brief 20-minute call next week, or just reply if that's easier?",
        "",
        "Thanks, Dan",
      ],
    },
  },
  crm: {
    object: "Companies",
    middle: ["Company domain", "Create date"],
    stageLabel: "Enrichment Status",
    contacts: [
      {
        name: "Brightpath Logistics",
        initials: "BL",
        stage: "Enriched",
        cells: ["brightpath.io", "Yesterday"],
      },
      {
        name: "Corvid Analytics",
        initials: "CA",
        stage: "Enriched",
        cells: ["corvid.ai", "Yesterday"],
      },
      {
        name: "Halcyon Foods",
        initials: "HF",
        stage: "Needs Manual Review",
        cells: ["--", "Yesterday"],
      },
      {
        name: "Tessel Labs",
        initials: "TL",
        stage: "Needs Manual Review",
        cells: ["tessel.dev", "Yesterday"],
      },
    ],
    lead: {
      name: "Northwind Robotics",
      initials: "NR",
      email: "",
      phone: "",
      cells: ["northwind.ai", "Today"],
    },
    stages: { lead: "New", sequence: "New", responded: "Enriched" },
    task: { title: "", stage: "" },
  },
  end: {
    headline: "Cold emails that open with a real reason to write.",
    points: [
      { value: "0", label: "emails sent without a person approving them" },
      {
        value: "2",
        label: "rewrites from feedback before a person takes over",
      },
    ],
  },
  beats: [
    {
      scene: "crm",
      mode: "lead",
      duration: 4800,
      caption:
        "Every day, up to 20 new prospect companies are picked up from HubSpot.",
    },
    {
      scene: "canvas",
      flow: "research",
      node: "enrichAnOrganization",
      via: [
        "scheduleTrigger",
        "fetchNewCompanies",
        "splitOutCompanies",
        "checkDomainExists",
      ],
      duration: 4200,
      caption: "In n8n, each company with a website goes to Apollo.",
      output: [["company", "Northwind Robotics"]],
    },
    {
      scene: "site",
      site: "apollo",
      duration: 5400,
      caption:
        "Apollo fills in what the company does, its size and revenue, and HubSpot is updated.",
    },
    {
      scene: "site",
      site: "hunter",
      duration: 6400,
      caption:
        "Hunter.io lists the people there. The one who can act is picked: operations, IT or leadership, never an assistant or an intern.",
    },
    {
      scene: "site",
      site: "news",
      duration: 6600,
      caption:
        "Then the last month of news is searched for a real reason to write. Awards and press releases don't count. A $40M Series B does.",
    },
    {
      scene: "canvas",
      flow: "research",
      node: "sendAMessage1",
      via: [
        "parsePersonalizationHook",
        "updateACompany",
        "mergeDataForDraft",
        "prepareDraftContext",
        "draftOutreachMessage",
        "parseDraftMessage",
        "updateContactToPendingDraft",
        "buildSlackBlocks",
      ],
      duration: 5000,
      caption:
        "AI drafts the email in under 120 words, opening with that news. Invented results and stock lines are banned.",
      output: [
        ["opens with", "the Series B"],
        ["length", "96 words"],
      ],
    },
    {
      scene: "slack",
      message: 0,
      reject: "Subject is too generic. Mention the Series B.",
      duration: 6400,
      caption:
        "Nothing is sent until a person says yes in Slack. Here the reviewer rejects the draft, and says why.",
    },
    {
      scene: "slack",
      message: 1,
      approve: true,
      duration: 6000,
      caption:
        "The rewrite fixes only what was flagged: the subject. This time the reviewer approves, and it goes out through Gmail.",
    },
    {
      scene: "inbox",
      mode: "open",
      duration: 6000,
      caption:
        "The prospect gets an email about their own news, sent to the person who can act on it.",
    },
    {
      scene: "crm",
      mode: "responded",
      duration: 6000,
      caption:
        "Back in HubSpot, a company with no website, or none Apollo can find, is marked for a person, never guessed. So is a draft rejected twice.",
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "Research, a real reason to write, and a person's yes before every send.",
    },
  ],
};
