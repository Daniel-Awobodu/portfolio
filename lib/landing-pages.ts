/**
 * Landing pages shown in the marketing lane's gallery. Each one's mobile
 * capture lives in /public/case-studies/landing-pages/<slug>/ as numbered
 * JPEG tiles plus `thumb.jpg`; the tiles are found on disk at build time.
 *
 * `orders` is the entry count of the page's own order form, from the store's
 * forms screenshot. Leave it out when the count isn't on record.
 */
export type LandingPage = {
  slug: string;
  name: string;
  /** Month the page went up, as Daniel listed it. */
  date: string;
  orders?: number;
  /** What the page does well, in one line. Facts from the page itself. */
  note: string;
  /** Customer names or photos were blurred in the capture. */
  blurred?: boolean;
};

/* Pages with a recorded order count lead, biggest first; the rest follow,
   newest first. */
export const landingPages: LandingPage[] = [
  {
    slug: "bedsheets",
    blurred: true,
    name: "Waterproof bedcover",
    date: "January 2025",
    orders: 453,
    note: "Two free pillowcases with every bedcover, and a price that drops the more a buyer orders.",
  },
  {
    slug: "3d-rug",
    blurred: true,
    name: "3D rug",
    date: "January 2025",
    orders: 227,
    note: "Customer photos and a WhatsApp review, placed right above the order form.",
  },
  {
    slug: "wall-art",
    blurred: true,
    name: "3D wall art",
    date: "January 2025",
    orders: 155,
    note: "A free gift with every set, and a ₦5,000 discount if delivery is late.",
  },
  {
    slug: "marble-sheet",
    blurred: true,
    name: "3D marble sheet",
    date: "September 2025",
    orders: 73,
    note: "Product videos, four designs to choose from, and prices for one to six sheets.",
  },
  {
    slug: "auto-dispenser",
    name: "Automatic soap dispenser",
    date: "June 2026",
    note: "A step-by-step order and delivery journey that explains the ₦3,000 confirmation payment up front.",
  },
  {
    slug: "home-safe",
    blurred: true,
    name: "Mini home safe",
    date: "March 2026",
    note: "A dark, premium look with a full spec sheet, a setup video, and delivery times for Lagos and other states.",
  },
  {
    slug: "rice-bucket",
    blurred: true,
    name: "Rice bucket",
    date: "February 2026",
    note: "Built around one problem, weevils in stored grain, with a spec table and answers to common questions.",
  },
];
