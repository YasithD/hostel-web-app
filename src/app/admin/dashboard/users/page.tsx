import axiosInstance from "@/utils/axios";
import { User } from "@/db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Status } from "@/components/request";
import { auth } from "@clerk/nextjs/server";

export default async function Users() {
  const { getToken } = await auth();
  const token = await getToken();

  const response = await axiosInstance.get("/api/v1/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = response.data as User[];

  return (
    <div className="flex flex-col gap-8 lg:mx-auto mx-4 mt-10 w-[700px]">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-primary">Manage Users</h1>
        <p className="text-sm">View the users and their details.</p>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Account Activation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>
                <Status status={user.account_activation} userId={user.id} enableActions />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
