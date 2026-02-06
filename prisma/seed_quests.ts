import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
    console.log('Seeding Quests...');

    const quests = [
        // ==========================================
        // ACT 0: INITIATION (1 Quest) - Tutorial
        // ==========================================
        {
            id: 'q-act0-1',
            title: 'First Contact',
            description: 'Passez votre première commande',
            type: 'ONE_OFF',
            rewardType: 'XP',
            rewardAmount: 100,
            minAct: 0,
            validationConfig: {
                targetCount: 1
            }
        },
        {
            id: 'q-promo-1',
            title: 'Le Festin du Baron',
            description: 'Valider un Festin du Baron (Promo)',
            type: 'COLLECTION',
            rewardType: 'TOKEN',
            rewardAmount: 50,
            minAct: 0,
            validationConfig: {
                promoName: 'Festin du Baron'
            }
        },

        // ==========================================
        // ACT I: THE PACT (2 Quests) - Building Habits
        // ==========================================
        {
            id: 'q-act1-1',
            title: 'Tactical Lunch',
            description: 'Commande entre 12:00 et 14:00',
            type: 'TIME',
            rewardType: 'XP',
            rewardAmount: 300,
            minAct: 1,
            validationConfig: {
                startTime: '12:00',
                endTime: '14:00'
            }
        },
        {
            id: 'q-act1-2',
            title: 'Syndicate Recruit',
            description: 'Invitez un ami',
            type: 'SOCIAL',
            rewardType: 'TOKEN',
            rewardAmount: 50,
            minAct: 1,
            validationConfig: {}
        },

        // ==========================================
        // ACT II: ASCENSION (3 Quests) - Dedicated
        // ==========================================
        {
            id: 'q-act2-1',
            title: 'Night Owl',
            description: 'Commande après 22:00',
            type: 'TIME',
            rewardType: 'XP',
            rewardAmount: 600,
            minAct: 2,
            validationConfig: {
                startTime: '22:00',
                endTime: '23:59'
            }
        },
        {
            id: 'q-act2-2',
            title: 'Supply Drop',
            description: 'Commande > 60 TND',
            type: 'COLLECTION',
            rewardType: 'XP',
            rewardAmount: 800,
            minAct: 2,
            validationConfig: {
                minOrderValue: 60
            }
        },
        {
            id: 'q-act2-3',
            title: 'Weekender',
            description: 'Commande le Weekend',
            type: 'STREAK',
            rewardType: 'TOKEN',
            rewardAmount: 150,
            minAct: 2,
            validationConfig: {
                days: [5, 6, 0] // Fri-Sun
            }
        },

        // ==========================================
        // ACT III: POWER (4 Quests) - Elite
        // ==========================================
        {
            id: 'q-act3-1',
            title: 'The Regular',
            description: '3 Commandes en 7 jours',
            type: 'STREAK',
            rewardType: 'XP',
            rewardAmount: 1500,
            minAct: 3,
            validationConfig: {
                targetCount: 3,
                timeframe: '7d'
            }
        },
        {
            id: 'q-act3-2',
            title: 'Gourmet Hunter',
            description: 'Essayez 10 items différents',
            type: 'COLLECTION',
            rewardType: 'XP',
            rewardAmount: 2000,
            minAct: 3,
            validationConfig: {
                targetCount: 10
            }
        },
        {
            id: 'q-act3-3',
            title: 'High Roller',
            description: 'Dépensez 500 TND au total',
            type: 'SPEND',
            rewardType: 'XP',
            rewardAmount: 2500,
            minAct: 3,
            validationConfig: {
                spendAmount: 500
            }
        },
        {
            id: 'q-act3-4',
            title: 'Sharing is Caring',
            description: 'Invitez 3 amis',
            type: 'SOCIAL',
            rewardType: 'TOKEN',
            rewardAmount: 500,
            minAct: 3,
            validationConfig: {
                targetCount: 3
            }
        },

        // ==========================================
        // ACT IV: LEGEND (5 Quests) - Impossible
        // ==========================================
        {
            id: 'q-act4-1',
            title: 'Godfather Feast',
            description: 'Commande > 250 TND',
            type: 'COLLECTION',
            rewardType: 'TOKEN',
            rewardAmount: 1000,
            minAct: 4,
            validationConfig: {
                minOrderValue: 250
            }
        },
        {
            id: 'q-act4-2',
            title: 'Loyalty King',
            description: 'Maintenir un streak de 10 jours',
            type: 'STREAK',
            rewardType: 'XP',
            rewardAmount: 5000,
            minAct: 4,
            validationConfig: {
                targetCount: 10
            }
        },
        {
            id: 'q-act4-3',
            title: 'Master Collector',
            description: 'Posséder 20 items du Shop',
            type: 'COLLECTION',
            rewardType: 'XP',
            rewardAmount: 7500,
            minAct: 4,
            validationConfig: {
                targetCount: 20
            }
        },
        {
            id: 'q-act4-4',
            title: 'The Philanthropist',
            description: 'Offrir une carte cadeau (Soon)',
            type: 'SOCIAL',
            rewardType: 'TOKEN',
            rewardAmount: 2000,
            minAct: 4,
            validationConfig: {}
        },
        {
            id: 'q-act4-5',
            title: 'Syndicate Icon',
            description: 'Atteindre 50000 XP Total',
            type: 'ONE_OFF',
            rewardType: 'TOKEN',
            rewardAmount: 5000,
            minAct: 4,
            validationConfig: {
                targetXP: 50000
            }
        }
    ];

    console.log(`Clearing old quests...`);
    // Optional: await prisma.quest.deleteMany({}); 

    for (const q of quests) {
        await prisma.quests.upsert({
            where: { id: q.id },
            update: {
                ...q,
                updatedAt: new Date()
            },
            create: {
                ...q,
                updatedAt: new Date()
            },
        });
    }

    console.log(`Seeded ${quests.length} Quests!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
