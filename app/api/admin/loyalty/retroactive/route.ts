import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { LoyaltyService } from '@/lib/services/LoyaltyService';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
        }

        // Part 1: Registration Bonus Catch-up
        // Find all users with 0 points (likely registered before the bonus was added)
        const usersToUpdate = await prisma.user.findMany({
            where: {
                loyaltyPoints: 0
            }
        });

        let usersCatchupCount = 0;
        for (const user of usersToUpdate) {
            await prisma.user.update({
                where: { id: user.id },
                data: { loyaltyPoints: 10 }
            });
            usersCatchupCount++;
        }

        // Part 2: Award points for delivered orders
        // Find all delivered orders that haven't been awarded points yet
        const ordersToAward = await prisma.orders.findMany({
            where: {
                status: 'delivered',
                points_awarded: false,
                user_id: { not: null }
            }
        });

        let totalAwarded = 0;
        let totalPoints = 0;

        for (const order of ordersToAward) {
            if (order.user_id) {
                // Fetch boosters for each user
                const { xpMultiplier, tokenMultiplier } = await LoyaltyService.getLoyaltyBoosts(order.user_id);
                const baseAmount = Math.floor(order.total_amount);

                const finalXP = Math.floor(baseAmount * xpMultiplier);
                const finalTokens = Math.floor(baseAmount * tokenMultiplier);

                if (finalXP > 0 || finalTokens > 0) {
                    await prisma.$transaction([
                        prisma.user.update({
                            where: { id: order.user_id },
                            data: {
                                loyaltyPoints: { increment: finalXP },
                                tokens: { increment: finalTokens }
                            }
                        }),
                        prisma.orders.update({
                            where: { id: order.id },
                            data: { points_awarded: true }
                        })
                    ]);
                    totalAwarded++;
                    totalPoints += finalXP;
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Traitement terminé. Bonus de bienvenue appliqué à ${usersCatchupCount} utilisateurs. ${totalAwarded} commandes traitées, ${totalPoints} points d'achat accordés.`
        });

    } catch (error: any) {
        console.error('Error in retroactive loyalty script:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Erreur lors du traitement rétroactif'
        }, { status: 500 });
    }
}
