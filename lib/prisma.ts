// lib/prisma.ts - Tactical Reload Trigger (v1.1)
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../app/generated/prisma';
import { Pool } from "pg";

// Define the global type to persist Prisma and Pool instances in development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pool: Pool | undefined;
};

// Initialize or reuse the PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL;

// MANDATORY for Prisma Postgres when using pg driver
const finalConnectionString = connectionString?.includes('?')
    ? `${connectionString}&uselibpqcompat=true`
    : `${connectionString}?uselibpqcompat=true`;

console.log('[Prisma] Initializing with protocol:', connectionString?.split(':')[0]);

export const pool = globalForPrisma.pool ?? new Pool({
    connectionString: finalConnectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false } // Required for Prisma Postgres
});

pool.on('error', (err) => {
    console.error('[Prisma Pool] Unexpected error on idle client', err);
});

// Create the Prisma adapter with the pool
const adapter = new PrismaPg(pool);

// Initialize or reuse the PrismaClient with the adapter
let prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: ['error', 'warn']
});

console.log('[Prisma] Client instantiated', globalForPrisma.prisma ? '(reused)' : '(new)');

// Handle stale global instance in development (after schema changes)
// Check both for missing models AND missing recently added fields to force reload
if (process.env.NODE_ENV !== 'production' && prisma) {
    const isStale = !(prisma as any).geocoding_stats ||
        !(prisma as any).global_settings?.fields?.invoice_template ||
        !(prisma as any).orders?.fields?.estimated_delivery_confidence;

    if (isStale) {
        console.log('[Prisma] Stale instance detected (missing models or new fields). Re-instantiating...');
        prisma = new PrismaClient({ adapter, log: ['error', 'warn'] });
        globalForPrisma.prisma = prisma;
    }
}

export { prisma };

// In development, save the instances to the global object to prevent hot-reload leaks
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
    globalForPrisma.pool = pool;
}