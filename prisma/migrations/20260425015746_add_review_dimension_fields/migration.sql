-- Add as nullable first for safe backfill on non-empty tables.
ALTER TABLE "Review"
ADD COLUMN "clarity" DOUBLE PRECISION,
ADD COLUMN "difficulty" DOUBLE PRECISION,
ADD COLUMN "workload" DOUBLE PRECISION;

-- Backfill from existing overall rating when present; fallback to neutral 3.
UPDATE "Review"
SET
  "difficulty" = COALESCE("rating", 3),
  "workload" = COALESCE("rating", 3),
  "clarity" = COALESCE("rating", 3)
WHERE "difficulty" IS NULL OR "workload" IS NULL OR "clarity" IS NULL;

ALTER TABLE "Review"
ALTER COLUMN "difficulty" SET NOT NULL,
ALTER COLUMN "workload" SET NOT NULL,
ALTER COLUMN "clarity" SET NOT NULL;
