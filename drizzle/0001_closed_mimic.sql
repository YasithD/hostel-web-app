CREATE TABLE `users` (
	`email` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`account_activation` text DEFAULT 'pending' NOT NULL
);
