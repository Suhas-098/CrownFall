-- CreateTable
CREATE TABLE "public"."PlayerResource" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "food" INTEGER NOT NULL DEFAULT 0,
    "iron" INTEGER NOT NULL DEFAULT 0,
    "influence" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlayerResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerActionPoints" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "currentAp" INTEGER NOT NULL DEFAULT 3,
    "maxAp" INTEGER NOT NULL DEFAULT 6,

    CONSTRAINT "PlayerActionPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RegionOwnership" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegionOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerResource_playerId_key" ON "public"."PlayerResource"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerActionPoints_playerId_key" ON "public"."PlayerActionPoints"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "RegionOwnership_regionId_key" ON "public"."RegionOwnership"("regionId");

-- AddForeignKey
ALTER TABLE "public"."PlayerResource" ADD CONSTRAINT "PlayerResource_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."MatchPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerActionPoints" ADD CONSTRAINT "PlayerActionPoints_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."MatchPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RegionOwnership" ADD CONSTRAINT "RegionOwnership_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RegionOwnership" ADD CONSTRAINT "RegionOwnership_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."MatchPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
