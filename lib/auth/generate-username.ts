import crypto from "node:crypto";

export const generateUsername = (email: string) => {
  const emailPrefix = email.split("@")[0];

  const sanitizedPrefix = emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, "");

  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6);

  return `${sanitizedPrefix}_${suffix}`;
};
