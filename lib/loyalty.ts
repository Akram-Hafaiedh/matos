export const TIERS = [
    {
        name: 'Acte I',
        min: 100,
        max: 999,
        benefit: '5% remise sur chaque commande',
        color: 'from-orange-500 to-orange-700',
        borderColor: 'border-orange-500',
        textColor: 'text-orange-500',
        iconColor: 'bg-orange-500',
        emoji: '🛡️'
    },
    {
        name: 'Acte II',
        min: 1000,
        max: 2499,
        benefit: '10% remise + Boisson offerte',
        color: 'from-gray-300 to-gray-500',
        borderColor: 'border-slate-300',
        textColor: 'text-gray-300',
        iconColor: 'bg-gray-400',
        emoji: '🏆'
    },
    {
        name: 'Acte III',
        min: 2500,
        max: 4999,
        benefit: '15% remise + Livraison gratuite',
        color: 'from-yellow-400 to-yellow-600',
        borderColor: 'border-yellow-400',
        textColor: 'text-yellow-500',
        iconColor: 'bg-yellow-400',
        emoji: '👑'
    },
    {
        name: 'Acte IV',
        min: 5000,
        max: Infinity,
        benefit: '20% remise + Invitations VIP',
        color: 'from-blue-400 to-cyan-500',
        borderColor: 'border-cyan-400',
        textColor: 'text-cyan-400',
        iconColor: 'bg-cyan-500',
        emoji: '💎'
    }
];

export const ACTS = [
    {
        id: 'act-0',
        title: "L'INITIATION",
        subtitle: 'INITIATION',
        min: 0,
        max: 99,
        nextGoal: 'Acte I',
        ranks: [
            { name: 'Candidat', min: 0, max: 50 },
            { name: 'Postulant', min: 51, max: 99 }
        ]
    },
    {
        id: 'act-1',
        title: "LE PACTE",
        subtitle: 'ACTE I',
        min: 100,
        max: 999,
        nextGoal: 'Acte II',
        ranks: [
            { name: 'Recrue', min: 100, max: 400 },
            { name: 'Prospect', min: 401, max: 700 },
            { name: 'Initié', min: 701, max: 999 }
        ]
    },
    {
        id: 'act-2',
        title: "L'ASCENSION",
        subtitle: 'ACTE II',
        min: 1000,
        max: 2499,
        nextGoal: 'Acte III',
        ranks: [
            { name: 'Soldat', min: 1000, max: 1500 },
            { name: 'Lieutenant', min: 1501, max: 2000 },
            { name: 'Capitaine', min: 2001, max: 2499 }
        ]
    },
    {
        id: 'act-3',
        title: 'LE POUVOIR',
        subtitle: 'ACTE III',
        min: 2500,
        max: 4999,
        nextGoal: 'Acte IV',
        ranks: [
            { name: 'Baron', min: 2500, max: 3300 },
            { name: 'Parrain', min: 3301, max: 4200 },
            { name: 'Sultan', min: 4201, max: 4999 }
        ]
    },
    {
        id: 'act-4',
        title: 'LÉGENDE',
        subtitle: 'ACTE IV',
        min: 5000,
        max: Infinity,
        nextGoal: 'MAX',
        ranks: [
            { name: 'Icône', min: 5000, max: 8000 },
            { name: 'Immortel', min: 8001, max: 12000 },
            { name: 'L\'Élu', min: 12001, max: Infinity }
        ]
    }
];

export function getDetailedProgress(points: number) {
    const act = ACTS.find(a => points >= a.min && points <= a.max) || ACTS[0];
    const nextAct = ACTS.find(a => a.min > points);
    const rank = act.ranks.find(r => points >= r.min && points <= r.max) || act.ranks[0];

    let progress = 0;
    let pointsToNext = 0;
    let goalName = act.nextGoal;

    if (nextAct) {
        progress = ((points - act.min) / (nextAct.min - act.min)) * 100;
        pointsToNext = nextAct.min - points;
    } else {
        progress = 100;
    }

    return {
        act,
        rank,
        progress,
        pointsToNext,
        goalName
    };
}



export function getUserTier(points: number) {
    const tier = TIERS.find(tier => points >= tier.min && points <= tier.max);
    if (tier) return tier;

    // Fallback for points < 100 (Newcomers)
    return {
        name: 'Initiation',
        min: 0,
        max: 99,
        benefit: 'Passez Acte I pour 5% de remise',
        color: 'from-gray-500 to-gray-700',
        borderColor: 'border-gray-500',
        textColor: 'text-gray-400',
        iconColor: 'bg-gray-500',
        emoji: '🌱'
    };
}

export function getNextTier(points: number) {
    const currentTierIndex = TIERS.findIndex(tier => points >= tier.min && points <= tier.max);
    if (currentTierIndex === -1 && points < 100) return TIERS[0];
    if (currentTierIndex === -1 || currentTierIndex === TIERS.length - 1) return null;
    return TIERS[currentTierIndex + 1];
}

export const ITEM_TYPES = ['Loot Boxes', 'Auras', 'Frames', 'Titles', 'Boosters', 'Exclusive'];

// Export only necessary types/constants if needed by other files, but usually SHOP_ITEMS is database driven.
// Getting rid of hardcoded SHOP_ITEMS here to avoid confusion with seed.ts

/**
 * Standardized check to see if an inventory item has expired.
 * Includes fallback logic for items where expires_at might be missing but have a duration in name.
 */
export function isItemExpired(item: any): boolean {
    let expiry: Date | null = null;

    if (item.expires_at || item.expiresAt) {
        expiry = new Date(item.expires_at || item.expiresAt);
    } else if (item.name && item.type === 'Boosters' && (item.unlocked_at || item.unlockedAt)) {
        // Fallback: Try to parse duration from name (e.g., "(1h)")
        const match = item.name.match(/\((\d+)h\)/i);
        if (match) {
            const hours = parseInt(match[1]);
            const start = new Date(item.unlocked_at || item.unlockedAt);
            expiry = new Date(start.getTime() + hours * 60 * 60 * 1000);
        }
    }

    if (!expiry) return false;
    return expiry < new Date();
}

