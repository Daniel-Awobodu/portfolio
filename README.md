# Daniel Awobodu — Portfolio

Portfolio site for Daniel Awobodu, AI Automation & E-commerce Growth specialist.

**Systems that sell. Explained simply.**

The site has one job: get a visitor to message me on WhatsApp, email me, or
connect on LinkedIn/X after reading a case study. Every layout and copy decision
is made for that, not for looking clever.

---

## Run it on your computer.

You need [Node.js](https://nodejs.org) 20 or newer installed. Then, in a
terminal, inside this folder:

```bash
npm install     # once, the first time
npm run dev     # start the site
```

Open **http://localhost:3000**. Edits save and refresh automatically.

To check the real production build before deploying:

```bash
npm run build   # must finish with no errors
npm run start   # then open http://localhost:3000
```

---

## Where to edit things

| I want to change…                              | Edit this file                          |
| ---------------------------------------------- | --------------------------------------- |
| **My phone number, email, LinkedIn, X**        | `lib/site-config.ts`                    |
| **My Web3Forms key** (makes the form work)     | `lib/site-config.ts`                    |
| My promise line, tagline, credential           | `lib/site-config.ts`                    |
| My photo                                       | replace `public/daniel.jpg`             |
| Add a new case study                           | see `ADDING-A-CASE-STUDY.md`            |
| Home page copy                                 | `app/page.tsx`                          |
| About page copy / fun facts                    | `app/about/page.tsx`                    |
| How I Think page copy                          | `app/how-i-think/page.tsx`              |
| Lane intros (Automation / Marketing)           | `lib/content.ts` (the `LANES` object)   |
| Colours, fonts, spacing                        | `app/globals.css` (the `@theme` block)  |

**Almost everything personal lives in `lib/site-config.ts`.** Start there.

---

## Keys and services

There is exactly one key, and it is free.

### Web3Forms (the contact form)

The contact form posts directly to Web3Forms, so there is no backend, no
database and nothing to pay for.

1. Go to **https://web3forms.com**
2. Type in your email address. They send you an **access key**. No account
   needed.
3. Open `lib/site-config.ts` and replace `YOUR_WEB3FORMS_KEY` with it.

Until you do this, the form shows an orange "Setup needed" notice on the page so
you cannot forget. That notice disappears on its own once the key is in.

The key is safe to commit to GitHub — it only allows someone to send email *to*
you.

There are no `.env` files and no other environment variables to set.

---

## How the site is built

- **Next.js 16** (App Router, TypeScript) — every page is pre-rendered to static
  HTML at build time.
- **Tailwind CSS v4** — brand colours and fonts are defined once as CSS
  variables in `app/globals.css` and used through utility classes. No hex codes
  in components.
- **MDX files on disk** for case studies — no CMS, no database, no external
  service. Add a file, get a page.
- **Fraunces + Inter** via `next/font`, self-hosted at build time.
- **Vercel free tier** is all it needs.

```
app/            pages and routes
  [lane]/       /automation and /marketing, plus each case study page
components/     reusable UI (Nav, Footer, LaneCard, CaseStudyCard, StatRow…)
content/        the case studies — this is what you edit most
lib/
  site-config.ts   ← your contact details and keys
  content.ts       reads the MDX files off disk
public/         images (your photo, case study covers)
```

---

## The other docs

- **`ADDING-A-CASE-STUDY.md`** — how to publish a new build in 3 steps.
- **`DEPLOY.md`** — GitHub → Vercel → your own domain, in plain language.
- **`TODO-BEFORE-LAUNCH.md`** — every placeholder to replace before going live.
