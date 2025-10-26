"use server";

import { Body, Button, Container, Head, Heading, Html, Tailwind, Text } from "@react-email/components";

type EmailProps = {
  firstName: string;
  lastName: string;
};

export const PasswordReset = async ({ firstName, lastName }: EmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto rounded border border-border flex flex-col gap-4 items-center">
            <Heading as="h2">
              Welcome, {firstName} {lastName}!
            </Heading>
            <Text>
              Your request for creating an account in SUSL Hostel Management System has been approved. Please click the
              button below to reset your password.
            </Text>
            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL}/reset-password/send-code`}
              className="bg-[#6a1d19] text-sm text-white px-4 py-2 rounded-md"
            >
              Reset Password
            </Button>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordReset;
