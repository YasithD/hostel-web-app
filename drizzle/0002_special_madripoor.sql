PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`account_activation` text DEFAULT 'pending' NOT NULL,
	PRIMARY KEY(`id`, `email`)
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "first_name", "last_name", "account_activation") SELECT "id", "email", "first_name", "last_name", "account_activation" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;