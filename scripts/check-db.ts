import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from '../app/generated/prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- Checking Categories ---');
    const categories = await prisma.categories.findMany();
    for (const cat of categories) {
        const count = await prisma.menu_items.count({ where: { category_id: cat.id } });
        console.log(`ID: ${cat.id}, Name: ${cat.name}, Items: ${count}`);
    }

    console.log('\n--- Checking Promotions ---');
    const promos = await prisma.promotions.findMany();
    promos.forEach(p => {
        console.log(`ID: ${p.id}, Name: ${p.name}`);
        console.log(`selection_rules: ${JSON.stringify(p.selection_rules, null, 2)}`);
        console.log('---');
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });
