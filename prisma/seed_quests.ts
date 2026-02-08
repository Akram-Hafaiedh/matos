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
            reward_type: 'XP',
            reward_amount: 100,
            min_act: 0,
            validation_config: {
                targetCount: 1
            }
        },
        {
            id: 'q-promo-1',
            title: 'Le Festin du Baron',
            description: 'Valider un Festin du Baron (Promo)',
            type: 'COLLECTION',
            reward_type: 'TOKEN',
            reward_amount: 50,
            min_act: 0,
            validation_config: {
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
            reward_type: 'XP',
            reward_amount: 300,
            min_act: 1,
            validation_config: {
                startTime: '12:00',
                endTime: '14:00'
            }
        },
        {
            id: 'q-act1-2',
            title: 'Syndicate Recruit',
            description: 'Invitez un ami',
            type: 'SOCIAL',
            reward_type: 'TOKEN',
            reward_amount: 50,
            min_act: 1,
            validation_config: {}
        },

        // ==========================================
        // ACT II: ASCENSION (3 Quests) - Dedicated
        // ==========================================
        {
            id: 'q-act2-1',
            title: 'Night Owl',
            description: 'Commande après 22:00',
            type: 'TIME',
            reward_type: 'XP',
            reward_amount: 600,
            min_act: 2,
            validation_config: {
                startTime: '22:00',
                endTime: '23:59'
            }
        },
        {
            id: 'q-act2-2',
            title: 'Supply Drop',
            description: 'Commande > 60 TND',
            type: 'COLLECTION',
            reward_type: 'XP',
            reward_amount: 800,
            min_act: 2,
            validation_config: {
                minOrderValue: 60
            }
        },
        {
            id: 'q-act2-3',
            title: 'Weekender',
            description: 'Commande le Weekend',
            type: 'STREAK',
            reward_type: 'TOKEN',
            reward_amount: 150,
            min_act: 2,
            validation_config: {
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
            reward_type: 'XP',
            reward_amount: 1500,
            min_act: 3,
            validation_config: {
                targetCount: 3,
                timeframe: '7d'
            }
        },
        {
            id: 'q-act3-2',
            title: 'Gourmet Hunter',
            description: 'Essayez 10 items différents',
            type: 'COLLECTION',
            reward_type: 'XP',
            reward_amount: 2000,
            min_act: 3,
            validation_config: {
                targetCount: 10
            }
        },
        {
            id: 'q-act3-3',
            title: 'High Roller',
            description: 'Dépensez 500 TND au total',
            type: 'SPEND',
            reward_type: 'XP',
            reward_amount: 2500,
            min_act: 3,
            validation_config: {
                spendAmount: 500
            }
        },
        {
            id: 'q-act3-4',
            title: 'Sharing is Caring',
            description: 'Invitez 3 amis',
            type: 'SOCIAL',
            reward_type: 'TOKEN',
            reward_amount: 500,
            min_act: 3,
            validation_config: {
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
            reward_type: 'TOKEN',
            reward_amount: 1000,
            min_act: 4,
            validation_config: {
                minOrderValue: 250
            }
        },
        {
            id: 'q-act4-2',
            title: 'Loyalty King',
            description: 'Maintenir un streak de 10 jours',
            type: 'STREAK',
            reward_type: 'XP',
            reward_amount: 5000,
            min_act: 4,
            validation_config: {
                targetCount: 10
            }
        },
        {
            id: 'q-act4-3',
            title: 'Master Collector',
            description: 'Posséder 20 items du Shop',
            type: 'COLLECTION',
            reward_type: 'XP',
            reward_amount: 7500,
            min_act: 4,
            validation_config: {
                targetCount: 20
            }
        },
        {
            id: 'q-act4-4',
            title: 'The Philanthropist',
            description: 'Offrir une carte cadeau (Soon)',
            type: 'SOCIAL',
            reward_type: 'TOKEN',
            reward_amount: 2000,
            min_act: 4,
            validation_config: {}
        },
        {
            id: 'q-act4-5',
            title: 'Syndicate Icon',
            description: 'Atteindre 50000 XP Total',
            type: 'ONE_OFF',
            reward_type: 'TOKEN',
            reward_amount: 5000,
            min_act: 4,
            validation_config: {
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
                updated_at: new Date()
            },
            create: {
                ...q,
                updated_at: new Date()
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
