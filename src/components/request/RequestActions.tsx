"use client";

import { Hostel } from "@/db/schema";
import { AllocationProps, HostelAllocationView } from "../Hostel";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";

type HostelSelectorProps = {
  requestId: string;
  maleStudentCount: number;
  femaleStudentCount: number;
  hostels: Hostel[];
  status: string;
};

export default function HostelSelector(props: HostelSelectorProps) {
  const { requestId, maleStudentCount, femaleStudentCount, hostels, status } = props;
  const router = useRouter();
  const [allocations, setAllocations] = useState<AllocationProps[]>([]);

  /* Approve actions */
  const handleApprove = async () => {
    await axiosInstance.put(`/api/requests/${requestId}`, {
      status: "approved",
      hostelAllocations: allocations.map((al) => ({
        hostel_id: al.hostelId,
        students_allocated: al.studentsAllocated,
        gender: al.gender,
      })),
    });
    router.push("/admin-dashboard");
  };

  /* Reject actions */
  const handleReject = async () => {
    await axiosInstance.put(`/api/requests/${requestId}`, { status: "rejected" });
    router.push("/admin-dashboard");
  };

  /* Delete actions */
  const handleDelete = async () => {
    await axiosInstance.delete(`/api/requests/${requestId}`);
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
            className="bg-green-500 hover:bg-green-600"
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button className="bg-red-500 hover:bg-red-600" onClick={handleReject}>
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
