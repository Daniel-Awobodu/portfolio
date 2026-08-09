# Adding a new case study

Three steps. No design work, ever. Drop in a file, and the site builds the page,
adds it to the lane, sorts it, and links it — styled exactly like every other
case study.

---

## Step 1 — Copy the template

The template lives at **`content/_TEMPLATE.mdx`**.

Copy it into the folder for the lane you want:

- Automation work → **`content/automation/`**
- Marketing work → **`content/marketing/`**

Rename it to a short, lowercase, hyphenated name. **That name becomes the web
address.**

```
content/automation/whatsapp-order-bot.mdx   →   yoursite.com/automation/whatsapp-order-bot
```

Good names: `whatsapp-order-bot`, `invoice-automation`, `black-friday-ads`
Bad names: `Case Study 3.mdx`, `new_build FINAL.mdx`

---

## Step 2 — Fill in the top block, then the write-up

Open the file. The part between the two `---` lines at the top is the settings
block. Fill each line in — the template explains every one in comments.

```yaml
---
title: "WhatsApp order bot for a food brand"
client: "Mama's Kitchen"
lane: "automation" # must match the folder it's in
summary: "Customers order and pay in WhatsApp without anyone typing a reply."
role: "Built and deployed"
year: "2026"
date: "2026-02-14" # used for sorting
order: 1 # 1 = shows at the top of the lane page
featured: true # true = its top metric appears on the home page
tools: ["n8n", "WhatsApp Cloud API", "Paystack"]
metrics:
  - label: "Orders handled/day" # the FIRST metric is the one that
    value: "80+" # shows on cards and on the home page
  - label: "Reply time"
    value: "instant"
---
```

Two rules worth remembering:

- **`lane` must match the folder.** A file in `content/marketing/` needs
  `lane: "marketing"`.
- **Put your strongest number first** in `metrics`. That first one is what gets
  pulled onto the lane card and the home page proof strip.

Everything optional (`cover`, `video`, `metrics`) can be left out entirely. The
page still looks right — no gaps, no broken images.

Below the settings block, write the four sections. **Keep them, and keep them in
this order** — that consistency is the point:

1. **The problem** — in the client's own words
2. **What I built** — the system and the tools
3. **How it works, explained simply** — the teaching voice; this is the bit that
   sets the site apart
4. **The outcome** — numbers where you have them

---

## Step 3 — Add images, then commit

**Images (optional).** Make a folder named after your file and put them there:

```
public/case-studies/whatsapp-order-bot/cover.jpg
public/case-studies/whatsapp-order-bot/dashboard.jpg
```

Then in the settings block, uncomment and point to the cover:

```yaml
cover: "/case-studies/whatsapp-order-bot/cover.jpg"
```

(Note the path starts at `/case-studies/` — leave `public` out of it.)

To use a picture inside the write-up itself, just link it the same way:

```markdown
![The dashboard the team sees each morning](/case-studies/whatsapp-order-bot/dashboard.jpg)
```

**Then publish.** Check it looks right locally first:

```bash
npm run dev     # open http://localhost:3000/automation
```

Then push it:

```bash
git add .
git commit -m "Add WhatsApp order bot case study"
git push
```

Vercel rebuilds and deploys on its own, usually in under a minute. Nothing else
to do.

---

## Quick answers

**Want to reorder the lane page?** Change the `order` numbers. Lower sits
higher. Files sharing the same `order` fall back to newest `date` first.

**Want to hide something without deleting it?** Rename the file to start with an
underscore — `_draft-idea.mdx`. Files starting with `_` are never published.

**Adding a walkthrough video?** Use the *embed* URL, not the share URL:

```yaml
video: "https://www.loom.com/embed/abc123"   # ✅ /embed/
# not  https://www.loom.com/share/abc123     # ❌
```

**Nothing showed up?** Check three things, in this order: the file ends in
`.mdx`; it is in `content/automation/` or `content/marketing/`; and `lane:`
matches that folder.
