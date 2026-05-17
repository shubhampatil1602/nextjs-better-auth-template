import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
}

export const OtpEmail = ({ otp }: OtpEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className='bg-white'>
        <Preview>Your login code for BHAI CODE.</Preview>
        <Container className='mx-auto p-5 pb-12'>
          <Text className='text-[16px] leading-6.5'>
            Please find your OTP code to login below.
          </Text>

          <Text className='text-[24px] leading-6.5'>{otp}</Text>

          <Text className='text-[12px]'>
            If you did not request a code, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
