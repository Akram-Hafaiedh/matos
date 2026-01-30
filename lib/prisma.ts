import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../app/generated/prisma';
import { Pool } from "pg";

// Create a PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });



// Create the Prisma adapter with the pool
const adapter = new PrismaPg(pool);

// Create a global variable to persist PrismaClient in development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};


// Initialize PrismaClient with the adapter, or reuse the existing one
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// In development, save the client to the global object to prevent hot-reload issues
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}