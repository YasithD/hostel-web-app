import axiosInstance from "@/utils/axios";
import { Hostel } from "@/db/schema";
import HostelEditView from "@/components/Hostel/HostelEditView";
import { auth } from "@clerk/nextjs/server";

export default async function CreateHostel({ params }: { params: Promise<{ hostelId: string }> }) {
  const { hostelId } = await params;
  const { getToken } = await auth();
  const token = await getToken();

  const response = await axiosInstance.get(`/api/v1/hostels/${hostelId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = response.data as Hostel;

  return (
    <HostelEditView
      hostelId={hostelId}
      name={data.name}
      type={data.type}
      totalCapacity={data.total_capacity}
      availableCapacity={data.available_capacity}
    />
  );
}
