import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";
import { getDb, schema } from "@/lib/db";

// Streams an uploaded pitch deck. ?download=1 saves it instead of opening it.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await currentAdmin())) return new NextResponse("Sign in first", { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return new NextResponse("Not found", { status: 404 });
  const [deck] = await getDb().select().from(schema.applicationDecks).where(eq(schema.applicationDecks.id, id));
  if (!deck) return new NextResponse("Not found", { status: 404 });
  const download = request.nextUrl.searchParams.has("download");
  const name = encodeURIComponent(deck.filename);
  return new NextResponse(new Uint8Array(deck.data), {
    headers: {
      "content-type": deck.contentType,
      "content-length": String(deck.sizeBytes),
      "content-disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${name}`,
      "x-content-type-options": "nosniff",
      "cache-control": "private, no-store",
    },
  });
}
