import Image from 'next/image';
import Link from 'next/link';

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="flex items-center justify-center p-4">
                <Image src="/logo.svg" alt="logo" width={120} height={90} />
            </div>
            <div className="w-screen border-t border-border" />

            {/* Content */}
            <div className="flex-1">{children}</div>

            {/* Footer */}
            <div className="w-screen border-t border-border mt-auto" />
            <div className="flex items-center justify-center px-24 py-4 gap-8">
                <Link href="/help">
                    <p className="text-sm text-muted-foreground">Help/FAQ</p>
                </Link>
                <Link href="/contact">
                    <p className="text-sm text-muted-foreground">Contact Us</p>
                </Link>
                <p className="text-sm text-muted-foreground ml-auto">
                    &copy; 2025 Hostel Management System. All rights reserved.
                </p>
            </div>
        </div>
    );
}
