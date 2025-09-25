import { UserActions } from "@/types/db";
import { isLoggedInUser } from "@/utils/auth";
import { updateUser } from "@/utils/db";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  if (!(await isLoggedInUser())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { userId } = await params;
  const body = (await request.json()) as { action?: UserActions; payload?: any };
  const { action, payload } = body;

  try {
    const response = await updateUser(userId, action, payload);
    if (response?.success) {
      return new Response("User updated successfully", { status: 200 });
    } else {
      return new Response("Failed to update user", { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to delete request: ${error}` }), { status: 500 });
  }
}
