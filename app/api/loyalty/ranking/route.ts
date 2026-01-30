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
                loyaltyPoints: true,
                selectedFrame: true,
                selectedBg: true
            },
            orderBy: {
                loyaltyPoints: 'desc'
            },
            take: 10
        });

        // Add some mock "winners" if data is low - reflecting site launch
        const hallOfFame = [
            { month: 'Janvier 2026', winner: 'Bientôt...', points: 0, award: 'Lancement du Club Matos' },
            { month: 'Décembre 2025', winner: 'Beta Test', points: 0, award: 'Période de Rodage' },
            { month: 'Novembre 2025', winner: 'Pré-Ouverture', points: 0, award: 'Bienvenue au Club' },
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
