import type { Demo } from "@/lib/demos/types";

/*
 * The script and voiceover generator, as it really runs (see
 * content/automation/script-voiceover.mdx and its screenshots). The canvas is
 * drawn from the workflow's export: real node names, connections and layout.
 * Most of the walkthrough shows what the creator would see: the sheet, a
 * trusted source, ElevenLabs, the Drive folder and the email. The run is the
 * real test for the Rogério Ceni short: its tag, its 113-word, 643-character
 * script, its file names and its sources. That topic's first try is the one
 * whose voice failed, with the script kept safe, before a clean re-run. The
 * source page's wording and the other rows are sample data.
 */

const topic =
  "Rogério Ceni, the goalkeeper who scored more goals than most strikers";
const tag = "SHORT-261120-0040-005";

export const scriptVoiceover: Demo = {
  slug: "script-voiceover",
  journey: "from a topic in a Google Sheet to a script and voiceover in Drive",
  sceneLabels: {
    sheet: "Shorts Queue · Google Sheets",
    canvas: "The script and voiceover workflow · n8n",
    site: "Trusted source",
    drive: "Shorts Assets · Google Drive",
    inbox: "Creator’s inbox · Gmail",
    end: "Done",
  },
  outputUnder: true,
  workflow: {
    nodes: [
      {
        id: "scheduleTrigger",
        label: "Schedule Trigger",
        kind: "schedule",
        x: 0,
        y: 416,
      },
      {
        id: "config",
        label: "Config",
        sub: "manual",
        kind: "edit",
        x: 170,
        y: 416,
      },
      {
        id: "readQueueRows",
        label: "Read Queue Rows",
        sub: "getAll: sheet",
        kind: "sheets",
        x: 340,
        y: 416,
      },
      {
        id: "limitRowsPerRun",
        label: "Limit Rows Per Run",
        kind: "filter",
        x: 511,
        y: 416,
      },
      {
        id: "checkTopic",
        label: "Check Topic",
        kind: "if",
        x: 681,
        y: 416,
      },
      {
        id: "claimRow",
        label: "Claim Row",
        sub: "update: sheet",
        kind: "sheets",
        x: 851,
        y: 291,
      },
      {
        id: "markStatusForReview",
        label: "Mark Status For Review",
        sub: "update: sheet",
        kind: "sheets",
        x: 851,
        y: 541,
      },
      {
        id: "writeScript",
        label: "Write Script",
        sub: "message a model",
        kind: "ai",
        x: 1021,
        y: 291,
      },
      {
        id: "mailAlertTopicNeedsReview",
        label: "mail Alert: Topic Needs Review",
        sub: "send: message",
        kind: "gmail",
        x: 1070,
        y: 541,
      },
      {
        id: "scriptGate1",
        label: "Script Gate 1",
        kind: "code",
        x: 1289,
        y: 291,
      },
      {
        id: "gate1Passed",
        label: "Gate 1 passed?",
        kind: "if",
        x: 1459,
        y: 291,
      },
      {
        id: "rewriteScript",
        label: "Rewrite Script",
        sub: "message a model",
        kind: "ai",
        x: 1629,
        y: 374,
      },
      {
        id: "scriptGate2",
        label: "Script Gate 2",
        kind: "code",
        x: 1897,
        y: 374,
      },
      {
        id: "gate2Passed",
        label: "Gate 2 Passed?",
        kind: "if",
        x: 2067,
        y: 374,
      },
      {
        id: "noOperationDoNothing",
        label: "No Operation, do nothing",
        kind: "edit",
        x: 2237,
        y: 166,
      },
      {
        id: "marksNeedsReview",
        label: "Marks Needs Review",
        sub: "update: sheet",
        kind: "sheets",
        x: 2237,
        y: 437,
      },
      {
        id: "createTopicFolder",
        label: "Create Topic Folder",
        sub: "create: folder",
        kind: "drive",
        x: 2408,
        y: 166,
      },
      {
        id: "emailAlertScriptNeedsReview",
        label: "Email Alert: Script Needs Review",
        sub: "send: message",
        kind: "gmail",
        x: 2408,
        y: 437,
      },
      {
        id: "saveScriptToDrive",
        label: "Save Script To Drive",
        sub: "createFromText: file",
        kind: "drive",
        x: 2578,
        y: 166,
      },
      {
        id: "writeScriptLinkToSheet",
        label: "Write Script Link to Sheet",
        sub: "update: sheet",
        kind: "sheets",
        x: 2748,
        y: 166,
      },
      {
        id: "makeVoice",
        label: "Make Voice",
        sub: "textToSpeech: speech",
        kind: "http",
        x: 2918,
        y: 166,
      },
      {
        id: "checkAudioOK",
        label: "Check Audio OK",
        kind: "if",
        x: 3089,
        y: 62,
      },
      {
        id: "saveAudioToDrive",
        label: "Save Audio to Drive",
        sub: "upload: file",
        kind: "drive",
        x: 3259,
        y: 0,
      },
      {
        id: "markVoiceFailed",
        label: "Mark Voice Failed",
        sub: "update: sheet",
        kind: "sheets",
        x: 3259,
        y: 291,
      },
      {
        id: "finishRow",
        label: "Finish Row",
        sub: "update: sheet",
        kind: "sheets",
        x: 3429,
        y: 0,
      },
      {
        id: "emailAlertVoiceFailed",
        label: "Email Alert: Voice Failed",
        sub: "send: message",
        kind: "gmail",
        x: 3429,
        y: 291,
      },
      {
        id: "alertVoiceoverDone",
        label: "alert: Voiceover Done",
        sub: "send: message",
        kind: "gmail",
        x: 3599,
        y: 0,
      },
    ],
    edges: [
      { from: "scheduleTrigger", to: "config" },
      { from: "config", to: "readQueueRows" },
      { from: "limitRowsPerRun", to: "checkTopic" },
      { from: "checkTopic", to: "claimRow", label: "true" },
      { from: "checkTopic", to: "markStatusForReview", label: "false" },
      { from: "readQueueRows", to: "limitRowsPerRun" },
      { from: "claimRow", to: "writeScript" },
      { from: "writeScript", to: "scriptGate1" },
      { from: "gate1Passed", to: "noOperationDoNothing", label: "true" },
      { from: "gate1Passed", to: "rewriteScript", label: "false" },
      { from: "rewriteScript", to: "scriptGate2" },
      { from: "scriptGate2", to: "gate2Passed" },
      { from: "gate2Passed", to: "noOperationDoNothing", label: "true" },
      { from: "gate2Passed", to: "marksNeedsReview", label: "false" },
      { from: "scriptGate1", to: "gate1Passed" },
      { from: "markStatusForReview", to: "mailAlertTopicNeedsReview" },
      { from: "marksNeedsReview", to: "emailAlertScriptNeedsReview" },
      { from: "noOperationDoNothing", to: "createTopicFolder" },
      { from: "saveScriptToDrive", to: "writeScriptLinkToSheet" },
      { from: "writeScriptLinkToSheet", to: "makeVoice" },
      { from: "makeVoice", to: "checkAudioOK" },
      { from: "makeVoice", to: "markVoiceFailed", label: "error" },
      { from: "checkAudioOK", to: "saveAudioToDrive", label: "true" },
      { from: "checkAudioOK", to: "markVoiceFailed", label: "false" },
      { from: "finishRow", to: "alertVoiceoverDone" },
      { from: "markVoiceFailed", to: "emailAlertVoiceFailed" },
      { from: "saveAudioToDrive", to: "finishRow" },
      { from: "createTopicFolder", to: "saveScriptToDrive" },
    ],
  },
  sites: {
    source: {
      name: "São Paulo FC",
      logo: "SP",
      color: "#d71920",
      nav: ["News", "Club", "History"],
      title: "Rogério Ceni's 100th goal",
      columns: true,
      blocks: [
        {
          kind: "text",
          title: "saopaulofc.net",
          meta: "Club history",
          lines: [
            "Rogério Ceni reached 100 goals in 2011, with a free-kick against Corinthians.",
            "São Paulo won the match 2-1.",
            "No goalkeeper in the world had scored as many.",
          ],
          find: { text: "100 goals in 2011", found: true },
        },
        {
          kind: "fields",
          title: "Fact kept, with its source",
          rows: [
            {
              label: "Fact",
              value: "100th goal, 2011, v Corinthians",
              mark: "ok",
            },
            { label: "Source", value: "São Paulo FC", mark: "ok" },
            {
              label: "Link",
              value: "saopaulofc.net/o-centesimo-gol…",
              mark: "ok",
            },
          ],
        },
      ],
    },
    voice: {
      name: "ElevenLabs",
      logo: "11",
      color: "#111111",
      nav: ["Text to Speech", "Voices", "History"],
      title: "Text to speech",
      columns: true,
      blocks: [
        {
          kind: "text",
          title: "Script",
          lines: [
            "One goalkeeper saved a penalty, then scored two goals to break a world record.",
            "Meet Rogério Ceni.",
            "In 2006 against Cruzeiro, he saved a spot-kick, curled a free-kick, then buried a penalty for 2-2.",
            "…",
          ],
        },
        {
          kind: "stats",
          items: [
            { label: "Characters", value: "643" },
            { label: "Model", value: "Multilingual v2" },
            { label: "Output", value: "MP3" },
            { label: "Length", value: "44 sec" },
          ],
        },
      ],
    },
  },
  drive: {
    path: ["My Drive", "Shorts Assets"],
    folders: [
      "The first World Cup in 1930",
      "The fastest goal in World Cup history",
      "Maradona’s Hand of God and Goal of the Century",
    ],
    newFolder: topic,
    open: topic,
    files: [
      {
        name: "SHORT-261120-0040-005_rog-rio-ceni-the-goalkeeper-who-scored-more-goals-_script.txt",
        size: "652 bytes",
        modified: "12:41 AM",
      },
    ],
    newFile: {
      name: "SHORT-261120-0040-005_rog-rio-ceni-the-goalkeeper-who-scored-more-goals-_voice.mp3",
      size: "682 KB",
      modified: "Just now",
    },
  },
  sheet: {
    title: "Shorts Queue",
    columns: [
      "Topic",
      "Facts",
      "Status",
      "Tag",
      "Script Link",
      "Audio Link",
      "Est. Duration",
      "Sources",
    ],
    rows: [
      [
        "The first World Cup in 1930",
        "Held in Uruguay in 1930. 13 teams took part.",
        "Done",
        "SHORT-261119-…",
        "drive.google.com/…",
        "drive.google.com/…",
        "45 sec (estimated)",
        "FIFA",
      ],
      [
        "The fastest goal in World Cup history",
        "Hakan Şükür scored after 11 seconds in 2002.",
        "Done",
        "SHORT-261119-…",
        "drive.google.com/…",
        "drive.google.com/…",
        "42 sec (estimated)",
        "FIFA, The Guardian",
      ],
    ],
    newRow: [topic, "", "", "", "", "", "", ""],
    wideColumns: [0, 1, 2, 3, 6],
    narrowColumns: [0, 2],
  },
  sheets: {
    done: {
      title: "Shorts Queue",
      columns: [
        "Topic",
        "Facts",
        "Status",
        "Tag",
        "Script Link",
        "Audio Link",
        "Est. Duration",
        "Sources",
      ],
      rows: [
        [
          "The first World Cup in 1930",
          "Held in Uruguay in 1930. 13 teams took part.",
          "Done",
          "SHORT-261119-…",
          "drive.google.com/…",
          "drive.google.com/…",
          "45 sec (estimated)",
          "FIFA",
        ],
        [
          "The fastest goal in World Cup history",
          "Hakan Şükür scored after 11 seconds in 2002.",
          "Done",
          "SHORT-261119-…",
          "drive.google.com/…",
          "drive.google.com/…",
          "42 sec (estimated)",
          "FIFA, The Guardian",
        ],
      ],
      newRows: [
        [
          topic,
          "",
          "Done",
          tag,
          "drive.google.com/…",
          "drive.google.com/…",
          "45 sec (estimated)",
          "São Paulo FC, BBC Sport",
        ],
      ],
      wideColumns: [0, 2, 3, 4, 5, 6, 7],
      narrowColumns: [0, 2, 7],
    },
  },
  inbox: {
    count: "3",
    emails: [],
    open: {
      from: "Agent",
      subject: "Voiceover Complete: " + topic,
      time: "12:41 AM",
      text: [
        "Your short is ready.",
        "Before you post: open the source links and check the facts.",
      ],
      brief: ["Your short is ready. Check the sources before you post."],
      body: [
        ["Tag", tag],
        ["Estimated length", "45 seconds"],
        ["Script", "drive.google.com/…/view"],
        ["Voiceover (MP3)", "drive.google.com/…/view"],
        ["Sources", "São Paulo FC, BBC Sport"],
      ],
    },
  },
  end: {
    headline: "One line in a sheet. A script and voiceover in about 2 minutes.",
    points: [
      {
        value: "~2 min",
        label: "per test run, from a topic to the email",
      },
      { value: "0", label: "scripts lost when the voice step failed" },
    ],
  },
  beats: [
    {
      scene: "sheet",
      duration: 6000,
      caption:
        "A creator types a topic into a Google Sheet and leaves Status empty. That's the whole job.",
    },
    {
      scene: "canvas",
      node: "claimRow",
      via: [
        "scheduleTrigger",
        "config",
        "readQueueRows",
        "limitRowsPerRun",
        "checkTopic",
      ],
      duration: 5600,
      caption:
        "On schedule, the workflow claims the next queued row and tags it, so it's never made twice.",
      output: [
        ["topic", "long enough"],
        ["tag", tag],
        ["status", "Processing"],
      ],
    },
    {
      scene: "site",
      site: "source",
      duration: 6400,
      caption:
        "The AI searches trusted sources only, like the club's own site, and keeps the link for every fact.",
    },
    {
      scene: "canvas",
      node: "scriptGate1",
      via: ["writeScript"],
      duration: 6000,
      caption:
        "Before any voice credits are spent, code checks the script: its length, no stray symbols, every number sourced.",
      output: [
        ["words", "113 (100 to 130)"],
        ["numbers", "8, all in sourced facts"],
        ["stray symbols", "none"],
        ["passed", "yes"],
      ],
    },
    {
      scene: "site",
      site: "voice",
      label: "Voiceover · ElevenLabs",
      duration: 5600,
      caption:
        "The approved script goes to ElevenLabs, which reads it out in a natural voice.",
    },
    {
      scene: "drive",
      duration: 6000,
      caption:
        "Script and MP3 land in their own folder in Drive, named with the tag, so one search finds both.",
    },
    {
      scene: "sheet",
      table: "done",
      duration: 5600,
      caption:
        "The row is marked Done, with both links, an estimated length and the sources.",
    },
    {
      scene: "inbox",
      mode: "open",
      duration: 5600,
      caption:
        "The creator gets an email: the short is ready, with sources to check before posting.",
    },
    {
      scene: "canvas",
      run: 1,
      node: "markVoiceFailed",
      via: ["makeVoice"],
      duration: 6000,
      caption:
        "If the voice step fails, the script is already saved and the row says why. Clearing it tries again.",
      output: [
        ["voice", "failed at ElevenLabs"],
        ["script", "already saved in Drive"],
        ["status", "Voice Failed"],
        ["to retry", "clear the Status cell"],
      ],
    },
    {
      scene: "end",
      duration: 3200,
      caption:
        "A topic in, a sourced script and voiceover out, in about 2 minutes.",
    },
  ],
};
