import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import NotificationIcon from "@/public/notification_icon.svg";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      {/* Topbar */}
      <header className="flex w-full h-16 p-2 bg-white shadow-md flex-shrink-0">
        <div className="relative w-28">
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
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
