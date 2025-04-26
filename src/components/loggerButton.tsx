"use client";

import { SignedIn, UserButton } from "@clerk/clerk-react";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import React from "react";

export default function LoggerButton() {
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
