import { deleteRequest, getHostels, getRequest, updateRequest } from "@/utils/db";
import { NextRequest } from "next/server";
import { HostelAllocation, Request } from "@/db/schema";
import { REQUEST_UPDATE_ACTIONS, RequestAction } from "@/types/db";
import { isLoggedInUser } from "@/utils/auth";

export async function GET(request: NextRequest, { params }: { params: { requestId: string } }) {
  if (!isLoggedInUser()) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

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
  if (!isLoggedInUser()) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { requestId } = await params;
  try {
    const response = await deleteRequest(requestId);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to delete request: ${error}` }), { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { requestId: string } }) {
  if (!isLoggedInUser()) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { requestId } = await params;
  const body = (await request.json()) as { hostelAllocations?: HostelAllocation[]; action: RequestAction };
  const { action } = body;

  if (!action) {
    return new Response(JSON.stringify({ error: "Action is required" }), { status: 400 });
  }

  /* Request to update last viewed at time */
  if (action === REQUEST_UPDATE_ACTIONS.UPDATE_LAST_VIEWED_AT) {
    try {
      const response = await updateRequest(requestId, action);
      return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: `Failed to update request: ${error}` }), { status: 500 });
    }

    /* Request to update status */
  } else if (action === REQUEST_UPDATE_ACTIONS.APPROVE_REQUEST) {
    const { hostelAllocations } = body;

    if (!hostelAllocations || hostelAllocations.length === 0) {
      return new Response(JSON.stringify({ error: "Hostel allocations are required" }), { status: 400 });
    }

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

      const response = await updateRequest(requestId, action, {
        hostelAllocations: enrichedHostelAllocations,
        hostels: hostelsWithUpdatedCapacities,
      });
      return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: `Failed to add hostel allocations: ${error}` }), { status: 500 });
    }
  } else if (action === REQUEST_UPDATE_ACTIONS.REJECT_REQUEST) {
    try {
      const response = await updateRequest(requestId, action);
      return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: `Failed to delete hostel allocations: ${error}` }), {
        status: 500,
      });
    }
  }
}
