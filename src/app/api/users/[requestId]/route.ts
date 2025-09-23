import { UserActions } from "@/types/db";
import { updateUser } from "@/utils/db";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { requestId: string } }) {
  const { requestId } = await params;
  const body = (await request.json()) as { action?: UserActions; data?: any };
  const { action, data } = body;

  try {
    const response = await updateUser(requestId, action, data);
    if (response?.success) {
      return new Response("User updated successfully", { status: 200 });
    } else {
      return new Response("Failed to update user", { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to delete request: ${error}` }), { status: 500 });
  }
}
