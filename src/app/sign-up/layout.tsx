import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col relative">
        {/* Background Image */}
        <div className="-z-10 absolute inset-0 bg-login-image hidden md:block" />

        {/* Topbar */}
        <header className="flex w-full h-16 p-2 flex-shrink-0">
          <div className="relative w-28">
            <Image src={Logo} alt="logo" fill />
          </div>
          <div className="flex items-center justify-between gap-4 ml-auto">
            {/* Header content */}
            <div className="items-center gap-4 mr-8">
              <Link href="/login">
                <p className="text-base text-background font-medium bg-primary py-2 px-4 rounded-md">Login</p>
              </Link>
            </div>
          </div>
        </header>
        {/* Main content area */}
        <main className="w-full h-[calc(100vh-6.5rem)]">{children}</main>
      </div>
    </div>
  );
}
