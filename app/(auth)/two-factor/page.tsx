import { authIsNotRequired } from "@/lib/auth/auth-utils";
import { OtpCodeForm } from "@/components/auth/otp-code-form";

export default async function TwoFactorCodePage() {
  await authIsNotRequired();
  return <OtpCodeForm />;
}
