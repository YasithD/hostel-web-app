import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootChildLayout from "@/components/RootChildLayout";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Hostel Management System",
  description: "A web application for managing hostel rooms",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/login">
      <html lang="en">
        <body className={`${merriweather.variable} antialiased`}>
          <RootChildLayout>{children}</RootChildLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
