import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  return NextResponse.json(
    { user },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
