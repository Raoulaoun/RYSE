import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { verifyDeckLink } from "@/lib/deck-link";
import { getDb, schema } from "@/lib/db";

export const runtime = "nodejs";

// Downloads a pitch deck from a signed link in a notification email.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const q = request.nextUrl.searchParams;
  if (!verifyDeckLink(id, Number(q.get("exp")), q.get("sig") ?? "")) {
    return new NextResponse("This link is invalid or has expired.", { status: 403 });
  }
  const [deck] = await getDb().select().from(schema.applicationDecks).where(eq(schema.applicationDecks.id, id));
  if (!deck) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(deck.data), {
    headers: {
      "content-type": deck.contentType,
      "content-length": String(deck.sizeBytes),
      "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(deck.filename)}`,
      "x-content-type-options": "nosniff",
      "cache-control": "private, no-store",
    },
  });
}
