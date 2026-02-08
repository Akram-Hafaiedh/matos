import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const topUsers = await prisma.user.findMany({
            where: {
                role: 'customer',
                loyalty_points: { gt: 0 }
            },
            select: {
                id: true,
                name: true,
                image: true,
                loyalty_points: true,
                selected_frame: true,
                selected_bg: true
            },
            orderBy: {
                loyalty_points: 'desc'
            },
            take: 10
        });

        const hallOfFame: any[] = [];

        return NextResponse.json({
            success: true,
            ranking: topUsers,
            hallOfFame
        });
    } catch (error) {
        console.error('Error fetching loyalty ranking:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
