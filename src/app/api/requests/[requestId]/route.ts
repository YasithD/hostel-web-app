import { deleteRequest, getHostels, getRequest, updateRequest } from "@/utils/db";
import { NextRequest } from "next/server";
import { HostelAllocation, Request } from "@/db/schema";

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
  const body = (await request.json()) as Partial<Request & { hostelAllocations: HostelAllocation[] }>;

  /* Request to update last viewed at time */
  if (!!body.last_viewed_at) {
    // Fix the mismatch in the type of last_viewed_at
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

    /* Request to update status */
  } else if (!!body.status) {
    const { status, hostelAllocations } = body;

    if (status === "approved" && hostelAllocations && hostelAllocations.length > 0) {
      try {
        const enrichedHostelAllocations = hostelAllocations.map((allocation) => {
          return { ...allocation, request_id: requestId };
        });
        const hostels = await getHostels();
        const hostelsWithUpdatedCapacities = [];
        for (const allocation of enrichedHostelAllocations) {
          const hostel = hostels.find((hostel) => hostel.id === allocation.hostel_id);
          if (hostel) {
            hostelsWithUpdatedCapacities.push({
              ...hostel,
              available_capacity: hostel.available_capacity - allocation.students_allocated,
            });
          }
        }

        const response = await updateRequest(requestId, {
          status,
          hostelAllocations: enrichedHostelAllocations,
          hostels: hostelsWithUpdatedCapacities,
        });
        return new Response(JSON.stringify(response), { status: 200 });
      } catch (error) {
        return new Response(JSON.stringify({ error: `Failed to add hostel allocations: ${error}` }), { status: 500 });
      }
    } else if (status === "rejected") {
      try {
        const response = await updateRequest(requestId, { status });
        return new Response(JSON.stringify(response), { status: 200 });
      } catch (error) {
        return new Response(JSON.stringify({ error: `Failed to delete hostel allocations: ${error}` }), {
          status: 500,
        });
      }
    }
  }
}
