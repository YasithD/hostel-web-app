import axiosInstance from "@/utils/axios";
import { Request } from "@/db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/request";

export default async function ViewRequests() {
  const response = await axiosInstance.get("/api/requests");
  const data = response.data as Request[];

  return (
    <div className="flex flex-col gap-8 lg:mx-auto mx-4 mt-10 w-[580px] md:w-[1000px]">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-primary">Request History</h1>
        <p className="text-sm">View all your requests and their status.</p>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Request Id</TableHead>
            <TableHead className="hidden md:table-cell">Requested Date</TableHead>
            <TableHead className="hidden md:table-cell">Last Updated</TableHead>
            <TableHead>Request Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request, index) => (
            <TableRow key={index}>
              <TableCell className="w-[150px] md:w-auto">{request.id}</TableCell>
              <TableCell className="hidden md:table-cell">{format(request.created_at!, "PPP")}</TableCell>
              <TableCell className="hidden md:table-cell">{format(request.updated_at!, "PPP")}</TableCell>
              <TableCell className="w-[200px] md:w-auto">
                <Status status={request.status} />
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/view-requests/${request.id}`}>
                  <Button variant="outline">View More</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
