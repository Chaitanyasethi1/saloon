import { NextResponse } from "next/server";
import { DEMO_SALONS } from "@/lib/seed/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const query = searchParams.get("q");

  let result = DEMO_SALONS;

  if (city && city !== "all") {
    result = result.filter((s) => s.city.toLowerCase() === city.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    salons: result,
    total: result.length,
  });
}

