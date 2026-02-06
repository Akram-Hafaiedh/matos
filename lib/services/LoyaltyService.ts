import { prisma } from '@/lib/prisma';

export class LoyaltyService {

    /**
     * Calculates the active XP multiplier for a user based on their inventory.
     * Checks for active boosters and returns the multiplier (default 1).
     */
    static async getXPMultiplier(userId: string): Promise<{ multiplier: number; activeBoosters: string[] }> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                inventory: true
            }
        });

        if (!user || !user.inventory) {
            return { multiplier: 1, activeBoosters: [] };
        }

        let multiplier = 1;
        const activeBoosters: string[] = [];

        // Filter active boosters
        const now = new Date();
        const boosters = user.inventory.filter((item: any) => {
            if (item.type !== 'Boosters') return false;

            // 1. Check strict expiration if exists
            if (item.expires_at && new Date(item.expires_at) > now) return true;

            // 2. Check fallback duration from name if expiresAt is missing
            // This mirrors the client-side fallback logic
            if (!item.expires_at) {
                const match = item.name.match(/\((\d+)h\)/i);
                if (match) {
                    const hours = parseInt(match[1]);
                    const start = new Date(item.unlocked_at); // Assuming unlockedAt exists on inventory items
                    const expiry = new Date(start.getTime() + hours * 60 * 60 * 1000);
                    return expiry > now;
                }
            }

            return false;
        });

        // Apply multipliers
        boosters.forEach((booster: any) => {
            // Define multiplier rules based on item name or type
            // For now, "XP Overdrive" = 2x
            if (booster.name.toLowerCase().includes('xp overdrive')) {
                multiplier += 1; // Add 100% (so 2x total if 1 booster)
                activeBoosters.push(booster.name);
            }
            // Add other rules here, e.g. "Protocol Hack" might give 3x
            else if (booster.name.toLowerCase().includes('protocol hack')) {
                multiplier += 0.5; // +50%
                activeBoosters.push(booster.name);
            }
        });

        return { multiplier, activeBoosters };
    }
}
