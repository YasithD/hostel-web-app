import axiosInstance from "@/utils/axios";
import { Hostel } from "@/db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PencilIcon, PlusIcon } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

export default async function Hostels() {
  const { getToken } = await auth();
  const token = await getToken();
  const response = await axiosInstance.get("/api/v1/hostels", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = response.data as Hostel[];

  return (
    <div className="flex flex-col gap-8 lg:mx-auto mx-4 mt-10 w-[700px]">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-primary">Manage Hostels</h1>
          <p className="text-sm">View the hostels and their details.</p>
        </div>
        <Link href="/admin/dashboard/hostels/create">
          <Button>
            <PlusIcon size={16} />
            Add Hostel
          </Button>
        </Link>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Total Capacity</TableHead>
            <TableHead>Available Capacity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((hostel, index) => (
            <TableRow key={index}>
              <TableCell>{hostel.name}</TableCell>
              <TableCell>{hostel.type.charAt(0).toUpperCase() + hostel.type.slice(1)}</TableCell>
              <TableCell>{hostel.total_capacity}</TableCell>
              <TableCell>{hostel.available_capacity}</TableCell>
              <TableCell>
                <Link href={`/admin/dashboard/hostels/edit/${hostel.id}`}>
                  <Button variant="outline">
                    <PencilIcon size={16} />
                    Edit
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
