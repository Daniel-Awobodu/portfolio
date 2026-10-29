import type { Demo } from "@/lib/demos/types";

/*
 * The job shortlist, as it really runs (see content/automation/
 * opportunity-feed.mdx and its screenshots). The canvas is drawn from the
 * workflow's export: real node names, connections and layout, shown briefly;
 * the job board, Airtable and Slack carry the story. The run follows
 * the real digest and the write-up's tests: a fit backed by a quote found word
 * for word, a fit whose quote was invented (sent to a person, never posted),
 * a pitch idea, and a job board that is down. Every company here is sample
 * data.
 */

const fitQuote =
  "Build an n8n workflow that sends new Calendly bookings into HubSpot as contacts and deals";

export const opportunityFeed: Demo = {
  slug: "opportunity-feed",
  journey: "from the morning's job posts to one short, proven shortlist",
  sceneLabels: {
    canvas: "The job shortlist · n8n",
    sheet: "Job log · Airtable",
    slack: "Team digest · Slack",
    end: "Done",
  },
  outputUnder: true,
  workflow: {
    nodes: [
      {
        id: "runDailyAt10am",
        label: "Run Daily at 10am",
        kind: "schedule",
        x: 0,
        y: 146,
      },
      {
        id: "setAgencyProfileSettings",
        label: "Set Agency Profile & Settings",
        kind: "edit",
        x: 170,
        y: 146,
      },
      {
        id: "fetchRemotiveJobs",
        label: "Fetch Remotive Jobs",
        kind: "http",
        x: 340,
        y: 146,
      },
      {
        id: "checkSourceHealth",
        label: "Check Source Health",
        kind: "code",
        x: 510,
        y: 146,
      },
      {
        id: "isSourceHealthy",
        label: "Is Source Healthy?",
        kind: "if",
        x: 680,
        y: 146,
      },
      {
        id: "findAlreadySeenJobs",
        label: "Find Already-Seen Jobs",
        sub: "search: record",
        kind: "airtable",
        x: 850,
        y: 73,
      },
      {
        id: "cleanKeepNewJobs",
        label: "Clean & Keep New Jobs",
        kind: "code",
        x: 1020,
        y: 73,
      },
      { id: "anyNewJobs", label: "Any New Jobs?", kind: "if", x: 1190, y: 73 },
      {
        id: "scoreJobFitAI",
        label: "Score Job Fit (AI)",
        kind: "ai",
        x: 1530,
        y: 0,
      },
      {
        id: "verifyQuoteFinalScore",
        label: "Verify Quote & Final Score",
        kind: "code",
        x: 1809,
        y: 0,
      },
      {
        id: "logJobsAsNew",
        label: "Log Jobs as New",
        sub: "upsert: record",
        kind: "airtable",
        x: 1360,
        y: 0,
      },
      {
        id: "saveResultsToAirtable",
        label: "Save Results to Airtable",
        sub: "update: record",
        kind: "airtable",
        x: 1979,
        y: 0,
      },
      {
        id: "buildDailyDigest",
        label: "Build Daily Digest",
        kind: "code",
        x: 2149,
        y: 0,
      },
      {
        id: "postDailyDigest",
        label: "Post Daily Digest",
        kind: "slack",
        x: 2319,
        y: 0,
      },
      {
        id: "alertSourceDown",
        label: "Alert: Source Down",
        kind: "slack",
        x: 850,
        y: 219,
      },
    ],
    edges: [
      { from: "runDailyAt10am", to: "setAgencyProfileSettings" },
      { from: "setAgencyProfileSettings", to: "fetchRemotiveJobs" },
      { from: "fetchRemotiveJobs", to: "checkSourceHealth" },
      { from: "checkSourceHealth", to: "isSourceHealthy" },
      { from: "isSourceHealthy", to: "findAlreadySeenJobs" },
      { from: "isSourceHealthy", to: "alertSourceDown" },
      { from: "findAlreadySeenJobs", to: "cleanKeepNewJobs" },
      { from: "cleanKeepNewJobs", to: "anyNewJobs" },
      { from: "anyNewJobs", to: "logJobsAsNew" },
      { from: "anyNewJobs", to: "buildDailyDigest" },
      { from: "scoreJobFitAI", to: "verifyQuoteFinalScore" },
      { from: "logJobsAsNew", to: "scoreJobFitAI" },
      { from: "verifyQuoteFinalScore", to: "saveResultsToAirtable" },
      { from: "saveResultsToAirtable", to: "buildDailyDigest" },
      { from: "buildDailyDigest", to: "postDailyDigest" },
    ],
  },
  sheet: {
    title: "Jobs",
    app: "airtable",
    columns: [
      "Job Title",
      "Status",
      "Final Score",
      "Evidence Quote",
      "Quote Verified",
    ],
    fieldKinds: ["text", "select", "number", "long", "text"],
    rows: [
      [
        "Senior Shopify Developer",
        "Not a Fit",
        "2.0",
        "Senior Shopify Developer with 5+ years…",
        "✓",
      ],
      [
        "Inside Sales Contractor",
        "Not a Fit",
        "0.0",
        "This role is 100% commission…",
        "✓",
      ],
      [
        "Senior AI Engineer",
        "Not a Fit",
        "1.0",
        "We'll manually find the best clients for you…",
        "✓",
      ],
      [
        "Remote Office Assistant",
        "Not a Fit",
        "1.0",
        "Contributing to internal database maintenance…",
        "✓",
      ],
    ],
    newRows: [
      [
        "n8n Automation Partner for Clinic Booking + HubSpot",
        "Posted",
        "10.0",
        fitQuote,
        "✓",
      ],
      [
        "Zapier Expert for CRM Sync",
        "Needs Check",
        "8.0",
        "We need daily syncs between our CRM and…",
        "✗",
      ],
    ],
    wideColumns: [0, 1, 2, 3, 4],
    narrowColumns: [0, 1, 4],
  },
  slack: {
    workspace: "StackedHQ",
    channel: "job-shortlist",
    channels: ["general", "job-shortlist", "alerts"],
    bot: "Stackoo",
    approvedBy: "",
    messages: [
      {
        time: "10:02 AM",
        title: "🎯 Job Shortlist · Thu 1 Oct",
        meta: [
          [
            "",
            "Scanned 17 · 17 new · 1 fit · 1 to check · 1 pitch idea · Source OK",
          ],
        ],
        items: [],
        sections: [
          {
            heading: "✅ FITS",
            lines: [
              "1. n8n Automation Partner for Clinic Booking + HubSpot · Brightline Dental Group · 10/10",
              `Proof: "${fitQuote}"`,
              "Pay: $4,000 - $6,000 fixed project",
            ],
          },
          {
            heading: "🔍 NEEDS A HUMAN CHECK",
            lines: [
              "• Zapier Expert for CRM Sync · its quote isn't in the posting",
            ],
          },
          {
            heading: "💡 PITCH IDEAS (not direct fits, worth a cold pitch)",
            lines: [
              "• Remote Office Assistant · automate their manual data entry",
              'Proof: "Contributing to internal database maintenance, upkeep, and data entry"',
            ],
          },
          {
            heading: "⚠️ Skipped: 8 red-flag posts",
            lines: [
              "middleman or talent network, commission-only, pay-to-apply, spammy",
            ],
          },
        ],
        footer: "Jobs via Remotive · full log in Airtable",
      },
      {
        time: "10:01 AM",
        title: "⚠️ Job board check failed",
        meta: [
          [
            "",
            "Remotive answered with no jobs, so today's jobs were NOT checked.",
          ],
          ["", "This isn't a quiet day. Check the source, then run it again."],
        ],
        items: [],
        footer: "Job Shortlist · source health check",
      },
    ],
  },
  sites: {
    board: {
      name: "Remotive",
      logo: "R",
      color: "#5b3fd9",
      nav: ["Remote jobs", "Companies", "Post a job"],
      search: "Software development · posted in the last day",
      title: "Remote jobs · 17 new today",
      blocks: [
        {
          kind: "list",
          rows: [
            {
              title: "n8n Automation Partner for Clinic Booking + HubSpot",
              sub: "Brightline Dental Group",
              tags: ["Contract", "$4,000 - $6,000"],
              avatar: "BD",
            },
            {
              title: "Zapier Expert for CRM Sync",
              sub: "Ledgerline",
              tags: ["Contract"],
              avatar: "LL",
            },
            {
              title: "Remote Office Assistant",
              sub: "Harbor & Pine",
              tags: ["Full-time"],
              avatar: "HP",
            },
            {
              title: "Inside Sales Contractor",
              sub: "Brightwave Media",
              tags: ["Commission only"],
              avatar: "BM",
            },
            {
              title: "Senior AI Engineer",
              sub: "Talentloop",
              tags: ["Talent network"],
              avatar: "TL",
            },
            {
              title: "Senior Shopify Developer",
              sub: "Northstar Goods",
              tags: ["Full-time"],
              avatar: "NG",
            },
          ],
        },
      ],
    },
    fit: {
      name: "Remotive",
      logo: "R",
      color: "#5b3fd9",
      nav: ["Remote jobs", "Companies", "Post a job"],
      title: "n8n Automation Partner for Clinic Booking + HubSpot",
      blocks: [
        {
          kind: "text",
          meta: "Brightline Dental Group · Contract · $4,000 - $6,000 fixed project",
          lines: [
            "We run three dental clinics and want our bookings to flow into our CRM without anyone copying them over.",
            `${fitQuote}, and alerts our front desk in Slack when a new patient books.`,
            "You'll own the build end to end and hand it over with clear notes.",
          ],
          find: { text: fitQuote, found: true },
        },
      ],
    },
    noProof: {
      name: "Remotive",
      logo: "R",
      color: "#5b3fd9",
      nav: ["Remote jobs", "Companies", "Post a job"],
      title: "Zapier Expert for CRM Sync",
      blocks: [
        {
          kind: "text",
          meta: "Ledgerline · Contract",
          lines: [
            "Ledgerline is growing fast and our tools don't talk to each other.",
            "We're looking for someone experienced with Zapier to help our operations team.",
            "Tell us about a project you're proud of.",
          ],
          find: {
            text: "We need daily syncs between our CRM and billing tool",
            found: false,
          },
        },
      ],
    },
  },
  end: {
    headline: "A daily shortlist, with proof for every fit.",
    points: [
      { value: "16 of 16", label: "real job posts judged correctly" },
      {
        value: "0",
        label:
          "fits posted without a quote found word for word in the job post",
      },
    ],
  },
  beats: [
    {
      scene: "site",
      site: "board",
      label: "Remotive · remote job board",
      duration: 6400,
      caption:
        "Every morning at 10am, it reads the new posts on Remotive, a remote job board. Upwork or Indeed can be plugged in the same way.",
    },
    {
      scene: "canvas",
      node: "scoreJobFitAI",
      via: [
        "runDailyAt10am",
        "setAgencyProfileSettings",
        "fetchRemotiveJobs",
        "checkSourceHealth",
        "isSourceHealthy",
        "findAlreadySeenJobs",
        "cleanKeepNewJobs",
        "anyNewJobs",
        "logJobsAsNew",
      ],
      duration: 5600,
      caption:
        "In n8n, posts it has seen before are dropped. AI scores the rest, and must copy one line from each post as proof.",
      output: [
        ["new posts", "17"],
        ["proof", "one line, word for word"],
      ],
    },
    {
      scene: "site",
      site: "fit",
      label: "Remotive · the job post",
      duration: 6400,
      caption:
        "Code then searches the real post for that line. It's there, word for word, so this job is a fit: 10 out of 10.",
    },
    {
      scene: "site",
      site: "noProof",
      label: "Remotive · the job post",
      duration: 6400,
      caption:
        "Another post also scored as a fit, but the AI's line isn't in the post at all. No proof, no post: a person checks it instead.",
    },
    {
      scene: "sheet",
      duration: 5200,
      caption:
        "Every post is logged in Airtable with its score and the quote behind it.",
    },
    {
      scene: "slack",
      message: 0,
      duration: 7400,
      caption:
        "One message each morning: the fit with its proof, the post to check, and a pitch idea for a company still doing data entry by hand.",
    },
    {
      scene: "slack",
      message: 1,
      duration: 6000,
      caption:
        "If Remotive is down or empty, the team is told today's jobs weren't checked, not a misleading \"no jobs today\".",
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "An hour of scrolling becomes one short message, and every fit comes with its proof.",
    },
  ],
};
