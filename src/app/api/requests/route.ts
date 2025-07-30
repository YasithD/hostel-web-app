import { type FormData } from "@/app/dashboard/request-accommodation/page";
import { getRequests, submitRequest } from "@/utils/db";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as FormData;

  try {
    const response = await submitRequest(body);
    if (response[0].success && response[1].success) {
      return new Response("Request submitted successfully", { status: 201 });
    } else {
      return new Response("Failed to submit request", { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to submit request: ${error}` }), { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await getRequests();
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to get requests: ${error}` }), { status: 500 });
  }
}
