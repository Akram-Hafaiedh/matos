require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../app/generated/prisma');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PROMOS = [
    {
        name: 'Festin du Baron',
        badge_text: 'QUEST SYNC',
        description: '3 Pizzas Signature + 2 Accompagnements + Giga Drink. Valide la quête "Le Festin du Baron".',
        price: 48.9,
        original_price: 62.0,
        image_url: "/giga-sultan-promo.png",
        badge_color: '#EAB308', // yellow
        tag: '+50 M-TOKENS',
        is_hot: true,
        is_active: true
    },
    {
        name: 'Mardi Infiltration',
        badge_text: 'WEEKLY MISSION',
        description: 'Infiltrez le menu classique à prix sacrifié. Cumulez des XP pour votre rang Syndicate.',
        price: 12.0,
        original_price: 18.5,
        image_url: "/mardi-infiltration-promo.png",
        badge_color: '#A855F7', // purple
        tag: 'SPECIAL XP',
        is_hot: false,
        is_active: true
    },
    {
        name: 'Duo du Syndicat',
        badge_text: 'LIMITED PACT',
        description: '2 Pizzas + 12 Nuggets + Sauces. Le pacte parfait pour les duos de l\'ombre.',
        price: 34.5,
        original_price: 45.0,
        image_url: "/duo-syndicate-promo.png",
        badge_color: '#06B6D4', // cyan
        tag: 'RANK UP',
        is_hot: true,
        is_active: true
    },
    {
        name: 'Mission Solo',
        badge_text: 'FIELD AGENT',
        description: '1 Pizza Junior + 1 Frites + 1 Buvable. Rapide, efficace, létal.',
        price: 15.9,
        original_price: 21.0,
        image_url: '/pizzas/solo-promo.png',
        badge_color: '#EC4899', // pink
        tag: 'QUICK XP',
        is_hot: false,
        is_active: true
    }
];

async function main() {
    console.log('Seeding promotions...');
    for (const promo of PROMOS) {
        await prisma.promotions.create({
            data: promo
        });
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
