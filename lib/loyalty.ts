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

export const QUESTS = [
    { id: 'q1', title: 'Tactical Lunch', description: 'Commande entre 12:00 et 14:00 (Mar-Sam)', reward: '150 XP', progress: 0.5, type: 'TIME', minAct: 0 },
    { id: 'q2', title: 'Weekender Protocol', description: 'Une commande le Vendredi ou Samedi', reward: '300 XP', progress: 0, type: 'STREAK', minAct: 0 },
    { id: 'q3', title: 'Signature Hunter', description: 'Essayez 5 items différents du menu', reward: '500 XP', progress: 0.8, type: 'COLLECTION', minAct: 1 },
    { id: 'q4', title: 'Syndicate Recruit', description: 'Invitez un ami à rejoindre le rang', reward: '100 Jetons', progress: 0, type: 'SOCIAL', minAct: 1 },
];

/**
 * Returns a descriptive text for a booster if the database description is missing.
 */
export function getBoosterDescription(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('xp overdrive')) return 'Double XP sur toutes les commandes et quêtes.';
    if (lowerName.includes('token magnet')) return 'Gagnez plus de jetons par TND dépensé.';
    if (lowerName.includes('lucky drop')) return 'Augmente vos chances d\'obtenir du loot rare.';
    if (lowerName.includes('protocol hack')) return 'Accès facilité aux protocoles de quêtes.';
    return 'Booster actif augmentant vos performances.';
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

export const SHOP_ITEMS = [
    // LOOT BOXES
    { id: 1, name: 'Shadow Crate', type: 'Loot Boxes', price: 500, act: 1, level: 1, rarity: 'Common', emoji: '📦' },
    { id: 2, name: 'Operative Cache', type: 'Loot Boxes', price: 1200, act: 1, level: 5, rarity: 'Uncommon', emoji: '🎁' },
    { id: 3, name: 'Sultan Chest', type: 'Loot Boxes', price: 3000, act: 2, level: 2, rarity: 'Rare', emoji: '🎖️' },
    { id: 4, name: 'Syndicate Vault', type: 'Loot Boxes', price: 7500, act: 3, level: 1, rarity: 'Epic', emoji: '🔒' },
    { id: 5, name: 'Obsidian Case', type: 'Loot Boxes', price: 15000, act: 4, level: 5, rarity: 'Legendary', emoji: '💎' },

    // AURAS (Backgrounds)
    { id: 6, name: 'Neon Pulse', type: 'Auras', price: 800, act: 1, level: 3, rarity: 'Common', emoji: '🌈' },
    { id: 7, name: 'Acid Rain', type: 'Auras', price: 1500, act: 2, level: 1, rarity: 'Uncommon', emoji: '🧪' },
    { id: 8, name: 'Digital Ghost', type: 'Auras', price: 2500, act: 2, level: 4, rarity: 'Rare', emoji: '👻' },
    { id: 9, name: 'Solar Flare', type: 'Auras', price: 5000, act: 3, level: 3, rarity: 'Epic', emoji: '🌞' },
    { id: 10, name: 'Void Matter', type: 'Auras', price: 12000, act: 4, level: 2, rarity: 'Legendary', emoji: '🌑' },

    // FRAMES
    { id: 11, name: 'Steel Wire', type: 'Frames', price: 600, act: 1, level: 2, rarity: 'Common', emoji: '🖼️' },
    { id: 12, name: 'Carbon Fiber', type: 'Frames', price: 1800, act: 2, level: 1, rarity: 'Uncommon', emoji: '⬛' },
    { id: 13, name: 'Gold Trim', type: 'Frames', price: 4000, act: 2, level: 5, rarity: 'Rare', emoji: '✨' },
    { id: 14, name: 'Plasma Glow', type: 'Frames', price: 8000, act: 3, level: 4, rarity: 'Epic', emoji: '🟣' },
    { id: 15, name: 'Reality Glitch', type: 'Frames', price: 20000, act: 4, level: 4, rarity: 'Legendary', emoji: '🌀' },

    // TITLES
    { id: 16, name: 'Shadow', type: 'Titles', price: 300, act: 1, level: 1, rarity: 'Common', emoji: '👤' },
    { id: 17, name: 'Runner', type: 'Titles', price: 900, act: 1, level: 4, rarity: 'Uncommon', emoji: '🏃' },
    { id: 18, name: 'Mastermind', type: 'Titles', price: 2200, act: 2, level: 3, rarity: 'Rare', emoji: '🧠' },
    { id: 19, name: 'Ghost in Shell', type: 'Titles', price: 5500, act: 3, level: 2, rarity: 'Epic', emoji: '🛸' },
    { id: 20, name: 'True Prophet', type: 'Titles', price: 15000, act: 4, level: 1, rarity: 'Legendary', emoji: '👁️' },

    // BOOSTERS
    { id: 21, name: 'XP Overdrive (1h)', type: 'Boosters', price: 400, act: 1, level: 1, rarity: 'Common', emoji: '⚡' },
    { id: 22, name: 'Token Magnet (3h)', type: 'Boosters', price: 1100, act: 2, level: 1, rarity: 'Uncommon', emoji: '🧲' },
    { id: 23, name: 'Lucky Drop (24h)', type: 'Boosters', price: 3500, act: 2, level: 5, rarity: 'Rare', emoji: '🍀' },
    { id: 24, name: 'Protocol Hack', type: 'Boosters', price: 7000, act: 3, level: 3, rarity: 'Epic', emoji: '💻' },

    // EXCLUSIVE
    { id: 25, name: 'VIP Pass - Act I', type: 'Exclusive', price: 1000, act: 1, level: 5, rarity: 'Epic', emoji: '🎟️' },
    { id: 26, name: 'Mato\'s Secret Sauce', type: 'Exclusive', price: 5000, act: 2, level: 10, rarity: 'Legendary', emoji: '🥫' },
];

// Seed random items
const SEEDED_ITEMS = Array.from({ length: 34 }, (_, i) => {
    const id = i + 27;
    const act = Math.floor(Math.random() * 4) + 1;
    const level = Math.floor(Math.random() * 10) + 1;
    const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
    return {
        id,
        name: `${type.slice(0, -1)} Protocole #${id}`,
        type,
        price: id * 250,
        act,
        level,
        rarity: id > 50 ? 'Legendary' : id > 40 ? 'Epic' : id > 30 ? 'Rare' : 'Common',
        emoji: '🔧'
    };
});

SHOP_ITEMS.push(...SEEDED_ITEMS);
