import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface RequestPasswordEmailProps {
  url: string;
  to: string;
}

export const RequestPasswordEmail = ({
  url,
  to,
}: RequestPasswordEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className='bg-white'>
        <Preview>Reset your password for BHAI CODE.</Preview>
        <Container className='mx-auto py-5 pb-12'>
          <Heading
            as='h1'
            className='mb-3 text-center text-[20px] font-semibold'
          >
            Hello
          </Heading>
          <Text className='text-[16px] leading-6.5'>
            We recieved a request to reset the password for BHAI CODE account
            associated with {to}
          </Text>
          <Section className='text-center'>
            <Button
              className='rounded-[3px] text-[16px] no-underline text-center block p-3'
              href={url}
            >
              Reset your password
            </Button>
          </Section>

          <Text className='text-[12px]'>
            If you did not request for password reset, you can safely ignore
            this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
