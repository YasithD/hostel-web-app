"use client";

import { Hostel } from "@/db/schema";
import { AllocationProps, HostelAllocationView } from "../Hostel";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { REQUEST_UPDATE_ACTIONS } from "@/types/db";
import { useAuth } from "@clerk/nextjs";

type HostelSelectorProps = {
  requestId: string;
  maleStudentCount: number;
  femaleStudentCount: number;
  hostels: Hostel[];
  status: string;
};

export default function HostelSelector(props: HostelSelectorProps) {
  const { requestId, maleStudentCount, femaleStudentCount, hostels, status } = props;

  const { getToken } = useAuth();
  const token = getToken();
  const router = useRouter();
  const [allocations, setAllocations] = useState<AllocationProps[]>([]);

  /* Approve actions */
  const handleApprove = async () => {
    await axiosInstance.put(
      `/api/v1/requests/${requestId}`,
      {
        hostelAllocations: allocations.map((al) => ({
          hostel_id: al.hostelId,
          students_allocated: al.studentsAllocated,
          gender: al.gender,
        })),
        action: REQUEST_UPDATE_ACTIONS.APPROVE_REQUEST,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    router.push("/admin/dashboard");
  };

  /* Reject actions */
  const handleReject = async () => {
    await axiosInstance.put(
      `/api/v1/requests/${requestId}`,
      {
        action: REQUEST_UPDATE_ACTIONS.REJECT_REQUEST,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    router.push("/admin/dashboard");
  };

  /* Delete actions */
  const handleDelete = async () => {
    await axiosInstance.delete(`/api/v1/requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.push("/dashboard/view-requests");
  };

  return (
    <>
      <HostelAllocationView
        maleStudentCount={maleStudentCount}
        femaleStudentCount={femaleStudentCount}
        hostels={hostels}
        onSelect={setAllocations}
      />

      {status === "pending" && (
        <div className="flex gap-2">
          <Button
            disabled={allocations.length === 0}
            className="bg-success text-foreground-muted"
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button className="bg-danger text-foreground-muted" onClick={handleReject}>
            Reject
          </Button>
          <Button className="ml-auto" variant="outline" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </>
  );
}
