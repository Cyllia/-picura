import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "JWT secret is not configured" },
      { status: 500 }
    );
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username,
    },
    secret,
    { expiresIn: "7d" }
  );

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
    },
  });
}
