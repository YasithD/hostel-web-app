'use client';

import { useState } from 'react';
import { DASHBOARD_MENU_ITEMS } from '@/lib/constants';
import Image from 'next/image';
import NavItem from '@/components/dashboard/navItem';

export default function Dashboard() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar (hidden on small screens, visible on larger screens) */}
      <aside className="hidden md:flex md:w-56 h-full">
        <div className="p-4 space-y-16 w-full">
          <Image src="/logo.svg" alt="logo" width={160} height={75} />
          <ul className="space-y-4 w-full">
            {DASHBOARD_MENU_ITEMS.map((item) => (
              <div key={item.label}>
                <NavItem item={item} />
              </div>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-4 bg-gray-100">
        {/* Breadcrumb (visible on small screens) */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-4">
              <Image src="/menu.svg" alt="menu" width={30} height={30} onClick={toggleNav} className="cursor-pointer" />
              <Image src="/logo-v2.svg" alt="icon" width={70} height={30} />
            </div>
          </div>
          <nav aria-label="breadcrumb">
            <ul className="bg-white rounded-md p-2">
              {DASHBOARD_MENU_ITEMS.map((item) => (
                <div key={item.label}>
                  <NavItem item={item} center />
                </div>
              ))}
            </ul>
          </nav>
        </div>

        {/* Your main content goes here */}
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </main>
    </div>
  );
}
