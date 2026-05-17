import { RequestPasswordForm } from "@/components/auth/request-password-form";
import { authIsNotRequired } from "@/lib/auth/auth-utils";

export default async function RequestPasswordPage() {
  await authIsNotRequired();
  return <RequestPasswordForm />;
}
