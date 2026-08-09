/**
 * ============================================================================
 * SITE CONFIG — THE ONE FILE YOU EDIT FOR CONTACT DETAILS
 * ============================================================================
 * Everything personal lives here: your phone number, email, social links and
 * your Web3Forms key. Change it once, it updates everywhere on the site.
 *
 * Search this file for `[` to find every placeholder still to be replaced.
 * ============================================================================
 */

export const site = {
  name: "Daniel Awobodu",
  /** Used for <title> suffixes and Open Graph. */
  shortName: "Daniel Awobodu",
  role: "AI Automation & E-commerce Growth",

  /** Verbatim promise line — the H1 subhead on the home page. */
  promise:
    "I build AI systems that sell your product and run your busywork, then show you exactly how they work.",

  /** Short strap that sits under the promise. */
  tagline: "Systems that sell. Explained simply.",

  /** Used for canonical URLs, sitemap.xml, robots.txt and Open Graph. */
  url: "https://danielawobodu.com",

  /** Default social share / meta description. */
  description:
    "Daniel Awobodu builds AI automation and e-commerce growth systems — and explains exactly how they work. Systems that sell. Explained simply.",

  credential: "B.Sc. Mathematics Education — University of Lagos, 2022.",

  experience: [
    { label: "Growth marketing", value: "5 years" },
    { label: "AI automation", value: "1 year" },
    { label: "Teaching maths", value: "2 years" },
  ],
} as const;

/**
 * ----------------------------------------------------------------------------
 * CONTACT — REPLACE EVERY PLACEHOLDER BELOW BEFORE LAUNCH
 * ----------------------------------------------------------------------------
 */
export const contact = {
  /**
   * WhatsApp: international format, digits only — no `+`, no spaces, and no
   * leading 0. The local number 0815 685 6758 becomes 234 815 685 6758.
   */
  whatsapp: "https://wa.me/2348156856758",

  /** Keep the `mailto:` prefix. */
  email: "mailto:awobodudaniel@gmail.com",

  linkedin: "https://www.linkedin.com/in/daniel-awobodu",

  /** Handle @deemhorn. x.com works for old twitter.com links too. */
  x: "https://x.com/deemhorn",
} as const;

/**
 * Rendered as labelled cards on /contact, /about and the home contact band,
 * and as the icon row in the footer. `icon` selects the glyph in
 * components/SocialIcon.tsx.
 */
export const contactLinks = [
  {
    label: "WhatsApp",
    href: contact.whatsapp,
    hint: "Fastest reply",
    external: true,
    icon: "whatsapp",
  },
  {
    label: "Email",
    href: contact.email,
    hint: "For briefs and docs",
    external: false,
    icon: "email",
  },
  {
    label: "LinkedIn",
    href: contact.linkedin,
    hint: "Let's connect",
    external: true,
    icon: "linkedin",
  },
  {
    label: "X",
    href: contact.x,
    hint: "I post builds here",
    external: true,
    icon: "x",
  },
] as const;

/**
 * ----------------------------------------------------------------------------
 * WEB3FORMS
 * ----------------------------------------------------------------------------
 * The contact form posts straight to Web3Forms, so there is no backend and it
 * works on Vercel's free tier.
 *
 * TO ACTIVATE:
 *   1. Go to https://web3forms.com
 *   2. Enter your email — they send you an access key, free, no account needed.
 *   3. Paste that key below, replacing YOUR_WEB3FORMS_KEY.
 *
 * The key is safe to commit: it only lets someone send mail TO you.
 */
export const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_KEY";

/** Global navigation. Order is deliberate: work first, then proof, then ask. */
export const navLinks = [
  { label: "Automation", href: "/automation" },
  { label: "Marketing", href: "/marketing" },
  { label: "How I Think", href: "/how-i-think" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
