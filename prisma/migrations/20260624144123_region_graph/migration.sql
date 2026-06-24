-- CreateTable
CREATE TABLE "public"."RegionConnection" (
    "id" TEXT NOT NULL,
    "fromRegionId" TEXT NOT NULL,
    "toRegionId" TEXT NOT NULL,

    CONSTRAINT "RegionConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegionConnection_fromRegionId_toRegionId_key" ON "public"."RegionConnection"("fromRegionId", "toRegionId");

-- AddForeignKey
ALTER TABLE "public"."RegionConnection" ADD CONSTRAINT "RegionConnection_fromRegionId_fkey" FOREIGN KEY ("fromRegionId") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RegionConnection" ADD CONSTRAINT "RegionConnection_toRegionId_fkey" FOREIGN KEY ("toRegionId") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
