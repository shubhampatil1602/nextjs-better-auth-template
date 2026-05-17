import { Resend } from "resend";
import { OtpEmail } from "@/components/email/otp-email";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailProps = {
  to: string;
  otp: string;
};

export const sendOtpEmail = async ({ to, otp }: EmailProps) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "OTP for login",
    react: <OtpEmail otp={otp} />,
  });
};
