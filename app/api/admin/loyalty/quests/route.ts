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
        const quests = await prisma.quests.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, quests });
    } catch (error) {
        console.error('Fetch quests error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch quests' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, description, type, rewardType, rewardAmount, minAct, validationConfig, isActive, emoji } = body;

        const quest = await prisma.quests.create({
            data: {
                id: `quest_${Date.now()}`,
                title,
                description,
                type,
                rewardType,
                rewardAmount: parseInt(rewardAmount),
                minAct: parseInt(minAct),
                validationConfig: validationConfig || {},
                isActive: isActive ?? true,
                emoji: emoji || '📜',
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, quest });
    } catch (error) {
        console.error('Create quest error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create quest' }, { status: 500 });
    }
}
