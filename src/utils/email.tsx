import { Resend } from "resend";
import PasswordResetEmail from "@/components/emails/PasswordReset";
import { clerkClient } from "@clerk/nextjs/server";
import { createPassword } from "./uuid";

const resend = new Resend(process.env.RESEND_API_KEY);

/* Send activation email */
export const sendActivationEmail = async (userEmail: string, firstName: string, lastName: string) => {
  try {
    /* Create user in Clerk */
    const client = await clerkClient();
    await client.users.createUser({
      emailAddress: [userEmail],
      firstName: firstName,
      lastName: lastName,
      password: createPassword()(),
    });

    /* Send activation email */
    /* TODO: Update the from email and to email addresses after configuring domain */
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "yasithplus@gmail.com",
      subject: "Welcome to SUSL Hostel Management System",
      react: <PasswordResetEmail firstName={firstName} lastName={lastName} />,
    });
  } catch (error) {
    console.error(">>> Error sending activation email: ", error);
    throw error;
  }
};
