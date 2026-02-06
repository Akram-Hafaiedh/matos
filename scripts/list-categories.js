const { PrismaClient } = require('../app/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    try {
        const cats = await prisma.categories.findMany({
            select: { id: true, name: true }
        });
        console.log(JSON.stringify(cats, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
