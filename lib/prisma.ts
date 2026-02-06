import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../app/generated/prisma';
import { Pool } from "pg";

// Define the global type to persist Prisma and Pool instances in development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pool: Pool | undefined;
};

// Initialize or reuse the PostgreSQL connection pool
// For Prisma Postgres, we limit the pool size to avoid overwhelming the proxy
// Trigger reload after schema update
export const pool = globalForPrisma.pool ?? new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Create the Prisma adapter with the pool
const adapter = new PrismaPg(pool);

// Initialize or reuse the PrismaClient with the adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// In development, save the instances to the global object to prevent hot-reload leaks
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
    globalForPrisma.pool = pool;
}