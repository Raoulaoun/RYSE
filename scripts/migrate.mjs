// Applies pending SQL migrations from ./drizzle. Runs as Railway's pre-deploy step.
// If ADMIN_EMAIL and ADMIN_NAME are set, also makes sure that partner can sign in.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const client = postgres(url, { max: 1 });
try {
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  console.log("Migrations applied");

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const name = process.env.ADMIN_NAME?.trim();
  if (email && name) {
    const added = await client`
      insert into admins (email, name) values (${email}, ${name})
      on conflict (email) do nothing
      returning id`;
    console.log(added.length ? `Admin added: ${name} <${email}>` : `Admin already exists: ${email}`);
  }
} finally {
  await client.end();
}
