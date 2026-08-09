# Before you go live

Everything below is a placeholder shipped with the site. The site looks
finished with them in, but they are all clearly marked so you can find them.

**Fastest way to find every one:** search the whole project for `[` — real copy
never uses square brackets.

Work top to bottom. The first four sections are the ones that actually matter.

---

## 1. Contact details — **do this first**

Everything is in one file: **`lib/site-config.ts`**

- [ ] **WhatsApp number** — replace `[MY_NUMBER]` in
      `https://wa.me/[MY_NUMBER]`. International format, digits only, no `+`
      and no spaces. A Nigerian number looks like `2348012345678`.
- [ ] **Email** — replace `[MY_EMAIL]` in `mailto:[MY_EMAIL]`. Keep `mailto:`.
- [ ] **LinkedIn** — replace `[MY_LINKEDIN_URL]` with the full URL, including
      `https://`.
- [ ] **X** — replace `[MY_X_URL]` with the full URL, including `https://`.

> Test all four after deploying. A broken WhatsApp link is the single most
> expensive mistake on this site.

## 2. The contact form

- [ ] **Web3Forms key** — in the same file, replace `YOUR_WEB3FORMS_KEY`. Get
      one free in 30 seconds at **https://web3forms.com** (email address only,
      no account).
- [ ] Send yourself a test message from the live site and confirm it arrives.

Until the key is set, the form shows an orange "Setup needed" notice on the page.

## 3. Your photo

- [ ] Replace **`public/daniel.jpg`** with a real portrait. Keep the filename.
      Portrait orientation, roughly **4:5** (e.g. 1200 × 1500), face in the
      upper half. Shoot against a plain warm wall if you can — it will sit
      beautifully against the paper background.
- [ ] Replace **`public/daniel-thumb.jpg`** — same photo, cropped **square**,
      about 800 × 800. Used in the About teaser on the home page.
- [ ] Optional: replace **`public/og.png`** (1200 × 630). This is the preview
      card people see when your link is shared in WhatsApp, LinkedIn or X.

## 4. Your domain

- [ ] In `lib/site-config.ts`, confirm `url:` is your real domain. It controls
      the sitemap and every social share preview. See `DEPLOY.md`.

---

## 5. Case study placeholders

Four starter case studies ship with the site. Every number in them is a bracket
token — **no invented figures** — so nothing reads as a false claim while you
fill them in.

**A note on this:** replace the brackets with real numbers, or delete the metric
line entirely. The layout handles missing metrics cleanly. Never publish a
number you can't stand behind.

### `content/automation/lead-routing.mdx`

- [ ] `[CLIENT NAME]` (appears in the settings block and in the write-up)
- [ ] `[12h] → [4 min]`, `[300]+`, `[0 hrs]/week`
- [ ] `[12 hours]`, `[roughly a morning a week]` in the body
- [ ] `[ADD: what the client said…]` at the end

### `content/automation/content-pipeline.mdx`

- [ ] `[CLIENT NAME]`
- [ ] `[6 hrs] → [45 min]`, `[12]`
- [ ] `[about 6 hours]`, `[under 45 minutes]`, `[X out of 12]` in the body
- [ ] `[ADD: engagement or reach change…]`

### `content/marketing/ecommerce-scale.mdx`

This one is about your own store, so the client name is already real.

- [ ] `[ROAS: 0.0x]`, `[SPEND: ₦0]`, `[CPP: ₦0]`
- [ ] `[ADD: your current live figures…]`

### `content/marketing/sales-page-cvr.mdx`

- [ ] `[CLIENT NAME]`
- [ ] `[0.0%] → [0.0%]`, `[-0%]`
- [ ] `[3 months]`, `[7]`, `[3]`, `[0%]` in the body
- [ ] `[ADD: the exact before/after figures…]`

### Case study cover images (optional)

Each file has a commented-out `cover:` line. Without it, a clean typographic
card shows instead — that's a deliberate fallback, not a bug. To add covers:

- [ ] Put the image at `public/case-studies/<filename>/cover.jpg`
- [ ] Uncomment the `cover:` line in that file

Landscape, roughly 16:10, at least 1200px wide.

### Permission

- [ ] Confirm you have each client's OK to name them and publish their numbers.
      If not, `client: "Confidential — [industry]"` reads perfectly well.

---

## 6. Fun facts

- [ ] **`app/about/page.tsx`** — replace the five `[FUN FACT]` entries in the
      `funFacts` list near the top of the file. Keep them short and specific;
      these are what people remember.

---

## 7. Worth a read-through before launch

- [ ] Home page copy in `app/page.tsx` — the hero paragraph and the About teaser
      are written in your voice but not by you. Make them yours.
- [ ] `app/how-i-think/page.tsx` — check the teaching story matches how you
      actually describe it.
- [ ] `app/about/page.tsx` — the story section. Confirm the timeline reads the
      way you want it to.
- [ ] Lane intros in `lib/content.ts` (the `LANES` object).

---

## 8. Final checks on the live site

- [ ] Click all four contact links **on a phone**, not just on desktop.
- [ ] Send a test message through the form; confirm it arrives.
- [ ] Open every page on a phone and check nothing overflows sideways.
- [ ] Paste your link into a WhatsApp chat with yourself — check the preview
      card looks right.
- [ ] Search the project for `[` one last time.
- [ ] Run `npm run build` and confirm it finishes with no errors.

---

## Optional, later

- Client logos — there's a commented slot in the proof strip in `app/page.tsx`,
  right under the metrics row.
- Walkthrough videos — add `video: "https://www.loom.com/embed/…"` to any case
  study. Use the **/embed/** URL, not the share URL.
- Analytics — deliberately not installed. Vercel's own Analytics is one toggle
  in the Vercel dashboard if you want numbers without adding any code.
