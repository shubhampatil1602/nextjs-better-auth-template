"use server";

import { authSession } from "@/lib/auth/auth-utils";
import { prisma } from "@/lib/db";

export async function getProfile() {
  const session = await authSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const findUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      email: true,
      image: true,
      name: true,
      twoFactorEnabled: true,
      username: true,
    },
  });

  return findUser;
}
