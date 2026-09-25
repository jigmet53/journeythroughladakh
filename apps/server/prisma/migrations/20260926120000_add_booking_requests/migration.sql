-- CreateTable
CREATE TABLE "booking_requests" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "package_id" TEXT,
    "package_slug" TEXT NOT NULL,
    "package_title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "start_date" DATE NOT NULL,
    "flexible_dates" BOOLEAN NOT NULL DEFAULT false,
    "starting_city" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_requests_reference_key" ON "booking_requests"("reference");

-- CreateIndex
CREATE INDEX "booking_requests_created_at_idx" ON "booking_requests"("created_at");

-- CreateIndex
CREATE INDEX "booking_requests_status_idx" ON "booking_requests"("status");

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "trip_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
