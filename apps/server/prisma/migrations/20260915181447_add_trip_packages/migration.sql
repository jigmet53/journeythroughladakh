-- CreateTable
CREATE TABLE "trip_packages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "nights" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "best_for" TEXT[],
    "best_time" TEXT NOT NULL,
    "start_city" TEXT NOT NULL,
    "estimated_budget" TEXT,
    "highlights" TEXT[],
    "things_to_know" TEXT[],
    "hero_image_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_package_days" (
    "id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "overnight_at" TEXT,
    "distance_km" INTEGER,
    "drive_hours" DOUBLE PRECISION,
    "altitude_meters" INTEGER,
    "destination_id" TEXT,

    CONSTRAINT "trip_package_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trip_packages_slug_key" ON "trip_packages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "trip_package_days_package_id_day_number_key" ON "trip_package_days"("package_id", "day_number");

-- AddForeignKey
ALTER TABLE "trip_package_days" ADD CONSTRAINT "trip_package_days_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "trip_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_package_days" ADD CONSTRAINT "trip_package_days_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
