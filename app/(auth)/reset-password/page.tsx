import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { authIsNotRequired } from "@/lib/auth/auth-utils";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  await authIsNotRequired();
  const { token } = await searchParams;
  return <ResetPasswordForm token={token} />;
}
