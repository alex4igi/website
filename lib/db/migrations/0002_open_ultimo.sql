CREATE TABLE "csp_reports" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "csp_reports_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"app" text NOT NULL,
	"directive" text NOT NULL,
	"blocked" text NOT NULL,
	"page" text NOT NULL,
	"n" integer DEFAULT 1 NOT NULL,
	"first_seen" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "csp_reports_key" ON "csp_reports" USING btree ("app","directive","blocked","page");