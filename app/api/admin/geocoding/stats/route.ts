
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const stats = await prisma.geocoding_stats.findMany({
            orderBy: {
                date: 'desc'
            },
            take: 30 // Last 30 days
        });

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching geocoding stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
