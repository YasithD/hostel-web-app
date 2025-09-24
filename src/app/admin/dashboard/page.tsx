"use client";

import { File, House, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full gap-8 p-10">
      <p className="text-2xl font-semibold text-primary">Admin Dashboard</p>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        <div className="flex items-center justify-center bg-gray-100 h-60">Graph 1</div>
        <div className="flex items-center justify-center bg-gray-100 h-60">Graph 2</div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="admin-dashboard-card" onClick={() => router.push("/admin/dashboard/hostels")}>
          <House className="self-center" size={32} />
          <p className="self-center text-lg font-semibold">Add/Edit Hostel</p>
          <p className="text-sm text-muted text-center">Add or edit hostels in the system.</p>
        </div>
        <div className="admin-dashboard-card" onClick={() => router.push("/admin/dashboard/users")}>
          <User className="self-center" size={32} />
          <p className="self-center text-lg font-semibold">Manage Users</p>
          <p className="text-sm text-muted text-center">Manage users in the system.</p>
        </div>
        <div className="admin-dashboard-card" onClick={() => router.push("/admin/dashboard/requests")}>
          <File className="self-center" size={32} />
          <p className="self-center text-lg font-semibold">Manage Requests</p>
          <p className="text-sm text-muted text-center">Manage requests in the system.</p>
        </div>
      </div>
    </div>
  );
}
