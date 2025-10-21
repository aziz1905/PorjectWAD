CREATE TYPE "public"."name_size" AS ENUM('S', 'M', 'L', 'XL', 'XXL');--> statement-breakpoint
ALTER TABLE "productsSizes" RENAME COLUMN "name_size" TO "size";--> statement-breakpoint
DROP INDEX "product_size_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "product_size_unique" ON "productsSizes" USING btree ("product_id","size");