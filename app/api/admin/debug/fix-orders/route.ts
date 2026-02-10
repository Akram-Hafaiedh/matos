
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
        }

        // Logic: Sort categories logically and assign display_order
        const categories = await prisma.categories.findMany();

        // Desired order based on common restaurant patterns
        const desiredOrder = [
            'pizzas',
            'makloub',
            'tacos',
            'burgers',
            'sandwichs',
            'sandwich',
            'plats',
            'plat',
            'salades',
            'salade',
            'tunisien',
            'sides',
            'enfants',
            'promos',
            'boissons',
            'desserts',
            'suppléments',
            'supplements'
        ];

        const sorted = categories.sort((a, b) => {
            const indexA = desiredOrder.findIndex(name => a.name.toLowerCase().includes(name));
            const indexB = desiredOrder.findIndex(name => b.name.toLowerCase().includes(name));

            // If both not found, sort by ID
            if (indexA === -1 && indexB === -1) return a.id - b.id;
            // If one not found, put it further down but before the very last ones
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;

            return indexA - indexB;
        });

        const updates = sorted.map((cat, index) => {
            return prisma.categories.update({
                where: { id: cat.id },
                data: { display_order: (index + 1) * 10 } // Use 10, 20, 30... for flexibility
            });
        });

        await prisma.$transaction(updates);

        // Clear Next.js cache to reflect changes instantly
        revalidatePath('/menu');
        revalidatePath('/');
        revalidatePath('/dashboard/categories');

        return NextResponse.json({
            success: true,
            message: 'Category orders fixed',
            newOrder: sorted.map((c, i) => ({ id: c.id, name: c.name, order: (i + 1) * 10 }))
        });

    } catch (error) {
        console.error('Error fixing category orders:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
