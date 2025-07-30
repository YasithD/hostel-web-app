import BreadcrumbView from "@/components/Breadcrumb";
import { HostelAllocationView } from "@/components/Hostel";
import {
  ApproveButton,
  DeleteButton,
  RejectButton,
  RequestDetailsSectionBody,
  RequestDetailsSection,
  RequestDetailsSectionItem,
  RequestDetailsSectionTitle,
} from "@/components/request";
import { ExternalRequest, Hostel, HostelAllocation, InternalRequest, Request } from "@/db/schema";
import axiosInstance from "@/utils/axios";

export default async function ViewRequest({ params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;

  /* Update last viewed at */
  await axiosInstance.put(`/api/requests/${requestId}`, {
    last_viewed_at: new Date().getTime(),
  });

  /* Get request details */
  const response = await axiosInstance.get(`/api/requests/${requestId}`);
  const data = response.data as Request & (InternalRequest | ExternalRequest);

  /* Get hostels */
  const hostelsResponse = await axiosInstance.get("/api/hostels");
  const hostels = hostelsResponse.data as Hostel[];

  /* Get hostel allocations */
  const hostelAllocationsResponse = await axiosInstance.get(`/api/allocations/${requestId}`);
  const hostelAllocations = hostelAllocationsResponse.data as HostelAllocation[];

  return (
    <div className="flex flex-col gap-8 lg:mx-auto mx-4 mt-10 w-[580px] md:w-[1000px]">
      <BreadcrumbView />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-primary">Request Details</h1>
        <p className="text-sm">View the details of your request.</p>
      </div>
      <RequestDetailsSection>
        <RequestDetailsSectionTitle>Request Metadata</RequestDetailsSectionTitle>
        <RequestDetailsSectionBody>
          <RequestDetailsSectionItem title="Request ID" value={data.id} />
          <RequestDetailsSectionItem title="Requested By" value={data.user_id} />
          <RequestDetailsSectionItem
            title="Request Type"
            value={data.type.charAt(0).toUpperCase() + data.type.slice(1)}
          />
          <RequestDetailsSectionItem
            title="Status"
            value={data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          />
          <RequestDetailsSectionItem title="Created At" value={new Date(data.created_at!).toLocaleString()} />
          <RequestDetailsSectionItem title="Updated At" value={new Date(data.updated_at!).toLocaleString()} />
          <RequestDetailsSectionItem title="Last Viewed At" value={new Date(data.last_viewed_at!).toLocaleString()} />
        </RequestDetailsSectionBody>
      </RequestDetailsSection>

      {data.type === "internal" && (
        <RequestDetailsSection>
          <RequestDetailsSectionTitle>Student Details</RequestDetailsSectionTitle>
          <RequestDetailsSectionBody>
            <RequestDetailsSectionItem title="Faculty" value={(data as InternalRequest).faculty} />
            <RequestDetailsSectionItem title="Department" value={(data as InternalRequest).academic_year} />
            <RequestDetailsSectionItem title="Semester" value={(data as InternalRequest).semester} />
          </RequestDetailsSectionBody>
        </RequestDetailsSection>
      )}

      {data.type === "external" && (
        <RequestDetailsSection>
          <RequestDetailsSectionTitle>Student Details</RequestDetailsSectionTitle>
          <RequestDetailsSectionBody>
            <RequestDetailsSectionItem title="Institute" value={(data as ExternalRequest).institution} />
            <RequestDetailsSectionItem title="Reason" value={(data as ExternalRequest).reason} />
            {(data as ExternalRequest).reason === "other" && (data as ExternalRequest).other_reason && (
              <RequestDetailsSectionItem title="Other Reason" value={(data as ExternalRequest).other_reason!} />
            )}
          </RequestDetailsSectionBody>
        </RequestDetailsSection>
      )}

      <RequestDetailsSection>
        <RequestDetailsSectionTitle>Accommodation Details</RequestDetailsSectionTitle>
        <RequestDetailsSectionBody>
          <RequestDetailsSectionItem title="Male Student Count" value={data.male_student_count.toString()} />
          <RequestDetailsSectionItem title="Female Student Count" value={data.female_student_count.toString()} />
          <RequestDetailsSectionItem title="Start Date" value={new Date(data.start_date!).toLocaleDateString()} />
          <RequestDetailsSectionItem title="End Date" value={new Date(data.end_date!).toLocaleDateString()} />
        </RequestDetailsSectionBody>
      </RequestDetailsSection>

      <HostelAllocationView
        maleStudentCount={data.male_student_count}
        femaleStudentCount={data.female_student_count}
        hostels={hostels}
        hostelAllocations={hostelAllocations}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Hostel Allocations</h2>
          <p className="text-sm">Allocate hostels to the students.</p>
        </div>
      </HostelAllocationView>

      {data.status === "pending" && (
        <div className="flex gap-2">
          <ApproveButton btnClassName="bg-green-500 hover:bg-green-600" requestId={requestId} />
          <RejectButton className="bg-red-500 hover:bg-red-600" requestId={requestId} />
          <DeleteButton className="ml-auto" variant="outline" requestId={requestId} />
        </div>
      )}
    </div>
  );
}
