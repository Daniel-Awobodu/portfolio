/**
 * Testimonials, in the giver's own words (copied from their WhatsApp
 * messages, trimmed with "…" only). `**…**` marks the line to emphasise.
 * Each one links to the original message as proof.
 */
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  /** Public page for the business, when the giver is happy to share one. */
  link?: { href: string; label: string };
  photo: string;
  /** Screenshot of the original message, opened full size as proof. */
  message: string;
  /** Shown on the home page. One string per paragraph. */
  quote: string[];
  /** Shorter quotes for the builds this person uses, keyed by build slug. */
  excerpts: Record<string, string>;
};

export const testimonials: Testimonial[] = [
  {
    id: "olaniyi-abraham",
    name: "Olaniyi Abraham",
    role: "Founder, SpotShop",
    link: { href: "https://spotshop.org", label: "spotshop.org" },
    photo: "/testimonials/olaniyi-abraham.jpg",
    message: "/testimonials/olaniyi-abraham-message.jpg",
    quote: [
      "I’m really loving the automation you built, **my orders now appear on my whatsapp even before I wake up in the morning** and I rarely miss out on new orders and I can confirm everything now within minutes of a customer placing their order.",
      "Also that other automation that keeps all my past customer data in one database has been very helpful. Even before I spend money on ads on a new product, I can always send the product to the customers in that database first to test the market and even get some orders from there before finally running the ads.",
    ],
    excerpts: {
      "order-alerts":
        "Before I had to open Gmail to copy the orders, and you know Gmail notifications is not instant… **now I see the orders within minutes they are placed**, I can reconfirm with the customers almost immediately and while buyers intent is still high.",
      "order-extraction":
        "Even before I spend money on ads on a new product, **I can always send the product to the customers in that database first** to test the market and even get some orders from there before finally running the ads.",
    },
  },
  {
    id: "adelaja",
    name: "Adelaja Olwatobi",
    role: "Business partner, Quality-Buy",
    photo: "/testimonials/adelaja.jpg",
    message: "/testimonials/adelaja-message.jpg",
    quote: [
      "The automation you built is really helping us out a lot. **I can respond to the customers almost immediately without needing to check Gmail for orders** most times.",
      "I even noticed that the customers that have incomplete details, without any way to reach or verify them, it filters them too. It saves stress a lot!!!",
    ],
    excerpts: {
      "order-alerts":
        "**I can respond to the customers almost immediately** without needing to check Gmail for orders most times… It saves stress a lot!!!",
    },
  },
];

/** Testimonials that mention a given build, with that build's excerpt. */
export function testimonialsFor(slug: string) {
  return testimonials
    .filter((t) => t.excerpts[slug])
    .map((t) => ({ ...t, quote: [t.excerpts[slug]] }));
}
