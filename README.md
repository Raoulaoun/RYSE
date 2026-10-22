# Ryse website

Marketing site and founder/partner intake for Ryse (ryseventure.com).

- **Next.js 16** (App Router, TypeScript)
- **Postgres** via Drizzle ORM. Founder applications, pitch decks and partner inquiries are stored here.
- Styles are the design's own CSS (`app/globals.css`), kept 1:1 with the approved design.
- Fonts (Space Grotesk, plus Unbounded for the admin) ship in `fonts/` (SIL Open Font License) and load with `next/font/local`, so builds never contact Google.

## Pages

| Route               | What it is                                                          |
| ------------------- | ------------------------------------------------------------------- |
| `/`                 | Home: hero, belief, thesis, philosophy, approach, leadership, portfolio, how it works, who can apply, FAQ |
| `/apply`            | Four-step founder application with pitch-deck upload                |
| `/apply?c=CODE`     | Same form, tagged with a campus campaign code                       |
| `POST /api/applications` | Saves an application (multipart, deck up to 15 MB). Returns `RYS-YYYY-NNNN` |
| `POST /api/partners`     | Saves a partner inquiry (JSON)                                  |
| `/partner`          | Partner form for universities, co-investors, corporates and mentors (`?type=` preselects) |
| `/portfolio/<slug>` | One page per portfolio company                                      |
| `/admin`            | Partner admin panel (sign-in required, and only when `ADMIN_ENABLED=true`) |

## Local development

```bash
npm install
cp .env.example .env         # point DATABASE_URL at a local Postgres
npm run db:migrate           # create tables
npm run dev                  # http://localhost:3000
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Admin panel

The panel is off unless `ADMIN_ENABLED=true`; while it's off, every `/admin` URL answers 404. Partners sign in at `/admin/login` with an emailed one-time link (valid 15 minutes, sessions last 30 days). Access is by invitation only.

The first partner comes from the `ADMIN_EMAIL` and `ADMIN_NAME` variables: each deploy makes sure that partner exists. Invite the others from **Settings**. Locally you can also run:

```bash
npm run admin:add -- raoul@ryseventure.com "Raoul Aoun"
```

What the panel does:

- **Dashboard**: new applications, the review queue, this week's pitches, and decisions due within the 48-hour promise.
- **Applications**: status tabs, search, filters by stage, sector, founder type, campaign and lead partner, and CSV export.
- **Application page**: founder and startup details, deck open/download, status, lead partner and pitch time, each partner's vote and note, history, and the decision email (preview, then send).
- **Pipeline**: a board where dragging a card changes its status. Accept, waitlist and decline only happen on the application page, so the founder always gets an answer.
- **Partner inquiries**: status, owner and an internal note, with WhatsApp and email reply.
- **Campaigns**: results per campaign code, plus a link builder for `/apply?c=CODE`.
- **Settings**: who has access, and whether email is on.

## Submission emails

Each new application and partner message is saved in the database and emailed to `NOTIFY_EMAIL` (e.g. hello@ryseventure.com), with every answer in the email. Replying goes straight to the founder or partner. Pitch decks aren't attached (Brevo caps attachments at 4 MB); the email has a private download link instead, signed with `DECK_LINK_SECRET` and valid for 180 days.

## Email

Email goes through [Brevo](https://www.brevo.com)'s transactional API: sign-in links, the confirmations the public forms promise, and decision emails. Set:

- `BREVO_API_KEY`: from Brevo, **SMTP & API → API keys**. Without it, emails are printed to the server log instead of sent (fine for local development).
- `MAIL_FROM`: defaults to `Ryse <hello@ryseventure.com>`. Authenticate `ryseventure.com` in Brevo (**Senders, domains & dedicated IPs → Domains**) so mail from it is delivered.
- In Brevo **Security → Authorised IPs**, turn off IP blocking for API keys. Render's and Railway's outgoing IPs can change, so a blocklist would reject the site's emails.
- `APP_URL`: the public site URL used in emailed links. Without it, Render's `RENDER_EXTERNAL_URL` or Railway's public domain is used.

## Database

Tables (see `lib/db/schema.ts`):

- `applications`: one row per founder application. `ref_no` is the reference shown to the founder. `status` defaults to `new`.
- `application_decks`: the uploaded deck (bytes, filename, type), one per application.
- `partner_inquiries`: university, co-investor and corporate/mentor messages, with owner, status and note.
- `admins`, `login_tokens`, `sessions`: partner access.
- `application_votes`: each partner's vote and private note per application.
- `application_events`: the history shown on each application.

To change the schema, edit `lib/db/schema.ts`, then run `npm run db:generate` and commit the new file in `drizzle/`. Migrations apply automatically on deploy.

## Free static site (no forms, no admin)

`npm run build:static` exports the marketing pages as plain files in `out/`: the home page and the nine portfolio pages. The forms, admin and server routes are left out, and every Apply and Partner button opens an email to hello@ryseventure.com instead.

On Render: **New → Static Site**, pick this repo and branch, then:

- Build command: `npm ci && npm run build:static`
- Publish directory: `out`
- Environment variable: `NODE_VERSION` = `22`

`render.yaml` describes the same thing as a Blueprint. Add `ryseventure.com` under **Settings → Custom Domains** and the DNS records Render shows.

## Deploying on Render with forms (paid)

`render.full.yaml` is a Render Blueprint for the full site and its database, with the admin panel off. Rename it to `render.yaml` to use it.

1. In Render, **New → Blueprint**, connect the GitHub repo, and pick this branch.
2. Render reads `render.yaml` and creates `ryse-web` (web service) and `ryse-db` (Postgres), both in Frankfurt. When asked for `BREVO_API_KEY`, paste your Brevo key.
3. Deploy. The start command applies migrations, then starts the site on Render's `PORT`.
4. Under the web service's **Settings → Custom Domains**, add `ryseventure.com` and `www.ryseventure.com`, then add the DNS records Render shows. Once it's live, set `APP_URL=https://ryseventure.com` so emailed links use your domain.

To turn the admin on later, set `ADMIN_ENABLED=true`, `ADMIN_EMAIL` and `ADMIN_NAME`, and redeploy.

## Deploying on Railway

1. Create a Railway project, then add a **PostgreSQL** database to it.
2. Add a service from this GitHub repo.
3. In the service's **Variables**, add `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`, `BREVO_API_KEY`, `APP_URL`, `NOTIFY_EMAIL`, `DECK_LINK_SECRET`, and for the admin `ADMIN_ENABLED=true`, `ADMIN_EMAIL` and `ADMIN_NAME`.
4. Deploy. `railway.json` already configures:
   - build: `npm run build`
   - pre-deploy: `npm run db:migrate`, which applies any pending migrations before the new version goes live
   - start: `npm start`, which listens on Railway's `PORT`
   - health check on `/`
5. Under **Settings → Networking**, generate a domain or attach `ryseventure.com`.
6. Sign in at `/admin` with `ADMIN_EMAIL`, then invite the other partners from **Settings**.
