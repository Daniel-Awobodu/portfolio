import type { Demo } from "@/lib/demos/types";

/*
 * The order alert build, as it really runs (see content/automation/
 * order-alerts.mdx and its Zapier screenshot): Gmail is checked every 15
 * minutes for emails matching the order search, and each match is sent to
 * WhatsApp. The order form fields and the alert follow the real ones. Every
 * name, number and amount here is sample data.
 */

const alert = [
  "First name",
  "Chioma",
  "Delivery Address",
  "14 Allen Avenue, Ikeja",
  "WhatsApp Number",
  "0803 ••• 5512",
  "Select State",
  "Lagos (Free delivery)",
  "Select Design",
  "DESIGN 3",
  "2-Seater Sofa Cover",
  "1 × 28000",
].join("\n");

export const orderAlerts: Demo = {
  slug: "order-alerts",
  journey: "from the buyer’s order to my partner’s WhatsApp",
  sceneLabels: {
    form: "Buyer’s phone",
    inbox: "Gmail inbox",
    zap: "The automation · Zapier",
    chat: "Partner’s phone",
    call: "Partner’s phone",
    end: "Done",
  },
  chat: { contact: "Daniel · Orders", status: "online", initials: "D" },
  form: {
    site: "quality-buy.online",
    product: "2-Seater Sofa Cover",
    price: "₦28,000",
    fields: [
      ["First name", "Chioma"],
      ["Delivery Address", "14 Allen Avenue, Ikeja"],
      ["WhatsApp Number", "0803 ••• 5512"],
      ["Select State", "Lagos (Free delivery)"],
      ["Select Design", "DESIGN 3"],
      ["2-Seater Sofa Cover", "1"],
    ],
    agree:
      "I agree to answer the confirmation call or WhatsApp, and accept delivery at the address provided.",
    button: "Place order",
    thanks: {
      title: "Thank you, Chioma!",
      body: "Your order has been received. We’ll call you to confirm it.",
    },
  },
  inbox: {
    count: "238",
    search: "Matching the order search",
    newEmail: {
      from: "Order Form",
      subject: "New order: 2-Seater Sofa Cover",
      snippet: "First name: Chioma · Delivery Address: 14 Allen Avenue…",
      time: "9:12 AM",
      order: true,
    },
    emails: [
      {
        from: "Ad account",
        subject: "Your weekly results summary",
        snippet: "Reach, clicks and cost per result for last week",
        time: "8:30 AM",
      },
      {
        from: "Order Form",
        subject: "New order: Home Safe",
        snippet: "First name: Bayo · Delivery Address: 3 Ring Road…",
        time: "7:58 AM",
        order: true,
      },
      {
        from: "Store tips",
        subject: "5 ways to win back past buyers",
        snippet: "This week’s newsletter for online sellers",
        time: "7:15 AM",
      },
      {
        from: "Supplier",
        subject: "New stock: bedcovers have arrived",
        snippet: "Collect from the warehouse from Thursday",
        time: "Yesterday",
      },
      {
        from: "Order Form",
        subject: "New order: Rice Bucket",
        snippet: "First name: Amaka · Delivery Address: 21 Aba Road…",
        time: "Yesterday",
        order: true,
      },
    ],
  },
  zap: {
    title: "New order to WhatsApp",
    steps: [
      {
        app: "Gmail",
        kind: "gmail",
        badge: "15 min",
        title: "1. New Email Matching Search",
      },
      {
        app: "WhatsApp Notifications and Alert",
        kind: "whatsapp",
        title: "2. Send WhatsApp Message",
      },
    ],
  },
  call: {
    name: "Chioma",
    initials: "C",
    sub: "Calling… · 0803 ••• 5512",
  },
  end: {
    headline: "Every order seen, without watching the inbox.",
    points: [
      { value: "2 hrs → 15 min", label: "for a new order to reach us" },
      { value: "0", label: "orders slipping through the cracks" },
    ],
  },
  beats: [
    {
      scene: "form",
      mode: "fill",
      duration: 7000,
      caption:
        "Chioma sees one of our ads and orders a sofa cover on the landing page.",
    },
    {
      scene: "form",
      mode: "thanks",
      duration: 2600,
      caption: "Her order is placed. Every order is paid on delivery.",
    },
    {
      scene: "inbox",
      mode: "arrive",
      duration: 4200,
      caption:
        "It arrives as an email in our Gmail inbox. Before, it could sit there unseen for up to two hours.",
    },
    {
      scene: "zap",
      step: 0,
      duration: 4400,
      caption:
        "Every 15 minutes, Zapier checks the inbox for new emails that match the order search.",
      output: [
        ["found", "1 new order email"],
        ["subject", "New order: 2-Seater Sofa Cover"],
        ["received", "9:12 AM"],
      ],
    },
    {
      scene: "inbox",
      mode: "match",
      duration: 3800,
      caption:
        "Only real orders match. Newsletters and other emails are ignored.",
    },
    {
      scene: "zap",
      step: 1,
      duration: 4000,
      caption: "The order details go straight into a WhatsApp message.",
      output: [
        ["to", "Partner’s WhatsApp"],
        ["name", "Chioma"],
        ["product", "2-Seater Sofa Cover"],
        ["price", "28000"],
      ],
    },
    {
      scene: "chat",
      duration: 5000,
      caption:
        "Within 15 minutes of the order, my partner has it on WhatsApp, with everything needed to call her.",
      messages: [
        { from: "them", typing: true, at: 0.04, until: 0.2, time: "9:24" },
        { from: "them", at: 0.2, time: "9:24", text: alert },
      ],
    },
    {
      scene: "call",
      mode: "outgoing",
      duration: 3400,
      caption: "He calls Chioma to confirm while she’s still keen to buy.",
    },
    {
      scene: "end",
      duration: 3200,
      caption: "From a new order to WhatsApp in 15 minutes, not two hours.",
    },
  ],
};
