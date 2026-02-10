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
        const { title, description, type, reward_type, reward_amount, min_act, validation_config, is_active, emoji } = body;

        const quest = await prisma.quests.update({
            where: { id },
            data: {
                title,
                description,
                type,
                reward_type,
                reward_amount: reward_amount !== undefined ? parseInt(reward_amount) : undefined,
                min_act: min_act !== undefined ? parseInt(min_act) : undefined,
                validation_config,
                emoji,
                is_active
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
