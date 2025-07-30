import { Hostel } from "@/db/schema";
import { addHostel, deleteAllHostels, getHostels } from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const hostels = await getHostels();
    return new Response(JSON.stringify(hostels), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to get hostels: ${error}` }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Hostel;

  try {
    const response = await addHostel(body);
    if (response.success) {
      return new Response("Hostel added successfully", { status: 201 });
    } else {
      return new Response("Failed to add hostel", { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to get hostels: ${error}` }), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const response = await deleteAllHostels();
    if (response.success) {
      return new Response("Hostels deleted successfully", { status: 200 });
    } else {
      return new Response("Failed to delete hostels", { status: 500 });
    }
  } catch (error) {}
}
