import * as dotenv from 'dotenv';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from '../app/generated/prisma';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- DATABASE CHECK ---');

    const shopItems = await prisma.shop_items.findMany();
    console.log(`Shop Items Count: ${shopItems.length}`);
    if (shopItems.length > 0) {
        console.log('Sample Shop Item:', JSON.stringify(shopItems[0], null, 2));
    }

    const quests = await prisma.quests.findMany();
    console.log(`Quests Count: ${quests.length}`);
    if (quests.length > 0) {
        console.log('Sample Quest:', JSON.stringify(quests[0], null, 2));
    }

    const users = await prisma.user.findMany({
        take: 5,
        orderBy: { loyaltyPoints: 'desc' }
    });
    console.log('Top Users by Points:');
    users.forEach(u => console.log(`- ${u.email}: ${u.loyaltyPoints} pts`));

    const admin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
    console.log('Admin Check:', admin ? `Found (Role: ${admin.role})` : 'Not Found');

    console.log('--- CHECK COMPLETE ---');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
