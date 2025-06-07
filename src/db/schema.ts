import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { randomUUID } from "crypto";

// Define tables
export const requests = sqliteTable("requests", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  male_student_count: integer("male_student_count").notNull(),
  female_student_count: integer("female_student_count").notNull(),
  start_date: integer("start_date", { mode: "timestamp" }).notNull(),
  end_date: integer("end_date", { mode: "timestamp" }).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  last_viewed_at: integer("last_viewed_at", { mode: "timestamp" }),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
});

export const internalRequests = sqliteTable("internal_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  request_id: text("request_id")
    .notNull()
    .references(() => requests.id, { onDelete: "cascade" }),
  faculty: text("faculty").notNull(),
  academic_year: text("academic_year").notNull(),
  semester: text("semester").notNull(),
});

export const externalRequests = sqliteTable("external_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  request_id: text("request_id")
    .notNull()
    .references(() => requests.id, { onDelete: "cascade" }),
  institution: text("institution").notNull(),
  reason: text("reason", { enum: ["sports", "event", "other"] }).notNull(),
  other_reason: text("other_reason"),
});

export const hostels = sqliteTable("hostels", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  type: text("type", { enum: ["male", "female"] }).notNull(),
  total_capacity: integer("total_capacity").notNull(),
  available_capacity: integer("available_capacity").notNull(),
});

export const hostelAllocations = sqliteTable("hostel_allocations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  request_id: text("request_id")
    .notNull()
    .references(() => requests.id, { onDelete: "cascade" }),
  hostel_id: text("hostel_id")
    .notNull()
    .references(() => hostels.id, { onDelete: "cascade" }),
});

// Define relationships
export const requestsRelations = relations(requests, ({ one, many }) => ({
  internalRequest: one(internalRequests, {
    fields: [requests.id],
    references: [internalRequests.request_id],
  }),
  externalRequest: one(externalRequests, {
    fields: [requests.id],
    references: [externalRequests.request_id],
  }),
  hostelAllocations: many(hostelAllocations),
}));

export const internalRequestsRelations = relations(internalRequests, ({ one }) => ({
  request: one(requests, {
    fields: [internalRequests.request_id],
    references: [requests.id],
  }),
}));

export const externalRequestsRelations = relations(externalRequests, ({ one }) => ({
  request: one(requests, {
    fields: [externalRequests.request_id],
    references: [requests.id],
  }),
}));

export const hostelAllocationsRelations = relations(hostelAllocations, ({ one }) => ({
  request: one(requests, {
    fields: [hostelAllocations.request_id],
    references: [requests.id],
  }),
  hostel: one(hostels, {
    fields: [hostelAllocations.hostel_id],
    references: [hostels.id],
  }),
}));

export const hostelsRelations = relations(hostels, ({ many }) => ({
  hostelAllocations: many(hostelAllocations),
}));
