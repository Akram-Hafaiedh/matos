
const { PrismaClient } = require('./app/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    const promotions = await prisma.promotion.findMany({
        where: { isActive: true },
        select: { name: true, selectionRules: true }
    });
    console.log(JSON.stringify(promotions, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
