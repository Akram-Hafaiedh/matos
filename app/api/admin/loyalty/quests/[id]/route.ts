import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, description, type, rewardType, rewardAmount, minAct, validationConfig, isActive, emoji } = body;

        const quest = await prisma.quests.update({
            where: { id },
            data: {
                title,
                description,
                type,
                rewardType,
                rewardAmount: rewardAmount !== undefined ? parseInt(rewardAmount) : undefined,
                minAct: minAct !== undefined ? parseInt(minAct) : undefined,
                validationConfig,
                emoji,
                isActive
            }
        });

        return NextResponse.json({ success: true, quest });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update quest' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.quests.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete quest' }, { status: 500 });
    }
}
