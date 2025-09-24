import { Hostel } from "@/db/schema";
import { getHostel, updateHostel } from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { hostelId: string } }) {
  const { hostelId } = await params;
  try {
    const response = await getHostel(hostelId);
    if (response.length > 0) {
      return new Response(JSON.stringify(response[0]), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Hostel not found" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to get hostel: ${error}` }), { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { hostelId: string } }) {
  const { hostelId } = await params;
  const body = (await request.json()) as Hostel;
  try {
    const response = await updateHostel(hostelId, body);
    if (response?.success) {
      return new Response("Hostel updated successfully", { status: 200 });
    } else {
      return new Response("Failed to update hostel", { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to update hostel: ${error}` }), { status: 500 });
  }
}
