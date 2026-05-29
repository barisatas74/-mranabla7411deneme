import { NextResponse } from "next/server";
import { getStorefrontCategories } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = (await getStorefrontCategories())
    .filter((category) => category.status === "active")
    .map(({ id, name, slug }) => ({ id, name, slug }));

  return NextResponse.json(
    { categories },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
