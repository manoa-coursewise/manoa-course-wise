-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "classId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_classId_key" ON "Course"("classId");

-- CreateIndex
CREATE INDEX "Professor_name_idx" ON "Professor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_courseId_name_key" ON "Professor"("courseId", "name");

-- Ensure there is a fallback course for legacy rows missing courseCode.
INSERT INTO "Course" ("classId", "name")
VALUES ('UNKNOWN', 'Unknown Course')
ON CONFLICT ("classId") DO NOTHING;

-- Seed course records from existing review data.
INSERT INTO "Course" ("classId", "name")
SELECT DISTINCT "courseCode", "courseCode"
FROM "Review"
WHERE "courseCode" IS NOT NULL AND "courseCode" <> ''
ON CONFLICT ("classId") DO NOTHING;

-- Add new relationship columns as nullable for backfill.
ALTER TABLE "Review"
ADD COLUMN "courseId" INTEGER,
ADD COLUMN "professorId" INTEGER,
ADD COLUMN "userId" INTEGER;

-- Backfill course relation from previous courseCode column.
UPDATE "Review" r
SET "courseId" = c."id"
FROM "Course" c
WHERE c."classId" = r."courseCode";

-- Assign fallback course where old courseCode was null/empty.
UPDATE "Review" r
SET "courseId" = c."id"
FROM "Course" c
WHERE c."classId" = 'UNKNOWN' AND r."courseId" IS NULL;

-- Seed professor records from existing review data.
INSERT INTO "Professor" ("name", "courseId")
SELECT DISTINCT r."professor", r."courseId"
FROM "Review" r
WHERE r."professor" IS NOT NULL AND r."professor" <> '' AND r."courseId" IS NOT NULL
ON CONFLICT ("courseId", "name") DO NOTHING;

-- Backfill professor relation.
UPDATE "Review" r
SET "professorId" = p."id"
FROM "Professor" p
WHERE p."courseId" = r."courseId" AND p."name" = r."professor";

-- Convert rating to float and remove legacy denormalized fields.
ALTER TABLE "Review"
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "courseId" SET NOT NULL,
DROP COLUMN "courseCode",
DROP COLUMN "professor";

-- CreateIndex
CREATE INDEX "Review_courseId_idx" ON "Review"("courseId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_professorId_idx" ON "Review"("professorId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
