import { type FormData } from "@/app/dashboard/request-accommodation/page";
import { db } from "@/db";
import { externalRequests, internalRequests, requests } from "@/db/schema";
import { randomUUID } from "crypto";

const submitInternalRequest = async (data: FormData) => {
  const requestId = randomUUID();
  return await db.batch([
    db.insert(requests).values({
      id: requestId,
      user_id: "1",
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
  const requestId = randomUUID();
  return await db.batch([
    db.insert(requests).values({
      id: requestId,
      user_id: "1",
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
