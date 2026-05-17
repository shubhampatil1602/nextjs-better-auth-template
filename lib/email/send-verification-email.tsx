import { Resend } from "resend";
import { VerificationEmail } from "@/components/email/verification-email";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailProps = {
  to: string;
  verificationUrl: string;
  userName: string;
};

export const sendVerificationEmailTemplate = async ({
  to,
  verificationUrl,
  userName,
}: EmailProps) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Welcome to BHAI CODE.",
    react: (
      <VerificationEmail
        verificationUrl={verificationUrl}
        userName={userName}
      />
    ),
  });
};
