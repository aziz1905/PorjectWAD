ALTER TABLE "userBiodata" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "userBiodata" ADD CONSTRAINT "userBiodata_user_id_unique" UNIQUE("user_id");