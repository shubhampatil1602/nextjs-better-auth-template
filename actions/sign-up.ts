"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/auth";

type SignUpProps = {
  email: string;
  password: string;
  name: string;
};

export async function signUp({ email, password, name }: SignUpProps) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    if (!existingUser.emailVerified) {
      await auth.api.sendVerificationEmail({
        body: {
          email,
        },
      });

      return {
        success: false,
        message:
          "Email already exists but is not verified. We've sent a new verification email.",
      };
    }

    return {
      success: false,
      message: "User already exists.",
    };
  }

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  return {
    success: true,
  };
}
