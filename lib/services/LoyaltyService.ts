import { prisma } from '@/lib/prisma';

export class LoyaltyService {

    /**
     * Calculates all active loyalty boosts for a user based on their inventory.
     * Returns an object with multipliers for different types (XP, Token, etc.).
     */
    static async getLoyaltyBoosts(userId: string): Promise<{
        xpMultiplier: number;
        tokenMultiplier: number;
        lootMultiplier: number;
        activeBoosters: Array<{ name: string; type: string; multiplier: number }>
    }> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                inventory: true
            }
        });

        if (!user || !user.inventory || user.inventory.length === 0) {
            return { xpMultiplier: 1, tokenMultiplier: 1, lootMultiplier: 1, activeBoosters: [] };
        }

        const now = new Date();
        const activeInventoryBoosters = user.inventory.filter((item: any) => {
            if (item.type !== 'Boosters') return false;

            // 1. Check strict expiration
            if (item.expires_at && new Date(item.expires_at) > now) return true;

            // 2. Check fallback duration from name
            if (!item.expires_at) {
                const match = item.name.match(/\((\d+)h\)/i);
                if (match) {
                    const hours = parseInt(match[1]);
                    const start = new Date(item.unlocked_at);
                    const expiry = new Date(start.getTime() + hours * 60 * 60 * 1000);
                    return expiry > now;
                }
            }
            return false;
        });

        if (activeInventoryBoosters.length === 0) {
            return { xpMultiplier: 1, tokenMultiplier: 1, lootMultiplier: 1, activeBoosters: [] };
        }

        // Fetch corresponding shop_items for these boosters to get multipliers/types from DB
        const boosterIds = activeInventoryBoosters.map((b: any) => b.item_id);
        const shopBoosters = await prisma.shop_items.findMany({
            where: {
                id: { in: boosterIds },
                is_active: true
            }
        });

        let xpMultiplier = 1;
        let tokenMultiplier = 1;
        let lootMultiplier = 1;
        const activeBoosters: Array<{ name: string; type: string; multiplier: number }> = [];

        activeInventoryBoosters.forEach((inventoryItem: any) => {
            const shopItem = shopBoosters.find(s => s.id === inventoryItem.item_id);
            if (!shopItem) return;

            const multiplier = shopItem.multiplier || 1.0;
            const bonus = Math.max(0, multiplier - 1); // e.g. 2.0x -> 1.0 bonus

            if (shopItem.boost_type === 'XP') {
                xpMultiplier += bonus;
                activeBoosters.push({ name: shopItem.name, type: 'XP', multiplier });
            } else if (shopItem.boost_type === 'TOKEN') {
                tokenMultiplier += bonus;
                activeBoosters.push({ name: shopItem.name, type: 'TOKEN', multiplier });
            } else if (shopItem.boost_type === 'LOOT') {
                lootMultiplier += bonus;
                activeBoosters.push({ name: shopItem.name, type: 'LOOT', multiplier });
            }
        });

        return { xpMultiplier, tokenMultiplier, lootMultiplier, activeBoosters };
    }

    /**
     * Legacy helper for XP-only multiplier checks.
     */
    static async getXPMultiplier(userId: string): Promise<{ multiplier: number; activeBoosters: string[] }> {
        const boosts = await this.getLoyaltyBoosts(userId);
        return {
            multiplier: boosts.xpMultiplier,
            activeBoosters: boosts.activeBoosters.filter(b => b.type === 'XP').map(b => b.name)
        };
    }
}
