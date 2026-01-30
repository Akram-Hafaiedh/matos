export const TIERS = [
    {
        name: 'Bronze',
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
        name: 'Silver',
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
        name: 'Gold',
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
        name: 'Platinum',
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

export function getUserTier(points: number) {
    const tier = TIERS.find(tier => points >= tier.min && points <= tier.max);
    if (tier) return tier;

    // Fallback for points < 100 (Newcomers)
    return {
        name: 'Newcomer',
        min: 0,
        max: 99,
        benefit: 'Passez Bronze pour 5% de remise',
        color: 'from-gray-500 to-gray-700',
        borderColor: 'border-gray-500',
        textColor: 'text-gray-400',
        iconColor: 'bg-gray-500',
        emoji: '🌱'
    };
}

export function getNextTier(points: number) {
    const currentTierIndex = TIERS.findIndex(tier => points >= tier.min && points <= tier.max);
    if (currentTierIndex === -1 || currentTierIndex === TIERS.length - 1) return null;
    return TIERS[currentTierIndex + 1];
}
