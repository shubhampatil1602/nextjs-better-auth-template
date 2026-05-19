"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { redis } from "@/lib/redis";

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
      const key = `verify-email:${email}`;

      const cooldownExists = await redis.get(key);

      if (cooldownExists) {
        return {
          success: false,
          message: "Please wait before requesting another verification email.",
        };
      }

      await auth.api.sendVerificationEmail({
        body: {
          email,
        },
      });

      await redis.set(key, "1", {
        ex: 60,
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

  await redis.set(`verify-email:${email}`, "1", {
    ex: 60,
  });

  return {
    success: true,
  };
}
