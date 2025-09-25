"use client";

import { Link } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import NotificationIcon from "@/public/notification_icon.svg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootChildLayout({ children }: { children: React.ReactNode }) {
  const [displayProfileDropdown, setDisplayProfileDropdown] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const closeProfileDropdown = () => {
      if (!displayProfileDropdown) return;
      setDisplayProfileDropdown(false);
    };

    document.addEventListener("click", closeProfileDropdown);
    return () => {
      document.removeEventListener("click", closeProfileDropdown);
    };
  }, [displayProfileDropdown]);

  return (
    <>
      {!isLoaded || !isSignedIn ? (
        <div className="flex flex-col min-h-screen overflow-y-auto overflow-x-hidden">
          {children}
          {/* Footer */}
          <footer className="flex items-center justify-center w-full h-10 px-4 border-t mt-auto">
            <p className="text-sm font-medium text-muted">© Copyright SUSL 2025. All rights reserved.</p>
          </footer>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen overflow-y-auto overflow-x-hidden">
          {/* Topbar */}
          <header className="flex w-full h-16 p-2 bg-white shadow-md flex-shrink-0">
            <div className="relative w-28 cursor-pointer" onClick={() => router.push("/dashboard")}>
              <Image src={Logo} alt="logo" fill />
            </div>
            <div className="flex items-center justify-between gap-4 ml-auto">
              {/* TODO: Replace with user name */}
              <p className="hidden md:block mr-8 text-base font-medium text-gray-700">Hello, {user?.firstName}</p>
              {/* Header content */}
              <p
                className="hidden md:block text-base font-medium mr-8 cursor-pointer"
                onClick={() => router.push("/dashboard/view-requests")}
              >
                Requests
              </p>
              {/* Notification bell */}
              <div className="relative w-8 h-8">
                <Image src={NotificationIcon} alt="bell" fill />
              </div>
              {/* Profile image */}
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary cursor-pointer relative"
                onClick={() => setDisplayProfileDropdown(!displayProfileDropdown)}
              >
                <p className="text-base font-medium text-primary select-none">
                  {user?.firstName!.charAt(0) + user?.lastName!.charAt(0)}
                </p>
                {displayProfileDropdown && (
                  <div className="absolute -bottom-1 right-0 translate-y-full w-40 z-10 bg-background border rounded-md">
                    <div
                      className="cursor-pointer hover:bg-accent rounded-t-md p-4"
                      onClick={() => router.push("/profile")}
                    >
                      <p className="text-sm font-semibold select-none">View Profile</p>
                    </div>
                    <div
                      className="cursor-pointer bg-secondary hover:bg-secondary-foreground hover:text-background rounded-b-md p-4"
                      onClick={() => signOut()}
                    >
                      <p className="text-sm font-semibold select-none">Logout</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          {/* Main content area */}
          <main className="w-full overflow-x-auto">{children}</main>
          {/* Footer */}
          <footer className="flex items-center justify-center w-full h-10 px-4 border-t mt-auto">
            <p className="text-sm font-medium text-muted">© Copyright SUSL 2025. All rights reserved.</p>
          </footer>
        </div>
      )}
    </>
  );
}
