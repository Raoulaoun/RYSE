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

## Local development

```bash
npm install
cp .env.example .env         # point DATABASE_URL at a local Postgres
npm run db:migrate           # create tables
npm run dev                  # http://localhost:3000
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Database

Tables (see `lib/db/schema.ts`):

- `applications`: one row per founder application. `ref_no` is the reference shown to the founder. `status` defaults to `new`.
- `application_decks`: the uploaded deck (bytes, filename, type), one per application.
- `partner_inquiries`: university, co-investor and corporate/mentor messages.

To change the schema, edit `lib/db/schema.ts`, then run `npm run db:generate` and commit the new file in `drizzle/`. Migrations apply automatically on deploy.

## Deploying on Railway

1. Create a Railway project, then add a **PostgreSQL** database to it.
2. Add a service from this GitHub repo.
3. In the service's **Variables**, add `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`.
4. Deploy. `railway.json` already configures:
   - build: `npm run build`
   - pre-deploy: `npm run db:migrate`, which applies any pending migrations before the new version goes live
   - start: `npm start`, which listens on Railway's `PORT`
   - health check on `/`
5. Under **Settings → Networking**, generate a domain or attach `ryseventure.com`.

You can browse submissions from the Postgres service's **Data** tab in Railway.
