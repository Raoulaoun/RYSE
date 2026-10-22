// Builds the marketing site as static files in out/ (no forms, no admin, no
// server). Parts that need a server are moved aside for the build and always
// put back afterwards.
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const ASIDE = ".static-aside";
const SERVER_ONLY = ["app/admin", "app/api", "app/(site)/apply", "app/(site)/partner", "components/admin", "proxy.ts"];

if (existsSync(ASIDE)) {
  console.error(`${ASIDE}/ exists from an interrupted build. Move its contents back first.`);
  process.exit(1);
}

const moved = [];
try {
  for (const p of SERVER_ONLY) {
    if (!existsSync(p)) continue;
    const dest = join(ASIDE, p);
    mkdirSync(dirname(dest), { recursive: true });
    renameSync(p, dest);
    moved.push(p);
  }
  rmSync(".next", { recursive: true, force: true });
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_FORMS: "off" },
  });
} finally {
  for (const p of moved.reverse()) renameSync(join(ASIDE, p), p);
  rmSync(ASIDE, { recursive: true, force: true });
  // Drop the export build's .next so the next regular build starts clean.
  rmSync(".next", { recursive: true, force: true });
}
console.log("Static site ready in out/");
