import { User } from "@/db/schema";
import { addUser } from "@/utils/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
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
