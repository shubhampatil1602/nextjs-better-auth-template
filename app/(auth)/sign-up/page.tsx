import { SignUpForm } from "@/components/auth/signup-form";
import { authIsNotRequired } from "@/lib/auth/auth-utils";

export default async function SignUpPage() {
  await authIsNotRequired();
  return <SignUpForm />;
}
