import { User } from "@/db/schema";
import { isAdminUser } from "@/utils/auth";
import { addUser, getUsers } from "@/utils/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (!(await isAdminUser())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = (await req.json()) as User;

  try {
    const response = await addUser(body);
    if (response.success) {
      return new Response("User added successfully", { status: 201 });
    } else {
      return new Response("Failed to add user", { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to add user: ${error}` }), { status: 500 });
  }
}

export async function GET() {
  if (!(await isAdminUser())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const users = await getUsers();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to get users: ${error}` }), { status: 500 });
  }
}
