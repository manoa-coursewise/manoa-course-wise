-- Add username for existing and future users.
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Backfill usernames from email local-part; append user id for collisions.
WITH candidates AS (
  SELECT
    id,
    split_part(email, '@', 1) AS base_username,
    row_number() OVER (PARTITION BY split_part(email, '@', 1) ORDER BY id) AS rn
  FROM "User"
)
UPDATE "User" AS u
SET "username" = CASE
  WHEN c.rn = 1 THEN c.base_username
  ELSE c.base_username || '_' || u.id::text
END
FROM candidates AS c
WHERE u.id = c.id;

ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
