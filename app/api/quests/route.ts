import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // Fetch all active quests
        const allQuests = await prisma.quests.findMany({
            where: { is_active: true },
            orderBy: { min_act: 'asc' }
        });

        // Fetch user progress
        const userQuests = await prisma.user_quests.findMany({
            where: { user_id: userId }
        });

        // Merge data
        const questsWithProgress = allQuests.map(quest => {
            const userQuest = userQuests.find(uq => uq.quest_id === quest.id);
            return {
                ...quest,
                progress: userQuest?.progress || 0,
                status: userQuest?.status || 'PENDING',
                completedAt: userQuest?.completed_at
            };
        });

        // Fetch user data for points
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { loyalty_points: true }
        });

        return NextResponse.json({
            success: true,
            quests: questsWithProgress,
            userPoints: user?.loyalty_points || 0
        });

    } catch (error) {
        console.error('Error fetching quests:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
