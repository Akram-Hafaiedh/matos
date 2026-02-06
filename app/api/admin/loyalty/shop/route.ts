import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const items = await prisma.shop_items.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, items });
    } catch (error) {
        console.error('Fetch shop items error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch shop items' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, type, price, act, level, rarity, emoji, isActive, metadata } = body;

        const item = await prisma.shop_items.create({
            data: {
                id: `shop_${Date.now()}`,
                name,
                type,
                price: parseInt(price),
                act: parseInt(act),
                level: parseInt(level),
                rarity,
                emoji: emoji || '📦',
                isActive: isActive ?? true,
                metadata: metadata || {},
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error('Create shop item error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create shop item' }, { status: 500 });
    }
}
