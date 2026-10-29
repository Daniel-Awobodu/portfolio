import type { Demo } from "@/lib/demos/types";

/*
 * The content pipeline, as it really runs (see content/automation/
 * content-pipeline.mdx and its screenshots). The canvas is drawn from the
 * workflow's export and shown briefly; the sheet, WordPress, Slack, Buffer,
 * the blog, X, LinkedIn and Search Console carry the story. The keywords, the
 * article and the social posts follow the real test on a live blog, including
 * the keyword caught as a duplicate. The illustration is the one the workflow
 * made. The weekly scan was tested with sample Search Console results.
 */

const title = "Signs your rabbit is sick: Warning signs to watch";

export const contentPipeline: Demo = {
  slug: "content-pipeline",
  journey: "from one keyword in a sheet to a published, shared article",
  sceneLabels: {
    sheet: "Keyword list · Google Sheets",
    slack: "Editor’s approval · Slack",
    end: "Done",
  },
  outputUnder: true,
  workflows: {
    write: {
      label: "Write, approve and publish · n8n",
      nodes: [
        {
          id: "scheduleTrigger",
          label: "Schedule Trigger",
          kind: "schedule",
          x: 0,
          y: 73,
        },
        {
          id: "fetchNewKeywordRows",
          label: "Fetch New Keyword Rows",
          kind: "sheets",
          x: 170,
          y: 73,
        },
        {
          id: "lockRowToProcessing",
          label: "Lock Row to Processing",
          sub: "update: sheet",
          kind: "sheets",
          x: 510,
          y: 73,
        },
        {
          id: "stripToOneItem",
          label: "Strip to One Item",
          kind: "filter",
          x: 340,
          y: 73,
        },
        {
          id: "generateArticle",
          label: "Generate Article",
          kind: "ai",
          x: 24,
          y: 328,
        },
        {
          id: "generateAnImage",
          label: "Generate an image",
          kind: "ai",
          x: 631,
          y: 255,
        },
        {
          id: "fetchPublishedPostIndex",
          label: "Fetch Published Post Index",
          sub: "getAll: post",
          kind: "http",
          x: 680,
          y: 73,
        },
        {
          id: "buildInternalLinkAllowlist",
          label: "Build Internal Link Allowlist",
          kind: "code",
          x: 1020,
          y: 73,
        },
        {
          id: "routeDuplicateKeywords",
          label: "Route Duplicate Keywords",
          kind: "if",
          x: 1190,
          y: 73,
        },
        {
          id: "markKeywordAsDuplicate",
          label: "Mark Keyword as Duplicate",
          sub: "update: sheet",
          kind: "sheets",
          x: 1409,
          y: 0,
        },
        {
          id: "extractRelatedPostURLs",
          label: "Extract Related Post URLs",
          kind: "code",
          x: 850,
          y: 73,
        },
        {
          id: "validateArticleAndStripBadLinks",
          label: "Validate Article and Strip Bad Links",
          kind: "code",
          x: 291,
          y: 328,
        },
        { id: "if", label: "If", kind: "if", x: 461, y: 328 },
        {
          id: "editImage",
          label: "Edit Image",
          sub: "resize: image",
          kind: "edit",
          x: 801,
          y: 255,
        },
        {
          id: "uploadImageToWPMedia",
          label: "Upload Image to WP Media",
          kind: "http",
          x: 971,
          y: 255,
        },
        {
          id: "createWPDraftPost",
          label: "Create WP Draft Post",
          kind: "http",
          x: 1141,
          y: 255,
        },
        {
          id: "routeApprovalDecision",
          label: "Route Approval Decision",
          kind: "if",
          x: 1651,
          y: 255,
        },
        {
          id: "checkDraftStatus",
          label: "Check Draft Status",
          kind: "http",
          x: 911,
          y: 510,
        },
        {
          id: "routeDraftStatus",
          label: "Route Draft Status",
          kind: "if",
          x: 1081,
          y: 510,
        },
        {
          id: "requestPublishApproval",
          label: "Request Publish Approval",
          sub: "sendAndWait: message",
          kind: "slack",
          x: 1481,
          y: 255,
        },
        {
          id: "publishPost",
          label: "Publish Post",
          kind: "http",
          x: 1251,
          y: 510,
        },
        {
          id: "notifyAborted",
          label: "Notify Aborted",
          kind: "slack",
          x: 1421,
          y: 510,
        },
        {
          id: "markStatusAsDRAFTED",
          label: "Mark status as DRAFTED",
          sub: "appendOrUpdate: sheet",
          kind: "sheets",
          x: 1311,
          y: 255,
        },
        {
          id: "notifyRejected",
          label: "Notify Rejected",
          kind: "slack",
          x: 1821,
          y: 170,
        },
        {
          id: "markStatusAsRejected",
          label: "Mark Status As Rejected",
          sub: "appendOrUpdate: sheet",
          kind: "sheets",
          x: 1991,
          y: 170,
        },
        {
          id: "markStatusAsPublished",
          label: "Mark Status As Published",
          sub: "appendOrUpdate: sheet",
          kind: "sheets",
          x: 1894,
          y: 510,
        },
        {
          id: "queueXPost",
          label: "Queue X Post",
          kind: "http",
          x: 1591,
          y: 510,
        },
        {
          id: "queueLinkedInPost1",
          label: "Queue LinkedIn Post1",
          kind: "http",
          x: 1761,
          y: 510,
        },
        {
          id: "markStatusAsFailed",
          label: "Mark Status as Failed",
          sub: "update: sheet",
          kind: "sheets",
          x: 631,
          y: 401,
        },
      ],
      edges: [
        { from: "scheduleTrigger", to: "fetchNewKeywordRows" },
        { from: "fetchNewKeywordRows", to: "stripToOneItem" },
        { from: "lockRowToProcessing", to: "fetchPublishedPostIndex" },
        { from: "stripToOneItem", to: "lockRowToProcessing" },
        { from: "generateArticle", to: "validateArticleAndStripBadLinks" },
        { from: "generateAnImage", to: "editImage" },
        { from: "fetchPublishedPostIndex", to: "extractRelatedPostURLs" },
        { from: "buildInternalLinkAllowlist", to: "routeDuplicateKeywords" },
        { from: "routeDuplicateKeywords", to: "markKeywordAsDuplicate" },
        { from: "routeDuplicateKeywords", to: "generateArticle" },
        { from: "extractRelatedPostURLs", to: "buildInternalLinkAllowlist" },
        { from: "validateArticleAndStripBadLinks", to: "if" },
        { from: "if", to: "generateAnImage" },
        { from: "if", to: "markStatusAsFailed" },
        { from: "editImage", to: "uploadImageToWPMedia" },
        { from: "uploadImageToWPMedia", to: "createWPDraftPost" },
        { from: "createWPDraftPost", to: "markStatusAsDRAFTED" },
        { from: "routeApprovalDecision", to: "notifyRejected" },
        { from: "routeApprovalDecision", to: "checkDraftStatus" },
        { from: "checkDraftStatus", to: "routeDraftStatus" },
        { from: "requestPublishApproval", to: "routeApprovalDecision" },
        { from: "routeDraftStatus", to: "publishPost" },
        { from: "publishPost", to: "notifyAborted" },
        { from: "notifyAborted", to: "queueXPost" },
        { from: "markStatusAsDRAFTED", to: "requestPublishApproval" },
        { from: "notifyRejected", to: "markStatusAsRejected" },
        { from: "queueXPost", to: "queueLinkedInPost1" },
        { from: "queueLinkedInPost1", to: "markStatusAsPublished" },
      ],
    },
  },
  sheet: {
    title: "Keywords",
    columns: [
      "Keyword",
      "Status",
      "WP Post ID",
      "Source",
      "Date Added",
      "Notes",
    ],
    rows: [
      [
        "how to introduce a new cat to your home",
        "Published",
        "3043",
        "Manual",
        "2026-09-04",
        "",
      ],
      [
        "diy enrichment toys for indoor cats",
        "Published",
        "3046",
        "Manual",
        "2026-09-04",
        "",
      ],
      [
        "cat scratching furniture solutions",
        "Published",
        "3052",
        "Manual",
        "2026-09-05",
        "",
      ],
    ],
    newRow: ["signs your rabbit is sick", "", "", "Manual", "2026-09-05", ""],
    wideColumns: [0, 1, 2, 3, 4],
    narrowColumns: [0, 1, 3],
  },
  slack: {
    workspace: "Pet Care Blog",
    channel: "content-approvals",
    channels: ["general", "content-approvals"],
    bot: "Content bot",
    approvedBy: "Kemi",
    approvedNote: "Published, and shared to X and LinkedIn through Buffer.",
    messages: [
      {
        time: "1:02 PM",
        title: "New draft ready to publish",
        meta: [
          ["Keyword", "signs your rabbit is sick"],
          ["Title", title],
          ["Length", "over 800 words, with a featured image"],
        ],
        items: [],
        notes: ["🔗 Preview the draft", "Publish puts it live and shares it."],
        buttons: true,
        buttonLabels: ["Abort", "Publish"],
      },
    ],
  },
  sites: {
    draft: {
      name: "WordPress",
      logo: "W",
      color: "#2271b1",
      dark: true,
      nav: ["Dashboard", "Posts", "Media", "Pages"],
      title: "Posts",
      blocks: [
        {
          kind: "table",
          columns: ["Title", "Status", "Featured image", "Date"],
          rows: [
            [title, "Draft", "rabbit.webp", "Sep 5, 2026"],
            [
              "Cat Scratching Furniture Solutions That Work",
              "Published",
              "cat-scratcher.webp",
              "Sep 5, 2026",
            ],
            [
              "DIY Enrichment Toys for Indoor Cats",
              "Published",
              "cat-toys.webp",
              "Sep 4, 2026",
            ],
            [
              "How to Introduce a New Cat to Your Home",
              "Published",
              "new-cat.webp",
              "Sep 4, 2026",
            ],
          ],
          highlight: [0],
          pill: 1,
        },
      ],
    },
    buffer: {
      name: "Buffer",
      logo: "B",
      color: "#2c4bff",
      nav: ["Publish", "Analyze", "Engage"],
      title: "Sent posts",
      blocks: [
        {
          kind: "list",
          rows: [
            {
              title:
                "Rabbits hide illness. Watch appetite, droppings and posture…",
              sub: "X · @Deemhorn · with the article link",
              avatar: "𝕏",
              mark: "ok",
              note: "sent",
            },
            {
              title:
                "The quiet rabbit isn't necessarily healthy. It may be the clearest sign…",
              sub: "LinkedIn · Daniel Awobodu · with the article link",
              avatar: "in",
              mark: "ok",
              note: "sent",
            },
          ],
        },
      ],
    },
    duplicate: {
      name: "WordPress",
      logo: "W",
      color: "#2271b1",
      dark: true,
      nav: ["Dashboard", "Posts", "Media", "Pages"],
      search: "signs your dog needs to see a vet immediately",
      title: "Is it already on the blog?",
      blocks: [
        {
          kind: "list",
          rows: [
            {
              title: "Your dog might need to see a Vet, if you see these signs",
              sub: "Published · title overlap with the keyword: 83%",
              mark: "no",
              note: "already covered: Duplicate",
            },
          ],
        },
        {
          kind: "fields",
          rows: [
            {
              label: "Keyword",
              value: "signs your dog needs to see a vet immediately",
            },
            { label: "Status in the sheet", value: "Duplicate", mark: "ok" },
            { label: "Words written", value: "0" },
          ],
        },
      ],
    },
    console: {
      name: "Search Console",
      logo: "GSC",
      color: "#1a73e8",
      nav: ["Overview", "Performance", "Pages"],
      title: "Performance · searches where the blog sits just off page one",
      blocks: [
        {
          kind: "table",
          columns: ["Search", "Impressions", "Position", "Already covered?"],
          rows: [
            ["care for pregnant cats", "85", "22.4", "no"],
            ["cat litter box smell", "45", "18.3", "no"],
            ["hamster cage size", "40", "19.7", "no"],
            ["signs your rabbit is sick", "31", "24.1", "yes: just published"],
            ["rabbit", "12", "61.0", "too broad"],
          ],
          highlight: [0, 1, 2],
        },
      ],
    },
  },
  post: {
    site: "quality-buy.online",
    title,
    image: "/demos/content-pipeline/rabbit.jpg",
    byline: "Written by admin in Rabbits",
    paragraphs: [
      "If you own a rabbit, knowing the signs your rabbit is sick can make the difference between a quick vet visit and a serious emergency. Rabbits hide illness well, so small shifts in appetite, droppings, posture or activity are often the first clues.",
      "## Signs your rabbit is sick: what to watch for",
      "Rabbits may show one or many of the signs below. None of these are diagnoses on their own, but each is a reason to pay attention and, in many cases, contact your veterinarian.",
    ],
    x: {
      name: "Ragingtone",
      handle: "@Deemhorn",
      time: "Sep 5",
      text: "Rabbits hide illness. Watch appetite, droppings and posture. A rabbit that stops eating or hides is giving an urgent signal. Learn clear checks and when to call your vet.",
    },
    linkedin: {
      name: "Daniel Awobodu",
      headline: "Online Marketer",
      time: "1d",
      text: "The quiet rabbit isn't necessarily healthy. It may be the clearest sign that something is wrong. Rabbits hide pain and illness, so owners often miss early symptoms until the problem is serious.",
    },
  },
  end: {
    headline: "One keyword in, a published, shared article out.",
    points: [
      { value: "800+", label: "words per article, illustrated and shared" },
      {
        value: "2",
        label: "duplicate topics caught in testing, before any writing",
      },
    ],
  },
  beats: [
    {
      scene: "sheet",
      duration: 5200,
      caption:
        "The blog owner types one keyword into a Google Sheet. That's the whole brief.",
    },
    {
      scene: "canvas",
      flow: "write",
      node: "validateArticleAndStripBadLinks",
      via: [
        "scheduleTrigger",
        "fetchNewKeywordRows",
        "stripToOneItem",
        "lockRowToProcessing",
        "fetchPublishedPostIndex",
        "extractRelatedPostURLs",
        "buildInternalLinkAllowlist",
        "routeDuplicateKeywords",
        "generateArticle",
      ],
      duration: 6000,
      caption:
        "Every hour, n8n takes the next keyword. AI writes the article and both social posts, and code checks the length, the links and the limits.",
      output: [
        ["length", "over 800 words"],
        ["links", "real posts only"],
      ],
    },
    {
      scene: "site",
      site: "draft",
      duration: 5400,
      caption:
        "The article and its AI-made image are saved in WordPress as a draft. Nothing is live yet.",
    },
    {
      scene: "slack",
      message: 0,
      approve: true,
      duration: 5600,
      caption: "A person reads the preview and presses Publish in Slack.",
    },
    {
      scene: "site",
      site: "buffer",
      duration: 5600,
      caption:
        "It checks nobody published it by hand, puts it live, and Buffer sends the X and LinkedIn posts.",
    },
    {
      scene: "post",
      mode: "article",
      label: "Reader’s browser · the blog",
      duration: 5600,
      caption:
        "The article is live, with its own illustration and links to related posts on the blog.",
    },
    {
      scene: "post",
      mode: "social",
      label: "X and LinkedIn",
      duration: 5600,
      caption:
        "On X it's short and direct. On LinkedIn it's longer and conversational.",
    },
    {
      scene: "site",
      site: "duplicate",
      duration: 6400,
      caption:
        "Another keyword overlaps 83% with a post the blog already has. It's marked Duplicate, and nothing is written.",
    },
    {
      scene: "site",
      site: "console",
      duration: 6400,
      caption:
        "Every Monday, Search Console shows searches where the blog sits just off page one. The best become new keywords.",
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "One keyword becomes a published, illustrated, shared article, with one approval in between.",
    },
  ],
};
