import { NextResponse } from "next/server";
import { getStorefrontSearchProducts } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getStorefrontSearchProducts();
  return NextResponse.json(
    { products },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
