
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { LoyaltyService } from '@/lib/services/LoyaltyService';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: questId } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // Calculate Multiplier
        const { xpMultiplier, tokenMultiplier } = await LoyaltyService.getLoyaltyBoosts(userId);

        // Transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Get UserQuest to verify it is COMPLETED and NOT CLAIMED
            const userQuest = await tx.user_quests.findUnique({
                where: { user_id_quest_id: { user_id: userId, quest_id: questId } },
                include: { quests: true }
            });

            if (!userQuest) {
                throw new Error('Quest not started');
            }
            if (userQuest.status !== 'COMPLETED') {
                throw new Error('Quest not completed');
            }
            if (userQuest.status === 'CLAIMED') {
                throw new Error('Reward already claimed');
            }

            // 2. Mark as CLAIMED
            const updatedUserQuest = await tx.user_quests.update({
                where: { id: userQuest.id },
                data: { status: 'CLAIMED' }
            });

            // 3. Award Rewards
            const rewardType = userQuest.quests.rewardType;
            let rewardAmount = userQuest.quests.rewardAmount;

            if (rewardType === 'XP') {
                rewardAmount = Math.floor(rewardAmount * xpMultiplier);
                await tx.user.update({
                    where: { id: userId },
                    data: { loyaltyPoints: { increment: rewardAmount } }
                });
            } else if (rewardType === 'TOKEN') {
                // Apply token multiplier to quest token rewards
                rewardAmount = Math.floor(rewardAmount * tokenMultiplier);
                await tx.user.update({
                    where: { id: userId },
                    data: { tokens: { increment: rewardAmount } }
                });
            }

            return { updatedUserQuest, rewardType, rewardAmount };
        });

        return NextResponse.json({
            success: true,
            message: 'Reward claimed',
            reward: {
                type: result.rewardType,
                amount: result.rewardAmount
            }
        });

    } catch (error: any) {
        console.error('Error claiming reward:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 400 });
    }
}
