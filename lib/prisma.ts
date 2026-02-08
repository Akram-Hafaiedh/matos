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
const connectionString = process.env.DATABASE_URL;
const finalConnectionString = connectionString?.includes('?')
    ? `${connectionString}&uselibpqcompat=true`
    : `${connectionString}?uselibpqcompat=true`;

export const pool = globalForPrisma.pool ?? new Pool({
    connectionString: finalConnectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

// Create the Prisma adapter with the pool
const adapter = new PrismaPg(pool);

// Initialize or reuse the PrismaClient with the adapter
let prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// Handle stale global instance in development (after schema changes)
if (process.env.NODE_ENV !== 'production' && prisma && (!(prisma as any).content_pages || !(prisma as any).hero_slides || !(prisma as any).email_settings || !(prisma as any).sent_emails)) {
    console.log('[Prisma] Stale instance detected (missing models). Re-instantiating...');
    prisma = new PrismaClient({ adapter });
    globalForPrisma.prisma = prisma;
}

export { prisma };

// In development, save the instances to the global object to prevent hot-reload leaks
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
    globalForPrisma.pool = pool;
}