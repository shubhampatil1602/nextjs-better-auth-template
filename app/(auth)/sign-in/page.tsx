import { SignInForm } from "@/components/auth/signin-form";
import { authIsNotRequired } from "@/lib/auth/auth-utils";

export default async function SignInPage() {
  await authIsNotRequired();
  return <SignInForm />;
}
