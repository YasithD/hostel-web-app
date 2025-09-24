import axiosInstance from "@/utils/axios";
import { Hostel } from "@/db/schema";
import HostelEditView from "@/components/Hostel/HostelEditView";

export default async function CreateHostel({ params }: { params: Promise<{ hostelId: string }> }) {
  const { hostelId } = await params;

  const response = await axiosInstance.get(`/api/hostels/${hostelId}`);
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
