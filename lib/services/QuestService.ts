import { prisma } from '@/lib/prisma';
import { quests as Quest, user_quests as UserQuest } from '@/app/generated/prisma';

export class QuestService {

    /**
     * Analyzes an order and updates relevant quests.
     * Returns a list of newly completed quests to notify the user.
     */
    static async processOrderQuests(userId: string, order: any): Promise<Quest[]> {
        const completedQuests: Quest[] = [];

        // 1. Fetch all active global quests
        const activeQuests = await prisma.quests.findMany({
            where: { isActive: true }
        });

        // Fetch User's Act/Tier for gating (Optional optimization, strictly enforce in UI for now)
        // const user = await prisma.user.findUnique({ where: { id: userId } });

        for (const quest of activeQuests) {

            // Check if already completed/claimed
            const userQuest = await prisma.user_quests.findUnique({
                where: { user_id_quest_id: { user_id: userId, quest_id: quest.id } }
            });

            if (userQuest?.status === 'CLAIMED' || userQuest?.status === 'COMPLETED') {
                continue;
            }

            const config = (quest.validationConfig as any) || {};
            let progressMade = 0;
            let isCompleted = false;
            let currentProgress = userQuest?.progress || 0;

            // --- 2. VALIDATION LOGIC ---

            switch (quest.type) {
                case 'TIME':
                    // e.g. "Night Owl" or "Lunch"
                    if (this.checkTimeRequirement(order.created_at, config)) {
                        progressMade = 100; // Instant
                        isCompleted = true;
                    }
                    break;

                case 'STREAK':
                    // e.g. "3 orders in 7 days" or "Weekender" (Fri/Sat)
                    if (config.timeframe && config.targetCount) {
                        // Multi-order streak logic
                        const isValidNow = this.checkDayRequirement(order.created_at, config);
                        if (isValidNow) {
                            // Check history count in timeframe
                            const count = await this.countOrdersInTimeframe(userId, config.timeframe);
                            // logic: count includes current order if committed? 
                            // Assuming 'count' fetches recent orders including this one if committed.
                            // If this order is just created, it counts.
                            currentProgress = count;
                            if (currentProgress >= config.targetCount) isCompleted = true;
                            // We set progress absolute here, not increment
                            progressMade = 0; // handled by absolute path
                        }
                    } else {
                        // Simple "Hit this condition once" streak (like Weekender currently)
                        if (this.checkDayRequirement(order.created_at, config)) {
                            progressMade = 100;
                            isCompleted = true;
                        }
                    }
                    break;

                case 'COLLECTION':
                    // e.g. "Order > 80 TND" or "10 Different Items" or "Ordered specific Promo"
                    if (config.minOrderValue) {
                        if (order.total_amount >= config.minOrderValue) {
                            progressMade = 100;
                            isCompleted = true;
                        }
                    } else if (config.promoName) {
                        // Check if order contains the specific promo or item
                        const hasPromo = order.order_items.some((oi: any) =>
                            oi.item_name === config.promoName ||
                            oi.promotion?.name === config.promoName
                        );
                        if (hasPromo) {
                            progressMade = 100;
                            isCompleted = true;
                        }
                    } else if (config.targetCount) {
                        // "Gourmet Hunter" - Different items
                        const uniqueItemsCount = await this.countUniqueItemsOrdered(userId);
                        currentProgress = uniqueItemsCount;
                        if (currentProgress >= config.targetCount) {
                            isCompleted = true;
                        }
                        progressMade = 0; // Absolute progress set
                    }
                    break;

                case 'SPEND':
                    // e.g. "Spend 500 Tokens" or "Spend 200 TND"
                    if (config.tokenSpend) {
                        // This would be triggered by a token transaction (Shop)
                        // Current order doesn't spend tokens, so skip if it's token-only
                        break;
                    }

                    if (config.spendAmount) {
                        // Cumulative TND spend
                        progressMade = Math.floor(order.total_amount);
                        if (currentProgress + progressMade >= config.spendAmount) {
                            isCompleted = true;
                        }
                    }
                    break;

                case 'SOCIAL':
                    // Not order related usually
                    break;

                case 'ONE_OFF':
                    // e.g. First Order or Cumulative XP Milestone
                    if (config.targetXP) {
                        const user = await prisma.user.findUnique({ where: { id: userId }, select: { loyaltyPoints: true } });
                        currentProgress = user?.loyaltyPoints || 0;
                        if (currentProgress >= config.targetXP) isCompleted = true;
                        progressMade = 0;
                    } else if (config.targetCount) {
                        progressMade = 1;
                        if (currentProgress + progressMade >= config.targetCount) {
                            isCompleted = true;
                        }
                    }
                    break;
            }

            // --- 3. UPDATE DATABASE ---

            // If we calculated an absolute progress (Streak), use that. Else use increment.
            let newProgressVal = currentProgress + progressMade;
            if (quest.type === 'STREAK' && config.timeframe) {
                newProgressVal = currentProgress; // Already calculated absolute
            }

            // Cap at 100 if simple boolean, or target if numeric
            const target = config.targetCount || config.spendAmount || 100;
            // Visual progress capping
            // If isCompleted, force max? No, keep real numbers often better.

            if (progressMade > 0 || isCompleted || (quest.type === 'STREAK' && config.timeframe)) {
                const updated = await prisma.user_quests.upsert({
                    where: { user_id_quest_id: { user_id: userId, quest_id: quest.id } },
                    create: {
                        id: `uq_${userId}_${quest.id}`,
                        user_id: userId,
                        quest_id: quest.id,
                        progress: isCompleted ? (target) : newProgressVal,
                        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
                        last_progress_at: new Date(),
                        completed_at: isCompleted ? new Date() : null
                    },
                    update: {
                        progress: isCompleted ? (target) : newProgressVal,
                        status: isCompleted ? 'COMPLETED' : undefined,
                        last_progress_at: new Date(),
                        completed_at: isCompleted ? new Date() : undefined
                    }
                });

                if (isCompleted && userQuest?.status !== 'COMPLETED') {
                    completedQuests.push(quest);
                }
            }
        }

        return completedQuests;
    }

