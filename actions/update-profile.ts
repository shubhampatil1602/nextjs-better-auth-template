"use server";

import { prisma } from "@/lib/db";
import { authSession } from "@/lib/auth/auth-utils";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

type UpdateProfileProps = {
  name: string;
  image: string | null;
};

export async function updateProfile({ name, image }: UpdateProfileProps) {
  const session = await authSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      image: true,
    },
  });

  const oldImage = existingUser?.image;

  // delete old image if removed/replaced
  if (oldImage && oldImage !== image) {
    const fileKey = oldImage.split("/f/")[1];

    try {
      await utapi.deleteFiles(fileKey);
    } catch (error) {
      console.error("Failed to delete old image", error);
    }
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name,
      image,
    },
  });
}
