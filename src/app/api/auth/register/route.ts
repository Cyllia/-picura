import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const email = String(body?.email || "").trim().toLowerCase();
  const username = String(body?.username || "").trim();
  const password = String(body?.password || "");
  const firstName = body?.first_name ? String(body.first_name).trim() : null;

  if (!email || !username || !password) {
    return NextResponse.json(
      { error: "email, username and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const existing = await prisma.users.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "email or username already in use" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      email,
      username,
      password_hash: passwordHash,
      first_name: firstName,
    },
    select: {
      id: true,
      email: true,
      username: true,
      first_name: true,
      created_at: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
