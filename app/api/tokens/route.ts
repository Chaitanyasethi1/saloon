import { NextResponse } from "next/server";
import { DEMO_TOKENS } from "@/lib/seed/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const salonId = searchParams.get("salonId");

  let result = DEMO_TOKENS;
  if (salonId) {
    result = result.filter((t) => t.salonId === salonId);
  }

  return NextResponse.json({
    tokens: result,
    total: result.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { salonId, customerName, customerPhone, services, date } = body;

    if (!salonId || !customerName) {
      return NextResponse.json(
        { error: "salonId and customerName are required." },
        { status: 400 }
      );
    }

    const tokenNo = Math.floor(Math.random() * 20) + 15;
    const newToken = {
      id: `tkn-${Date.now()}`,
      salonId,
      customerName,
      customerPhone,
      tokenNo,
      date: date || new Date().toISOString().split("T")[0],
      status: "booked",
      estWaitMin: 20,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ token: newToken }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 500 });
  }
}

