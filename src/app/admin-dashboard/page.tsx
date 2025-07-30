import axiosInstance from "@/utils/axios";
import { Request } from "@/db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Status } from "@/components/request";

export default async function AdminDashboard() {
  const response = await axiosInstance.get("/api/requests");
  const data = response.data as Request[];

  return (
    <div className="flex flex-col gap-8 lg:mx-auto mx-4 mt-10 w-[580px] md:w-[1000px]">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-primary">Request History</h1>
        <p className="text-sm">View the requests and their status.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request Id</TableHead>
            <TableHead className="hidden md:table-cell">Requested By</TableHead>
            <TableHead className="hidden md:table-cell">Request Type</TableHead>
            <TableHead className="hidden md:table-cell">Requested Date</TableHead>
            <TableHead className="hidden md:table-cell">Last Updated</TableHead>
            <TableHead>Request Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request, index) => (
            <TableRow key={index}>
              <TableCell>{request.id}</TableCell>
              <TableCell className="hidden md:table-cell">{request.user_id}</TableCell>
              <TableCell className="hidden md:table-cell">
                {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
              </TableCell>
              <TableCell className="hidden md:table-cell">{format(request.created_at!, "PPP")}</TableCell>
              <TableCell className="hidden md:table-cell">{format(request.updated_at!, "PPP")}</TableCell>
              <TableCell>
                <Status status={request.status} />
              </TableCell>
              <TableCell>
                <Link href={`/admin-dashboard/${request.id}`}>
                  <Button variant="outline">More</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
