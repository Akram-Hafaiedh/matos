import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing external avatars...');
    const result = await prisma.user.updateMany({
        where: {
            image: {
                contains: 'dicebear.com'
            }
        },
        data: {
            image: null
        }
    });
    console.log(`Cleared ${result.count} user avatars.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
