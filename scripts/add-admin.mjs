// Invites a partner to the admin panel: npm run admin:add -- email@ryseventure.com "Full Name"
import postgres from "postgres";

const [email, ...nameParts] = process.argv.slice(2);
const name = nameParts.join(" ").trim();
if (!email || !name) {
  console.error('Usage: npm run admin:add -- email@ryseventure.com "Full Name"');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
try {
  const [row] = await sql`
    insert into admins (email, name) values (${email.trim().toLowerCase()}, ${name})
    on conflict (email) do update set name = excluded.name
    returning id, email, name`;
  console.log(`Admin ready: ${row.name} <${row.email}>`);
} finally {
  await sql.end();
}
