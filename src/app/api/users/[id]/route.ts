import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { publicUserSelect } from "@/lib/public-user-select";
import { parseRequiredNumber } from "@/lib/route-utils";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseRequiredNumber(idParam);

  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();
  const profileImage = body?.profile_image != null ? String(body.profile_image).trim() : undefined;
  const bio = body?.bio != null ? String(body.bio).trim() : undefined;
  const password = body?.password != null ? String(body.password) : undefined;

  if (!profileImage && !bio && !password) {
    return NextResponse.json(
      { error: "profile_image, bio or password is required" },
      { status: 400 }
    );
  }

  if (password && password.length < 8) {
    return NextResponse.json(
      { error: "password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.users.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

  const updatedUser = await prisma.users.update({
    where: { id },
    data: {
      profile_image: profileImage,
      bio,
      password_hash: passwordHash,
    },
    select: publicUserSelect,
  });

  return NextResponse.json(updatedUser);
}
