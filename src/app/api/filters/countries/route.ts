import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const countries = await prisma.countries.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(countries);
}
