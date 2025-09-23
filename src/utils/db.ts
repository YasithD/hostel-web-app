import { type FormData } from "@/app/dashboard/request-accommodation/page";
import { db } from "@/db";
import {
  externalRequests,
  Hostel,
  HostelAllocation,
  hostelAllocations,
  hostels,
  internalRequests,
  requests,
  User,
  users,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "./uuid";
import {
  ACCOUNT_ACTIVATION_STATUS,
  REQUEST_UPDATE_ACTIONS,
  AccountActivationStatus,
  RequestAction,
  UserActions,
} from "@/types/db";

const submitInternalRequest = async (data: FormData) => {
  const requestId = createId()();
  return await db.batch([
    db.insert(requests).values({
      id: requestId,
      user_id: "1",
      type: "internal",
      male_student_count: data.maleStudentCount,
      female_student_count: data.femaleStudentCount,
      start_date: new Date(data.startDate),
      end_date: new Date(data.endDate),
    }),
    db.insert(internalRequests).values({
      request_id: requestId,
      faculty: data.faculty,
      academic_year: data.academicYear,
      semester: data.semester,
    }),
  ]);
};

const submitExternalRequest = async (data: FormData) => {
  const requestId = createId()();
  return await db.batch([
    db.insert(requests).values({
      id: requestId,
      user_id: "1",
      type: "external",
      male_student_count: data.maleStudentCount,
      female_student_count: data.femaleStudentCount,
      start_date: new Date(data.startDate),
      end_date: new Date(data.endDate),
    }),
    db.insert(externalRequests).values({
      request_id: requestId,
      institution: data.institution,
      reason: data.reason as "sports" | "event" | "other",
      other_reason: data.otherReason,
    }),
  ]);
};

export const submitRequest = async (data: FormData) => {
  if (data.typeOfStudent === "internal") {
    return await submitInternalRequest(data);
  } else {
    return await submitExternalRequest(data);
  }
};

export const getRequests = async () => {
  return await db.select().from(requests);
};

export const getRequest = async (requestId: string) => {
  const result = await db
    .select()
    .from(requests)
    .leftJoin(internalRequests, eq(requests.id, internalRequests.request_id))
    .leftJoin(externalRequests, eq(requests.id, externalRequests.request_id))
    .where(eq(requests.id, requestId));

  if (result.length > 0) {
    if (result[0].requests.type === "internal") {
      const { request_id, ...rest } = result[0].internal_requests!;
      return { ...result[0].requests, ...rest };
    } else {
      const { request_id, ...rest } = result[0].external_requests!;
      return { ...result[0].requests, ...rest };
    }
  } else {
    return [];
  }
};

export const deleteRequest = async (requestId: string) => {
  return await db.delete(requests).where(eq(requests.id, requestId));
};

export const updateRequest = async (requestId: string, action: RequestAction, data?: any) => {
  if (action === REQUEST_UPDATE_ACTIONS.APPROVE_REQUEST) {
    const allocations = data.hostelAllocations as HostelAllocation[];
    const hostelsWithUpdatedCapacities = data.hostels as Hostel[];

    return await db.batch([
      db.update(requests).set({ status: "approved", updated_at: new Date() }).where(eq(requests.id, requestId)),
      ...allocations.map((allocation) => db.insert(hostelAllocations).values(allocation)),
      ...hostelsWithUpdatedCapacities.map((hostel) =>
        db.update(hostels).set({ available_capacity: hostel.available_capacity }).where(eq(hostels.id, hostel.id))
      ),
    ]);
  } else if (action === REQUEST_UPDATE_ACTIONS.UPDATE_LAST_VIEWED_AT) {
    return await db.update(requests).set({ last_viewed_at: new Date() }).where(eq(requests.id, requestId));
  } else if (!!data) {
    return await db
      .update(requests)
      .set({ ...data, updated_at: new Date() })
      .where(eq(requests.id, requestId));
  }
};

export const getHostels = async () => {
  return await db.select().from(hostels);
};

export const addHostel = async (data: Hostel) => {
  return await db.insert(hostels).values(data);
};

export const updateHostel = async (id: string, data: any) => {
  return await db.update(hostels).set(data).where(eq(hostels.id, id));
};

export const deleteHostel = async (id: string) => {
  return await db.delete(hostels).where(eq(hostels.id, id));
};

export const deleteAllHostels = async () => {
  return await db.delete(hostels);
};

export const getHostelAllocations = async (requestId: string) => {
  return await db.select().from(hostelAllocations).where(eq(hostelAllocations.request_id, requestId));
};

export const addUser = async (data: User) => {
  return await db.insert(users).values(data);
};

export const getUsers = async () => {
  return await db.select().from(users);
};

const isAccountActivationStatus = (action: UserActions): action is AccountActivationStatus => {
  return Object.values(ACCOUNT_ACTIVATION_STATUS).includes(action);
};

export const updateUser = async (userId: string, action?: UserActions, data?: any) => {
  if (action && isAccountActivationStatus(action)) {
    return await db.update(users).set({ account_activation: action }).where(eq(users.id, userId));
  } else if (!!data) {
    return await db
      .update(users)
      .set({ ...data })
      .where(eq(users.id, userId));
  }
};
