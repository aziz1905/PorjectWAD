CREATE TYPE "public"."payment_method_enum" AS ENUM('Transfer', 'Bayar_Tunai_di_Mitra', 'E_Wallet', 'COD');--> statement-breakpoint
CREATE TYPE "public"."payment_status_enum" AS ENUM('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."product_age" AS ENUM('Anak', 'Remaja', 'Dewasa');--> statement-breakpoint
CREATE TYPE "public"."product_gender" AS ENUM('Pria', 'Wanita', 'Unisex');--> statement-breakpoint
CREATE TYPE "public"."product_size" AS ENUM('S', 'M', 'L', 'XL', 'XXL');--> statement-breakpoint
CREATE TYPE "public"."item_condition_enum" AS ENUM('Baik', 'Rusak_Ringan', 'Rusak_Berat');--> statement-breakpoint
CREATE TYPE "public"."return_status_enum" AS ENUM('Belum_Dikembalikan', 'Diajukan', 'Diterima', 'Selesai');--> statement-breakpoint
CREATE TYPE "public"."order_status_enum" AS ENUM('Menunggu_Tujuan_Anda', 'Terkirim', 'Anda_pinjam', 'Selesai', 'Dibatalkan');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('customer', 'admin');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_category" varchar(255) NOT NULL,
	CONSTRAINT "categories_name_category_unique" UNIQUE("name_category")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"rental_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"payment_method" "payment_method_enum" NOT NULL,
	"payment_status" "payment_status_enum" DEFAULT 'PENDING' NOT NULL,
	"transaction_code" varchar(255),
	"receipt_url" text,
	"payment_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category_id" integer,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"image_url" varchar NOT NULL,
	"age" "product_age" DEFAULT 'Dewasa' NOT NULL,
	"gender" "product_gender" DEFAULT 'Unisex' NOT NULL,
	"rating" numeric(2, 1) DEFAULT '0.0',
	"rent_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "productsSizes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "productsSizes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer NOT NULL,
	"size_name" "product_size" NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rentalDetails" (
	"rental_id" serial NOT NULL,
	"product_id" integer NOT NULL,
	"unit_price" integer NOT NULL,
	"duration" integer NOT NULL,
	"unit" integer NOT NULL,
	"durasi_hari" integer NOT NULL,
	"return_condition" "item_condition_enum" DEFAULT 'Baik' NOT NULL,
	"fine_amount" integer DEFAULT '0' NOT NULL,
	CONSTRAINT "rentalDetails_rental_id_product_id_pk" PRIMARY KEY("rental_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "rentals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_product" integer NOT NULL,
	"shipping_cost" integer NOT NULL,
	"total_payment" integer NOT NULL,
	"shipping_address" text NOT NULL,
	"payment_method" "payment_method_enum" NOT NULL,
	"order_status" "order_status_enum" DEFAULT 'Menunggu_Tujuan_Anda' NOT NULL,
	"order_date" timestamp DEFAULT now(),
	"return_status" "return_status_enum" DEFAULT 'Belum_Dikembalikan' NOT NULL,
	"return_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"rating" numeric(2, 1) DEFAULT '0.0',
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userBiodata" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "userBiodata_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"phone" varchar DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"imageUrl" text DEFAULT '' NOT NULL,
	CONSTRAINT "userBiodata_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_user" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wishlist_user_id_product_id_pk" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_rental_id_rentals_id_fk" FOREIGN KEY ("rental_id") REFERENCES "public"."rentals"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productsSizes" ADD CONSTRAINT "productsSizes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rentalDetails" ADD CONSTRAINT "rentalDetails_rental_id_rentals_id_fk" FOREIGN KEY ("rental_id") REFERENCES "public"."rentals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rentalDetails" ADD CONSTRAINT "rentalDetails_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userBiodata" ADD CONSTRAINT "userBiodata_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_size_unique" ON "productsSizes" USING btree ("product_id","size_name");--> statement-breakpoint
CREATE UNIQUE INDEX "review_user_product_unique" ON "reviews" USING btree ("product_id","user_id");