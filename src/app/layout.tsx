import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import NotificationIcon from "@/public/notification_icon.svg";
import { Button } from "@/components/ui/button";
import LogoutBtn from "@/components/LogoutBtn";

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
    <ClerkProvider>
      <html lang="en">
        <body className={`${merriweather.variable} antialiased`}>
          <SignedIn>
            <div className="flex flex-col min-h-screen overflow-y-auto overflow-x-hidden">
              {/* Topbar */}
              <header className="flex w-full h-16 p-2 bg-white shadow-md flex-shrink-0">
                <div className="relative w-28 cursor-pointer">
                  <Link href="/admin/dashboard">
                    <Image src={Logo} alt="logo" fill />
                  </Link>
                </div>
                <div className="flex items-center justify-between gap-4 ml-auto">
                  {/* TODO: Replace with user name */}
                  <p className="hidden md:block mr-8 text-base font-medium text-gray-700">Hello, Yasith</p>
                  {/* Header content */}
                  <div className="hidden md:flex items-center gap-4 mr-8">
                    <Link href="/dashboard/view-requests">
                      <p className="text-base font-medium">Requests</p>
                    </Link>
                  </div>
                  {/* Notification bell */}
                  <div className="relative w-8 h-8">
                    <Image src={NotificationIcon} alt="bell" fill />
                  </div>
                  {/* Profile image */}
                  <Link href="/profile">
                    <div className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer" />
                  </Link>
                </div>
                {/* <LogoutBtn /> */}
              </header>
              {/* Main content area */}
              <main className="w-full overflow-x-auto">{children}</main>
              {/* Footer */}
              <footer className="flex items-center justify-center w-full h-10 px-4 border-t mt-auto">
                <p className="text-sm font-medium text-muted">© Copyright SUSL 2025. All rights reserved.</p>
              </footer>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex flex-col min-h-screen overflow-y-auto overflow-x-hidden">
              {children}
              {/* Footer */}
              <footer className="flex items-center justify-center w-full h-10 px-4 border-t mt-auto">
                <p className="text-sm font-medium text-muted">© Copyright SUSL 2025. All rights reserved.</p>
              </footer>
            </div>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
