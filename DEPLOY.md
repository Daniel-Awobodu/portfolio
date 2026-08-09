# Putting the site online

Three stages: get the code to GitHub, connect GitHub to Vercel, then point your
own domain at it. Budget about 30 minutes the first time, plus waiting for the
domain to switch over.

Hosting is free. The domain costs roughly **$10–12 a year** and is the only
thing you pay for.

---

## Stage 1 — Get the code onto GitHub

Skip this if the code is already on GitHub.

1. Make a free account at **https://github.com** if you don't have one.
2. Click **+** (top right) → **New repository**.
3. Name it `portfolio`. Set it to **Private** if you prefer. **Do not** tick
   "Add a README" — the project already has one.
4. Click **Create repository**.
5. GitHub then shows you a page of commands. In your terminal, inside this
   project folder, run:

```bash
git init                 # skip if it says "already initialized"
git add .
git commit -m "My portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```

Refresh the GitHub page. Your files should be there.

---

## Stage 2 — Deploy on Vercel

1. Go to **https://vercel.com** and click **Sign Up**.
2. Choose **Continue with GitHub**. This is important — it's what lets Vercel
   see your code.
3. On your Vercel dashboard, click **Add New…** → **Project**.
4. Find `portfolio` in the list and click **Import**.
5. Change nothing. Vercel detects Next.js on its own — the framework, the build
   command, all of it. There are no environment variables to add.
6. Click **Deploy**.

Wait about a minute. You'll get a live address like
`portfolio-abc123.vercel.app`. Open it — the site is on the internet.

**From now on, this is automatic.** Every `git push` rebuilds and redeploys the
site in under a minute. You never touch Vercel again unless you're changing
domains.

---

## Stage 3 — Use your own domain

### 3a. Buy the domain

Buy **danielawobodu.com** from either:

- **Porkbun** — https://porkbun.com (usually the cheaper renewal price)
- **Namecheap** — https://www.namecheap.com

Search the name, add it to your cart, pay. Turn **on** free WHOIS privacy if
it's offered — it hides your home address from public lookups. You don't need
any of the upsells: no hosting, no email, no SSL (Vercel gives you HTTPS free).

### 3b. Tell Vercel about the domain

1. In Vercel, open your project → **Settings** → **Domains**.
2. Type `danielawobodu.com` and click **Add**.
3. Vercel asks whether you want `www` too — choose the option that redirects
   `www.danielawobodu.com` to `danielawobodu.com`. One address, no duplicates.
4. Vercel now shows you the exact DNS records to create. **Leave this page
   open** — you're about to copy from it. It will look like:

   | Type  | Name  | Value                   |
   | ----- | ----- | ----------------------- |
   | A     | `@`   | `76.76.21.21`           |
   | CNAME | `www` | `cname.vercel-dns.com`  |

   > Use the values **on your screen**, not the ones printed above. Vercel
   > changes them from time to time.

### 3c. Add those records at your registrar

**On Porkbun:** log in → **Domain Management** → click **DNS** next to your
domain.

**On Namecheap:** log in → **Domain List** → **Manage** → **Advanced DNS** tab.

Then, in either one:

1. Delete any existing records they created for you — usually a parking page or
   a "for sale" redirect. These will fight with yours.
2. Add the **A record** exactly as Vercel showed it: Type `A`, Host/Name `@`,
   Value = the IP address from Vercel.
3. Add the **CNAME record**: Type `CNAME`, Host/Name `www`, Value =
   `cname.vercel-dns.com` (or whatever Vercel showed).
4. Save.

### 3d. Wait

Go back to Vercel's Domains page. Within a few minutes it should flip from
"Invalid Configuration" to a green **Valid Configuration**. HTTPS switches
itself on shortly after.

DNS changes can take up to 48 hours to reach everywhere, though it's usually
10–30 minutes. If it hasn't worked after an hour, re-read the records — a typo
or a leftover parking record is the cause almost every time.

### 3e. Update the site's own address

One last thing, or your sitemap and social previews will still point at the old
URL. In `lib/site-config.ts`, check this line says your real domain:

```ts
url: "https://danielawobodu.com",
```

Then `git push`. Done.

---

## Afterwards

**Making a change:** edit files → `git add .` → `git commit -m "..."` →
`git push`. Live in about a minute.

**If a deploy fails:** Vercel emails you and the old version stays up — a broken
build never takes your site down. Open the deployment in Vercel and read the
build log; the error is usually the last few red lines. Run `npm run build`
locally to reproduce it.

**Rolling back:** Vercel → **Deployments** → find a working one → **⋯** →
**Promote to Production**.
