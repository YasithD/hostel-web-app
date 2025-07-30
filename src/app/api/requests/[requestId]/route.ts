import { deleteRequest, getRequest, updateRequest } from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { requestId: string } }) {
  const { requestId } = await params;
  if (!requestId) {
    return new Response(JSON.stringify({ error: "Request ID is required" }), { status: 400 });
  }

  try {
    const response = await getRequest(requestId);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to get request: ${error}` }), { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { requestId: string } }) {
  const { requestId } = await params;
  try {
    const response = await deleteRequest(requestId);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to delete request: ${error}` }), { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { requestId: string } }) {
  const { requestId } = await params;
  const body = (await request.json()) as Partial<Request>;

  const enrichedBody = Object.fromEntries(
    Object.entries(body).map(([key, value]) => {
      if (key === "last_viewed_at") {
        return [key, new Date(value as string)];
      }
      return [key, value];
    })
  );

  try {
    const response = await updateRequest(requestId, enrichedBody);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to update request: ${error}` }), { status: 500 });
  }
}
