CREATE TYPE "role" AS ENUM('client', 'provider');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'client'::"role" NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "profession" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "abilities" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address_city" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address_state" text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();