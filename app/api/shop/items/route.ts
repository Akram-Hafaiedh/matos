import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const items = await prisma.shop_items.findMany({
            where: { isActive: true },
            orderBy: [
                { type: 'asc' },
                { price: 'asc' }
            ]
        });
        return NextResponse.json({ success: true, items });
    } catch (error) {
        console.error('Error fetching shop items:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 500 });
    }
}
