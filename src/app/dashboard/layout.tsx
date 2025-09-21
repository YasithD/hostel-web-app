"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import NotificationIcon from "@/public/notification_icon.svg";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto overflow-x-hidden">
      {/* Topbar */}
      <header className="flex w-full h-16 p-2 bg-white shadow-md flex-shrink-0">
        <div className="relative w-28 cursor-pointer" onClick={() => router.push("/dashboard")}>
          <Image src={Logo} alt="logo" fill />
        </div>
        <div className="flex items-center justify-between gap-4 ml-auto">
          {/* TODO: Replace with user name */}
          <p className="hidden md:block mr-8 text-base font-medium text-gray-700">Hello, Yasith</p>
          {/* Header content */}
          <div className="hidden md:flex items-center gap-4 mr-8">
            <Link href="/dashboard/request-accommodation">
              <p className="text-base font-medium text-primary">New Request</p>
            </Link>
            <Link href="/dashboard/view-requests">
              <p className="text-base font-medium">My Requests</p>
            </Link>
          </div>
          {/* Notification bell */}
          <div className="relative w-8 h-8">
            <Image src={NotificationIcon} alt="bell" fill />
          </div>
          {/* Profile image */}
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        </div>
      </header>

      {/* Main content area */}
      <main className="w-full overflow-x-auto">{children}</main>

      {/* Footer */}
      <footer className="flex items-center justify-center w-full h-10 px-4 border-t mt-auto">
        <p className="text-sm font-medium text-muted">© Copyright SUSL 2025. All rights reserved.</p>
      </footer>
    </div>
  );
}
