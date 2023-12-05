CREATE TABLE IF NOT EXISTS "Feedback" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar NOT NULL,
	"name" varchar NOT NULL,
	"createdAt" timestamp(3) DEFAULT now(),
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Prompts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar NOT NULL,
	"createdAt" timestamp(3) DEFAULT now(),
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL
);
