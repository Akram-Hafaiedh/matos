import { prisma } from '../lib/prisma';

async function test() {
    try {
        console.log('Testing User profile selection...');
        const user = await prisma.user.findFirst({
            select: {
                id: true,
                name: true,
                email: true,
                loyalty_points: true,
                tokens: true,
                phone: true,
                address: true,
                role: true,
                image: true,
                selected_frame: true,
                selected_bg: true,
                selected_title: true,
                created_at: true,
                inventory: true,
                _count: {
                    select: { orders: true }
                }
            }
        });
        console.log('User profile fetch successful:', user ? 'User found' : 'No users in DB');
        if (user) {
            console.log('SelectedTitle value:', user.selected_title);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    } finally {
        await prisma.$disconnect();
    }
}

test();
