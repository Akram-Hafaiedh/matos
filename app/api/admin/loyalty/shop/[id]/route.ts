import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, type, price, act, level, rarity, emoji, is_active, metadata } = body;

        const item = await prisma.shop_items.update({
            where: { id },
            data: {
                name,
                type,
                price: price !== undefined ? parseInt(price) : undefined,
                act: act !== undefined ? parseInt(act) : undefined,
                level: level !== undefined ? parseInt(level) : undefined,
                rarity,
                emoji,
                is_active,
                metadata
            }
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update shop item' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.shop_items.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete shop item' }, { status: 500 });
    }
}
