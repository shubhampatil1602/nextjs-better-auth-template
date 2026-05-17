import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { authIsNotRequired } from "@/lib/auth/auth-utils";

export default async function ResetPasswordPage() {
  await authIsNotRequired();
  return <ResetPasswordForm />;
}
