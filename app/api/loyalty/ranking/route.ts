import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const topUsers = await prisma.user.findMany({
            where: {
                role: 'customer',
                loyaltyPoints: { gt: 0 }
            },
            select: {
                id: true,
                name: true,
                image: true,
                loyaltyPoints: true
            },
            orderBy: {
                loyaltyPoints: 'desc'
            },
            take: 10
        });

        // Add some mock "winners" if data is low
        const hallOfFame = [
            { month: 'Janvier 2026', winner: 'Yassine K.', points: 4250, award: 'Champion Platine' },
            { month: 'Décembre 2025', winner: 'Sonia M.', points: 3890, award: 'Elite Gold' },
            { month: 'Novembre 2025', winner: 'Mehdi R.', points: 3560, award: 'Fidèle du mois' },
        ];

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
