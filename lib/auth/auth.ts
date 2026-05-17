import { betterAuth } from "better-auth";
import { admin, twoFactor, username } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "../db";
import { sendVerificationEmailTemplate } from "../email/send-verification-email";
import { sendOtpEmail } from "../email/send-otp-email";
import { sendResetPasswordEmail } from "../email/send-reset-password-email";
import { ac, roles } from "./permissions";
import { generateUsername } from "./generate-username";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendResetPasswordEmail({
        to: user.email,
        subject: "Reset your password",
        url,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmailTemplate({
        to: user.email,
        verificationUrl: url,
        userName: user.name,
      });
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      prompt: "select_account",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },

  rateLimit: {
    enabled: true,
    window: 10,
    max: 2,
  },

  plugins: [
    username(),
    admin({
      ac: ac,
      roles: roles,
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    nextCookies(),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }) {
          sendOtpEmail({ to: user.email, otp });
        },
      },
    }),
  ],

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              username: generateUsername(user.email),
              image: user.image ?? null,
            },
          };
        },
      },
    },
  },
});
