import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";

export default function ResetPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {/* Topbar */}
        <header className="flex w-full h-16 p-2 flex-shrink-0">
          <div className="relative w-28">
            <Image src={Logo} alt="logo" fill />
          </div>
        </header>
        {/* Main content area */}
        <main className="w-full h-[calc(100vh-6.5rem)]">{children}</main>
      </div>
    </div>
  );
}
