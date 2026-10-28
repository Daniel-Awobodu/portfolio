import type { Demo } from "@/lib/demos/types";

/*
 * The job shortlist, as it really runs (see content/automation/
 * opportunity-feed.mdx and its screenshots). The canvas is drawn from the
 * workflow's export: real node names, connections and layout. The run follows
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
    ],
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
      scene: "canvas",
      node: "isSourceHealthy",
      via: [
        "runDailyAt10am",
        "setAgencyProfileSettings",
        "fetchRemotiveJobs",
        "checkSourceHealth",
      ],
      duration: 5600,
      caption:
        "Every morning at 10am, it pulls the new job posts, and first checks the job board is working.",
      output: [
        ["job board", "working"],
        ["posts", "17"],
      ],
    },
    {
      scene: "canvas",
      node: "logJobsAsNew",
      via: ["findAlreadySeenJobs", "cleanKeepNewJobs", "anyNewJobs"],
      duration: 5000,
      caption:
        "Posts it has already seen are dropped, so nothing is scored or posted twice.",
      output: [
        ["seen before", "0"],
        ["new today", "17"],
      ],
    },
    {
      scene: "canvas",
      node: "scoreJobFitAI",
      duration: 6000,
      caption:
        "AI scores each post against the agency's services. Before scoring, it must copy one line from the post, word for word, as proof.",
      output: [
        ["job", "n8n Automation Partner"],
        ["skills match", "6 of 6"],
        ["pay", "$4,000 - $6,000 fixed"],
        ["proof", "Build an n8n workflow that sends…"],
      ],
    },
    {
      scene: "canvas",
      node: "verifyQuoteFinalScore",
      duration: 5400,
      caption:
        "Code, not the AI, checks the quote is really in the post, and adds up the final score.",
      output: [
        ["quote found?", "yes, word for word"],
        ["final score", "10 of 10: a fit"],
      ],
    },
    {
      scene: "canvas",
      node: "verifyQuoteFinalScore",
      duration: 6000,
      caption:
        "Another post scores as a fit, but its quote isn't in the post. No proof, no post: a person checks it instead.",
      output: [
        ["job", "Zapier Expert for CRM Sync"],
        ["AI score", "8 of 10"],
        ["quote found?", "no: invented"],
        ["result", "needs a human check"],
      ],
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
      scene: "canvas",
      run: 1,
      node: "alertSourceDown",
      via: [
        "runDailyAt10am",
        "setAgencyProfileSettings",
        "fetchRemotiveJobs",
        "checkSourceHealth",
        "isSourceHealthy",
      ],
      duration: 5800,
      caption:
        "If the job board is down or empty, the team is told today's jobs weren't checked, not a misleading \"no jobs today\".",
      output: [
        ["job board", "empty response"],
        ["Slack alert", "today's jobs were not checked"],
      ],
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "An hour of scrolling becomes one short message, and every fit comes with its proof.",
    },
  ],
};
