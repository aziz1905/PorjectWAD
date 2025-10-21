CREATE TABLE "userBiodata" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "userBiodata_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"phone" varchar NOT NULL,
	"address" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userBiodata" ADD CONSTRAINT "userBiodata_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;