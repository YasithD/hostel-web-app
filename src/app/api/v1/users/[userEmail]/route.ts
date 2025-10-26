import { ACCOUNT_ACTIVATION_STATUS, UserActions } from "@/types/db";
import { isLoggedInUser } from "@/utils/auth";
import { updateUser } from "@/utils/db";
import { sendActivationEmail } from "@/utils/email";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { userEmail: string } }) {
  if (!(await isLoggedInUser())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { userEmail } = await params;
  const body = (await request.json()) as { action?: UserActions; payload?: any };
  const { action, payload } = body;

  try {
    const response = await updateUser(userEmail, action, payload);
    if (response?.success) {
      if (action === ACCOUNT_ACTIVATION_STATUS.ACTIVATION_SENT) {
        await sendActivationEmail(userEmail, payload.firstName, payload.lastName);
      }
      return new Response("User updated successfully", { status: 200 });
    } else {
      return new Response("Failed to update user", { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to delete request: ${error}` }), { status: 500 });
  }
}
