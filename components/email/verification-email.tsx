import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  verificationUrl: string;
  userName: string;
  appName?: string;
}

export const VerificationEmail = ({
  verificationUrl,
  userName,
  appName = "AUTH TEMPLATE.",
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className='bg-white'>
        <Preview>Verify your email for {appName}</Preview>
        <Container className='mx-auto py-5 pb-12'>
          <Text className='text-[16px] leading-6.5'>Hi {userName},</Text>
          <Text className='text-[16px] leading-6.5'>
            Welcome to AUTH TEMPLATE. Thank you for signing up in {appName}{" "}
            Please confirm your email address by clicking the button below.
          </Text>
          <Section className='text-center'>
            <Button
              className='bg-foreground rounded-[3px] text-[16px] no-underline text-center block p-3'
              href={verificationUrl}
            >
              Verify your email
            </Button>
          </Section>

          <Text className='text-[12px]'>
            If you did not create an account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
