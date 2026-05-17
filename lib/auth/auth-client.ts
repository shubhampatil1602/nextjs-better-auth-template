import { createAuthClient } from "better-auth/react";
import {
  twoFactorClient,
  adminClient,
  usernameClient,
} from "better-auth/client/plugins";
import { ac, roles } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient(),
    adminClient({
      ac,
      roles,
    }),
    usernameClient(),
  ],
});
