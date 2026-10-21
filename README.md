# Ryse website

Marketing site and founder/partner intake for Ryse (ryseventure.com).

- **Next.js 16** (App Router, TypeScript)
- **Postgres** via Drizzle ORM. Founder applications, pitch decks and partner inquiries are stored here.
- Styles are the design's own CSS (`app/globals.css`), kept 1:1 with the approved design.
- Fonts (Unbounded, Space Grotesk) are self-hosted at build time with `next/font`.

## Pages

| Route               | What it is                                                          |
| ------------------- | ------------------------------------------------------------------- |
| `/`                 | Home: hero, about, process, support, thesis, partners, portfolio, partner form, FAQ |
| `/apply`            | Four-step founder application with pitch-deck upload                |
| `/apply?c=CODE`     | Same form, tagged with a campus campaign code                       |
| `POST /api/applications` | Saves an application (multipart, deck up to 15 MB). Returns `RYS-YYYY-NNNN` |
| `POST /api/partners`     | Saves a partner inquiry (JSON)                                  |
| `/admin`            | Partner admin panel (sign-in required): dashboard, applications, pipeline, partner inquiries, campaigns, settings |

## Local development

```bash
npm install
cp .env.example .env         # point DATABASE_URL at a local Postgres
npm run db:migrate           # create tables
npm run dev                  # http://localhost:3000
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Admin panel

Partners sign in at `/admin/login` with an emailed one-time link (valid 15 minutes, sessions last 30 days). Access is by invitation only.

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

## Email

Email goes through [Brevo](https://www.brevo.com)'s transactional API: sign-in links, the confirmations the public forms promise, and decision emails. Set:

- `BREVO_API_KEY`: from Brevo, **SMTP & API → API keys**. Without it, emails are printed to the server log instead of sent (fine for local development).
- `MAIL_FROM`: defaults to `Ryse <hello@ryseventure.com>`. Authenticate `ryseventure.com` in Brevo (**Senders, domains & dedicated IPs → Domains**) so mail from it is delivered.
- In Brevo **Security → Authorised IPs**, turn off IP blocking for API keys. Railway's outgoing IP changes between deploys, so a blocklist would reject the site's emails.
- `APP_URL`: the public site URL used in emailed links. On Railway it falls back to the service's public domain.

## Database

Tables (see `lib/db/schema.ts`):

- `applications`: one row per founder application. `ref_no` is the reference shown to the founder. `status` defaults to `new`.
- `application_decks`: the uploaded deck (bytes, filename, type), one per application.
- `partner_inquiries`: university, co-investor and corporate/mentor messages, with owner, status and note.
- `admins`, `login_tokens`, `sessions`: partner access.
- `application_votes`: each partner's vote and private note per application.
- `application_events`: the history shown on each application.

To change the schema, edit `lib/db/schema.ts`, then run `npm run db:generate` and commit the new file in `drizzle/`. Migrations apply automatically on deploy.

## Deploying on Railway

1. Create a Railway project, then add a **PostgreSQL** database to it.
2. Add a service from this GitHub repo.
3. In the service's **Variables**, add `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`, `BREVO_API_KEY`, `APP_URL`, `ADMIN_EMAIL` and `ADMIN_NAME`.
4. Deploy. `railway.json` already configures:
   - build: `npm run build`
   - pre-deploy: `npm run db:migrate`, which applies any pending migrations before the new version goes live
   - start: `npm start`, which listens on Railway's `PORT`
   - health check on `/`
5. Under **Settings → Networking**, generate a domain or attach `ryseventure.com`.
6. Sign in at `/admin` with `ADMIN_EMAIL`, then invite the other partners from **Settings**.