    // --- HELPERS ---

    private static checkTimeRequirement(dateStr: string | Date, config: any): boolean {
        const date = new Date(dateStr);
        const day = date.getDay(); // 0=Sun, 6=Sat
        const hour = date.getHours();
        const minute = date.getMinutes();
        const timeVal = hour * 60 + minute;

        // Check Days
        if (config.days && !config.days.includes(day)) return false;

        // Check Hours
        if (config.startTime && config.endTime) {
            const [startH, startM] = config.startTime.split(':').map(Number);
            const [endH, endM] = config.endTime.split(':').map(Number); // e.g., 23:59

            const startVal = startH * 60 + startM;
            const endVal = endH * 60 + endM;

            // Handle overnight (e.g. 22:00 to 02:00) - Not needed for current quests but good practice
            if (startVal <= endVal) {
                if (timeVal < startVal || timeVal > endVal) return false;
            } else {
                // Crosses midnight
                if (timeVal < startVal && timeVal > endVal) return false;
            }
        }

        return true;
    }

    private static checkDayRequirement(dateStr: string | Date, config: any): boolean {
        const date = new Date(dateStr);
        const day = date.getDay();
        if (config.days && !config.days.includes(day)) return false;
        return true;
    }

    private static async countOrdersInTimeframe(userId: string, timeframe: string): Promise<number> {
        // timeframe e.g. "7d", "1w"
        const days = parseInt(timeframe); // simplistic parsing, assuming format '7d' -> 7
        if (isNaN(days)) return 0; // Validation fallback

        const since = new Date();
        since.setDate(since.getDate() - days);

        const count = await prisma.orders.count({
            where: {
                user_id: userId,
                created_at: { gte: since }
            }
        });
        return count;
    }

    private static async countUniqueItemsOrdered(userId: string): Promise<number> {
        const result = await prisma.order_items.groupBy({
            by: ['menu_item_id'],
            where: {
                orders: { user_id: userId },
                menu_item_id: { not: null }
            }
        });
        return result.length;
    }
}
