CREATE TABLE `external_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`institution` text NOT NULL,
	`reason` text NOT NULL,
	`other_reason` text,
	FOREIGN KEY (`request_id`) REFERENCES `requests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `hostel_allocations` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`hostel_id` text NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `requests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`hostel_id`) REFERENCES `hostels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `hostels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`total_capacity` integer NOT NULL,
	`available_capacity` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `internal_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`faculty` text NOT NULL,
	`academic_year` text NOT NULL,
	`semester` text NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `requests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`male_student_count` integer NOT NULL,
	`female_student_count` integer NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`last_viewed_at` integer,
	`status` text DEFAULT 'pending' NOT NULL
);
