import { config as loadEnv } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Match Prisma CLI env precedence so runtime and migrations target the same database.
loadEnv({ path: ".env.local" });
loadEnv();

const connectionString =
	process.env.POSTGRES_PRISMA_URL ??
	process.env.PRISMA_DATABASE_URL ??
	process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error(
		"Missing database connection string. Set POSTGRES_PRISMA_URL, PRISMA_DATABASE_URL, or DATABASE_URL.",
	);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };