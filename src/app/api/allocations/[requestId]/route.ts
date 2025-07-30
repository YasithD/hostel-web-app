import { getHostelAllocations } from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { requestId: string } }) {
  const { requestId } = await params;
  if (!requestId) {
    return new Response(JSON.stringify({ error: "Request ID is required" }), { status: 400 });
  }

  try {
    const allocations = await getHostelAllocations(requestId);
    return new Response(JSON.stringify(allocations), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to get allocations: ${error}` }), { status: 500 });
  }
}
