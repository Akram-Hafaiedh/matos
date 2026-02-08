import 'dotenv/config';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from '../app/generated/prisma/client'
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const menuItems = {
    pizza: [
        { id: 'psr1', name: 'Pizza Margherita', price: { xl: 10, xxl: 12 }, ingredients: 'Sauce tomate, mozzarella, basilic, olives', popular: true, image: '/images/pizza/pizza_sr_margherita.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psr2', name: 'Pizza Neptune', price: { xl: 12, xxl: 17 }, ingredients: 'Sauce tomate, fromage mozzarella, thon, olives', bestseller: true, image: '/images/pizza/pizza_sr_neptune.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psr3', name: 'Pizza Montagnarde', price: { xl: 14, xxl: 19 }, ingredients: 'Sauce tomate, mozzarella, charcuterie, champignons', image: '/images/pizza/pizza_sr_montagnarde.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psr4', name: 'Pizza Napolitaine', price: { xl: 13, xxl: 18 }, ingredients: 'Sauce tomate, mozzarella, basilic, anchois, câpres, olives', hot: true, image: '/images/pizza/pizza_sr_napolitaine.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psr5', name: 'Pizza Arménienne', price: { xl: 18, xxl: 22 }, ingredients: 'Sauce tomate, mozzarella, bœuf haché, poivrons, oignons', image: '/images/pizza/pizza_sr_armenienne.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psr6', name: 'Pizza Quatre Fromages', price: { xl: 20, xxl: 23 }, ingredients: 'Sauce tomate, mozzarella, gruyère, cheddar, parmesan', image: '/images/pizza/pizza_sr_quatres_fromages.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psr7', name: 'Pizza Viking', price: { xl: 19, xxl: 23 }, ingredients: 'Sauce tomate, mozzarella, bœuf et filocher, pommes de terre, écrasées', image: '/images/pizza/pizza_sr_viking.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psr8', name: 'Pizza Caesar', price: { xl: 16, xxl: 20 }, ingredients: 'Sauce tomate, mozzarella, poulet pané, croûton, parmesan balsamique', image: '/images/pizza/pizza_sr_caesar.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psr9', name: 'Pizza Pepperoni', price: { xl: 16, xxl: 20 }, ingredients: 'Sauce tomate, mozzarella, pepperoni, olives', popular: true, image: '/images/pizza/pizza_sr_peperoni.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psr10', name: 'Pizza Fruits De Mer', price: { xl: 23, xxl: 29 }, ingredients: 'Sauce tomate, mozzarella, fruits de mer, olive, olives', image: '/images/pizza/pizza_sr_fruit_de_mer.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psr11', name: 'Pizza Végans', price: { xl: 13, xxl: 17 }, ingredients: 'Sauce tomate, mozzarella, légumes, champignons', image: '/images/pizza/pizza_sr_vegans.png', category: 'pizza', sauce: 'rouge' },
        { id: 'psb1', name: 'Pizza Poulet', price: { xl: 15, xxl: 18 }, ingredients: 'Sauce blanche, mozzarella, poulet, nature, olives', image: '/images/pizza/pizza_sb_poulet.png', category: 'pizza', sauce: 'blanche' },
        { id: 'psb2', name: 'Pizza Alpine', price: { xl: 15, xxl: 19 }, ingredients: 'Sauce blanche, mozzarella, pommes de terre écrasées, jambon, olives', image: '/images/pizza/pizza_sb_alpine.png', category: 'pizza', sauce: 'blanche' },
        { id: 'psb3', name: 'Pizza Miel', price: { xl: 17, xxl: 20 }, ingredients: 'Sauce blanche, mozzarella, poulet pané, miel', bestseller: true, image: '/images/pizza/pizza_sb_miel.png', category: 'pizza', sauce: 'blanche' },
        { id: 'psb4', name: 'Pizza Fromaggi', price: { xl: 20, xxl: 24 }, ingredients: 'Sauce blanche, mozzarella, gruyère, cheddar, fromage bleu', image: '/images/pizza/pizza_sb_fromaggi.png', category: 'pizza', sauce: 'blanche' },
        { id: 'psb5', name: 'Pizza Norvégienne', price: { xl: 23, xxl: 29 }, ingredients: 'Sauce blanche, mozzarella, saumon fumé, aneth', image: '/images/pizza/pizza_sb_norvegienne.png', category: 'pizza', sauce: 'blanche' },
        { id: 'psb6', name: 'Pizza Texane', price: { xl: 20, xxl: 25 }, ingredients: 'Sauce blanche, mozzarella, goûta, épinard, viande, hachée, champignons', image: '/images/pizza/pizza_sb_texane.png', category: 'pizza', sauce: 'blanche' },
    ],
    tacos: [
        { id: 't1', name: 'Tacos Escalope Grillée', price: 8, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée', popular: true, image: '/images/tacos/tacos_escalope_grillee.png', category: 'tacos' },
        { id: 't2', name: 'Tacos Crispy Chicken', price: 10, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, crispy chicken', image: '/images/tacos/tacos_crispy_chicken.png', category: 'tacos' },
        { id: 't3', name: 'Tacos Cordon Bleu', price: 11, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, cordon bleu', bestseller: true, image: '/images/tacos/tacos_cordon_bleu.png', category: 'tacos' },
        { id: 't4', name: 'Tacos Viande Hachée', price: 13, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, viande hachée', image: '/images/tacos/tacos_viande_hachee.png', category: 'tacos' },
        { id: 't5', name: 'Tacos Forestière', price: 14, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée, champignon', image: '/images/tacos/tacos_forestiere.png', category: 'tacos' },
    ],
    makloub: [
        { id: 'm1', name: 'Makloub Escalope Grillée', price: 10, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée', image: '/images/makloub/makloub_escalope_grillée.png', category: 'makloub' },
        { id: 'm2', name: 'Makloub Crispy Chicken', price: 11, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, crispy chicken', image: '/images/makloub/makloub_crispy_chicken.png', category: 'makloub' },
        { id: 'm3', name: 'Makloub Cordon Bleu', price: 12.5, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, cordon bleu', bestseller: true, image: '/images/makloub/makloub_cordon_bleu.png', category: 'makloub' },
        { id: 'm4', name: 'Makloub Viande Hachée', price: 14.5, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, viande hachée', image: '/images/makloub/makloub_viande_hachée.png', category: 'makloub' },
        { id: 'm5', name: 'Makloub Forestière', price: 15.5, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée, champignon', image: '/images/makloub/makloub_forestière.png', category: 'makloub' },
    ],
    baguetteFarcie: [
        { id: 'bf1', name: 'Baguette Farcie Escalope Grillée', price: 10, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée', popular: true, image: '/images/baguette_farcie.png', category: 'sandwich' },
        { id: 'bf2', name: 'Baguette Farcie Crispy Chicken', price: 11, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, crispy chicken', image: '/images/baguette_farcie.png', category: 'sandwich' },
        { id: 'bf3', name: 'Baguette Farcie Cordon Bleu', price: 12.5, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, cordon bleu', image: '/images/baguette_farcie.png', category: 'sandwich' },
        { id: 'bf4', name: 'Baguette Farcie Viande Hachée', price: 14.5, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, viande hachée', image: '/images/baguette_farcie.png', category: 'sandwich' },
        { id: 'bf5', name: 'Baguette Farcie Forestière', price: 15.5, ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée, champignon', image: '/images/baguette_farcie.png', category: 'sandwich' },
    ],
    sandwich: [
        { id: 's1', name: 'Escalope Grillée', price: 8, ingredients: 'Ciabatta, rustique, pain, baguette', popular: true, image: '🥪', category: 'sandwich' },
        { id: 's2', name: 'Crispy Chicken', price: 10, ingredients: 'Ciabatta, rustique, pain, baguette', image: '🥪', category: 'sandwich' },
        { id: 's3', name: 'Cordon Bleu', price: 12, ingredients: 'Ciabatta, rustique, pain, baguette', image: '🥪', category: 'sandwich' },
        { id: 's4', name: 'Viande Hachée', price: 12, ingredients: 'Ciabatta, rustique, pain, baguette', image: '🥪', category: 'sandwich' },
        { id: 's5', name: 'Jambon De Dinde', price: 6, ingredients: 'Ciabatta, rustique, pain, baguette', bestseller: true, image: '🥪', category: 'sandwich' },
    ],
    burger: [
        { id: 'b1', name: 'Classique', price: 14, ingredients: 'Pain, viande, salade, tomate', popular: true, image: '🍔', category: 'burger' },
        { id: 'b2', name: 'Cheeseburger', price: 16, ingredients: 'Pain, viande, cheddar, salade', bestseller: true, image: '🍔', category: 'burger' },
        { id: 'b3', name: 'Rustique', price: 18, ingredients: 'Pain rustique, viande, légumes', image: '🍔', category: 'burger' },
        { id: 'b4', name: 'Crispy Chicken', price: 13, ingredients: 'Pain, poulet croustillant, sauce', hot: true, image: '🍗', category: 'burger' },
    ],
    plat: [
        { id: 'pl1', name: 'Tenders 6 Pcs', price: 5, ingredients: 'Poulet pané croustillant', image: '/images/plat/plat_chicken_tenders_6_pcs.png', category: 'plat' },
        { id: 'pl2', name: 'Tenders 8 Pcs', price: 8, ingredients: 'Poulet pané croustillant', image: '/images/plat/plat_chicken_tenders_9_pcs.png', category: 'plat' },
        { id: 'pl3', name: 'Chicken Wings 6 Pcs', price: 6, ingredients: 'Ailes de poulet épicées', image: '/images/plat/plat_chicken_wings_6_pcs.png', category: 'plat' },
        { id: 'pl4', name: 'Chicken Wings 9 Pcs', price: 9, ingredients: 'Ailes de poulet épicées', image: '/images/plat/plat_chicken_wings_9_pcs.png', category: 'plat' },
        { id: 'pl5', name: 'Cuisse De Poulet Braisé', price: 10, ingredients: 'Cuisse de poulet marinée et grillée', popular: true, image: '/images/plat/plat_cuisse_de_poulet_braisé.png', category: 'plat' },
        { id: 'pl6', name: 'Cordons Bleu Maison', price: 12, ingredients: 'Cordon bleu fait maison', image: '/images/plat/plat_cordon_bleu_maison.png', category: 'plat' },
        { id: 'pl7', name: 'Émincé De Bœuf, Sauce Blanche', price: 16, ingredients: 'Bœuf émincé avec sauce crémeuse', image: '/images/plat/plat_emincé_boeuf_sauce_blanche.png', category: 'plat' },
        { id: 'pl8', name: 'Lasagne', price: 18, ingredients: 'Lasagne à la viande et béchamel', bestseller: true, image: '/images/plat/plat_lasagne.png', category: 'plat' },
        { id: 'pl9', name: 'Plat Escalope Grillée', price: 15, ingredients: 'Riz, salade verte, salade mechouia, harissa, sauce à l\'ail, frites, escalope grillée', image: '/images/plat/plat_escalope_grillée.png', category: 'plat' },
        { id: 'pl10', name: 'Plat Cuisse De Poulet Rôti', price: 17, ingredients: 'Riz, salade verte, salade mechouia, harissa, sauce à l\'ail, frites, cuisse de poulet rôti', image: '/images/plat/plat_cuisse_de_poulet_rôti.png', category: 'plat' },
        { id: 'pl11', name: 'Plat Escalope Panée', price: 17, ingredients: 'Riz, salade verte, salade mechouia, harissa, sauce à l\'ail, frites, escalope panée', image: '/images/plat/plat_escalope_panée.png', category: 'plat' },
    ],
    salade: [
        { id: 'sal1', name: 'Salade Caesar', price: 13, ingredients: 'Laitue, poulet, croûtons, parmesan, sauce caesar', image: '🥗', category: 'salade' },
        { id: 'sal2', name: 'Salade Chicken Cowslow', price: 13, ingredients: 'Poulet, chou, carottes, sauce coleslaw', image: '🥗', category: 'salade' },
        { id: 'sal3', name: 'Salade Méditerranéenne', price: 13, ingredients: 'Thon, maïs, olive, vinaigrette', image: '🥗', category: 'salade' },
        { id: 'sal4', name: 'Salade Crunchy', price: 15, ingredients: 'Poulet pané, chips de tortillas, sauce salade', image: '🥗', category: 'salade' },
        { id: 'sal5', name: 'Dynamite Poulet', price: 9, ingredients: 'Poulet épicé avec sauce dynamite', hot: true, image: '🌶️', category: 'salade' },
        { id: 'sal6', name: 'Salade Fruits De Mer', price: 23, ingredients: 'Fruits de mer frais, vinaigrette', image: '🥗', category: 'salade' },
    ],
    friesGratine: [
        { id: 'fg1', name: 'Fries Crispy Chiken', price: 12, ingredients: 'Frites gratinées au fromage avec poulet crispy', image: '🍟', category: 'sides' },
        { id: 'fg2', name: 'Fries Bœuf Haché', price: 14, ingredients: 'Frites gratinées au fromage avec bœuf haché', image: '🍟', category: 'sides' },
        { id: 'fg3', name: 'Fries Poulet Nature', price: 10, ingredients: 'Frites gratinées au fromage avec poulet nature', image: '🍟', category: 'sides' },
    ],
    coinTunisien: [
        { id: 'ct1', name: 'Madfouna', price: 23, ingredients: 'Spécialité tunisienne traditionnelle', popular: true, image: '/images/tunisian/madfouna.png', category: 'tunisian' },
        { id: 'ct2', name: 'Pate Poulet A La Tunisienne', price: 14, ingredients: 'Pâtes au poulet à la tunisienne', image: '/images/tunisian/pate_poulet_a_la_tunisienne.png', category: 'tunisian' },
    ],
    menuEnfants: [
        { id: 'me1', name: 'Mini Pizza', price: 5, ingredients: 'Pizza enfant avec frites', image: '🍕', category: 'kids' },
        { id: 'me2', name: 'Tenders', price: 5, ingredients: 'Tenders avec frites', image: '🍗', category: 'kids' },
    ],
    drinks: [
        { id: 'd1', name: 'Canette', price: 2.5, ingredients: 'Coca, Fanta, Sprite, Boga Lim, Boga Cidre, Apla Pomme', image: '/images/drinks/soda.png', category: 'drinks' },
        { id: 'd2', name: 'Eau Minérale 0.5 L', price: 1.5, ingredients: 'Eau minérale', image: '/images/drinks/water_0.5L.png', category: 'drinks' },
        { id: 'd3', name: 'Eau 1L', price: 1, ingredients: 'Eau 1 litre', image: '/images/drinks/water_1L.png', category: 'drinks' },
        { id: 'd4', name: 'Citronnade Menthe', price: 2, ingredients: 'Citronnade fraîche à la menthe', popular: true, image: '/images/drinks/citronnade.png', category: 'drinks' },
        { id: 'd5', name: 'Fraise', price: 2, ingredients: 'Jus de fraise frais', image: '/images/drinks/fraise.png', category: 'drinks' },
        { id: 'd6', name: 'Jus Carottes', price: 2, ingredients: 'Jus de carottes frais', image: '/images/drinks/carottes.png', category: 'drinks' },
        { id: 'd7', name: 'Café Capsule', price: 3.5, ingredients: 'Café en capsule', image: '/images/drinks/cafe.png', category: 'drinks' },
    ],
    dessert: [
        { id: 'de1', name: 'Carottes Cake', price: 5, popular: true, ingredients: 'Gâteau aux carottes maison', image: '🍰', category: 'dessert' },
        { id: 'de2', name: 'Mousse Au Chocolat', price: 5, bestseller: true, ingredients: 'Mousse au chocolat onctueuse', image: '🍫', category: 'dessert' },
        { id: 'de3', name: 'Tarte Au Citron', price: 5, ingredients: 'Tarte au citron meringuée', image: '🥧', category: 'dessert' },
        { id: 'de4', name: 'Supp Tacos Gratiné', price: 3.5, ingredients: 'Supplément tacos gratiné', image: '🧀', category: 'dessert' },
    ],
    supplements: [
        { id: 'sup1', name: 'Gruyère', price: 2.5, ingredients: 'Supplément fromage gruyère', image: '🧀', category: 'supplements' },
        { id: 'sup2', name: 'Cheddar', price: 2, ingredients: 'Supplément cheddar', image: '🧀', category: 'supplements' },
        { id: 'sup3', name: 'Jambon', price: 2, ingredients: 'Supplément jambon', image: '🥓', category: 'supplements' },
    ],
    promos: [
        { id: 'promo1', name: 'Family Box', price: 68, ingredients: '2 crispy burger • 2 cheese burger • 2 tacos poulet • Viande hachée • 8 wings • 8 tenders • Riz vermicelles • Frites • Salade • 2 boissons', image: '👨‍👩‍👧‍👦', category: 'promos', bestseller: true, originalPrice: 85, savings: 17, discount: 20 },
        { id: 'promo2', name: 'Big Box', price: 44, ingredients: '1 crispy burger • 1 cheese burger • 1 tacos poulet pané • 1 tacos viande hachée • 4 wings • 4 tenders • Riz vermicelles • Frites • Salade • Coca 1L', image: '🍔', category: 'promos', popular: true, originalPrice: 55, savings: 11, discount: 20 },
        { id: 'promo3', name: 'Double Box', price: 32, ingredients: '1 cheeseburger • 1 tacos poulet grillé • 3 wings • 3 tenders • Frites', image: '🌮', category: 'promos', hot: true, originalPrice: 40, savings: 8, discount: 20 },
        { id: 'promo4', name: 'Pizza + Boisson Offerte', price: null, ingredients: 'Toute pizza XL ou XXL + 1 boisson au choix offerte', image: '🍕', category: 'promos' },
        { id: 'promo5', name: 'Menu Étudiant', price: 14, ingredients: '1 burger au choix • Frites • Boisson', image: '🎓', category: 'promos', originalPrice: 18, savings: 4, discount: 22 },
        { id: 'promo6', name: '2 Pizzas = -30%', price: null, ingredients: 'Achetez 2 pizzas XL ou XXL et bénéficiez de -30% sur la 2ème', image: '🍕🍕', category: 'promos', hot: true }
    ]
}

const categoryMap = new Map<string, number>();

async function cleanup() {
    console.log('Cleaning up existing data...');
    // Only cleanup categories that we are about to seed to avoid deleting user data if any
    const promoCat = await prisma.categories.findFirst({ where: { name: 'Promos' } });
    if (promoCat) {
        await prisma.menu_items.deleteMany({ where: { category_id: promoCat.id } });
    }
    // await prisma.promotion.deleteMany({}); 
}

async function seedCategories() {
    console.log('Seeding Categories...');
    const categoriesList = [
        { name: 'Pizzas', emoji: '🍕', idStr: 'pizza' },
        { name: 'Tacos', emoji: '🌮', idStr: 'tacos' },
        { name: 'Makloub', emoji: '🌮', idStr: 'makloub' },
        { name: 'Sandwichs', emoji: '🥪', idStr: 'sandwich' },
        { name: 'Burgers', emoji: '🍔', idStr: 'burger' },
        { name: 'Plats', emoji: '🍽️', idStr: 'plat' },
        { name: 'Salades', emoji: '🥗', idStr: 'salade' },
        { name: 'Sides', emoji: '🍟', idStr: 'sides' },
        { name: 'Tunisien', emoji: '🇹🇳', idStr: 'tunisian' },
        { name: 'Enfants', emoji: '👶', idStr: 'kids' },
        { name: 'Boissons', emoji: '🥤', idStr: 'drinks' },
        { name: 'Desserts', emoji: '🍰', idStr: 'dessert' },
        { name: 'Suppléments', emoji: '🧀', idStr: 'supplements' },
    ];

    for (const cat of categoriesList) {
        let category = await prisma.categories.findFirst({ where: { name: cat.name } });

        if (!category) {
            category = await prisma.categories.create({
                data: {
                    name: cat.name,
                    emoji: cat.emoji,
                    display_order: categoriesList.indexOf(cat) + 1
                }
            });
            console.log(`Created Category: ${cat.name}`);
        }
        categoryMap.set(cat.idStr, category.id);
    }
}

async function seedMenuItems() {
    console.log('Seeding Menu Items...');

    for (const [key, items] of Object.entries(menuItems)) {
        if (key === 'promos') continue;

        for (const item of items) {
            const categoryId = categoryMap.get((item as any).category) || categoryMap.get(key);

            if (!categoryId) {
                console.warn(`Category not found for item: ${item.name} (${(item as any).category})`);
                continue;
            }

            let finalPrice: any = item.price;
            if (finalPrice === null || finalPrice === undefined) finalPrice = 0;

            const ingredientsArray = typeof item.ingredients === 'string'
                ? item.ingredients.split(',').map(s => s.trim())
                : [];

            const exists = await prisma.menu_items.findFirst({ where: { name: item.name } });

            if (!exists) {
                await prisma.menu_items.create({
                    data: {
                        name: item.name,
                        price: finalPrice,
                        category_id: categoryId,
                        image_url: (item as any).image,
                        ingredients: ingredientsArray,
                        popular: (item as any).popular || false,
                        bestseller: (item as any).bestseller || false,
                        hot: (item as any).hot || false,
                        discount: (item as any).discount || null,
                        sauce: (item as any).sauce || null,
                        updated_at: new Date()
                    }
                });
                console.log(`Created Item: ${item.name}`);
            } else {
                console.log(`Skipped (Exists): ${item.name}`);
            }
        }
    }
}

async function seedPromotions() {
    console.log('Seeding Promotions...');

    const PROMOS = [
        {
            name: 'Festin du Baron',
            badgeText: 'QUEST SYNC',
            description: '3 Pizzas Signature + 2 Accompagnements + Giga Drink. Valide la quête "Le Festin du Baron".',
            price: 48.9,
            originalPrice: 62.0,
            imageUrl: "/giga-sultan-promo.png",
            badgeColor: '#EAB308', // yellow
            tag: '+50 M-TOKENS',
            isHot: true,
            isActive: true,
            selectionRules: [
                { id: 'pizzas', label: 'Choisissez 3 Pizzas', quantity: 3, categoryId: categoryMap.get('pizza') },
                { id: 'sides', label: 'Choisissez 2 Accompagnements', quantity: 2, categoryId: categoryMap.get('sides') },
                { id: 'drinks', label: 'Choisissez 1 Boisson', quantity: 1, categoryId: categoryMap.get('drinks') }
            ]
        },
        {
            name: 'Mardi Infiltration',
            badgeText: 'WEEKLY MISSION',
            description: 'Infiltrez le menu classique à prix sacrifié. Cumulez des XP pour votre rang Syndicate.',
            price: 12.0,
            originalPrice: 18.5,
            imageUrl: "/mardi-infiltration-promo.png",
            badgeColor: '#A855F7', // purple
            tag: 'SPECIAL XP',
            isHot: false,
            isActive: true,
            selectionRules: [
                { id: 'main', label: 'Choisissez votre Pizza', quantity: 1, categoryId: categoryMap.get('pizza') },
                { id: 'drink', label: 'Choisissez votre Boisson', quantity: 1, categoryId: categoryMap.get('drinks') }
            ]
        },
        {
            name: 'Duo du Syndicat',
            badgeText: 'LIMITED PACT',
            description: '2 Pizzas + 12 Nuggets + Sauces. Le pacte parfait pour les duos de l\'ombre.',
            price: 34.5,
            originalPrice: 45.0,
            imageUrl: "/duo-syndicate-promo.png",
            badgeColor: '#06B6D4', // cyan
            tag: 'RANK UP',
            isHot: true,
            isActive: true,
            selectionRules: [
                { id: 'pizzas', label: 'Choisissez 2 Pizzas', quantity: 2, categoryId: categoryMap.get('pizza') },
                { id: 'sides', label: 'Choisissez 1 Side (ex: Nuggets)', quantity: 1, categoryId: categoryMap.get('sides') }
            ]
        },
        {
            name: 'Mission Solo',
            badgeText: 'FIELD AGENT',
            description: '1 Pizza Junior + 1 Frites + 1 Buvable. Rapide, efficace, létal.',
            price: 15.9,
            originalPrice: 21.0,
            imageUrl: '/solo-promo.png',
            badgeColor: '#EC4899', // pink
            tag: 'QUICK XP',
            isHot: false,
            isActive: true,
            selectionRules: [
                { id: 'pizza', label: 'Choisissez 1 Pizza', quantity: 1, categoryId: categoryMap.get('pizza') },
                { id: 'fries', label: 'Choisissez 1 Side / Frites', quantity: 1, categoryId: categoryMap.get('sides') },
                { id: 'drink', label: 'Choisissez 1 Boisson', quantity: 1, categoryId: categoryMap.get('drinks') }
            ]
        }
    ];

    for (const promo of PROMOS) {
        const exists = await prisma.promotions.findFirst({ where: { name: promo.name } });

        if (!exists) {
            await prisma.promotions.create({
                data: {
                    name: promo.name,
                    description: promo.description,
                    price: promo.price,
                    original_price: promo.originalPrice,
                    image_url: promo.imageUrl,
                    emoji: '🎁', // Default emoji 
                    is_active: promo.isActive,
                    badge_text: promo.badgeText,
                    badge_color: promo.badgeColor,
                    is_hot: promo.isHot,
                    tag: promo.tag,
                    selection_rules: promo.selectionRules as any // Assert as any to avoid strict JSON typing issues during seed if needed
                }
            });
            console.log(`Created Promotion: ${promo.name}`);
        } else {
            console.log(`Skipped (Exists): ${promo.name}`);
        }
    }
}

async function seedUsers() {
    console.log('Seeding Users...');

    // Cleanup old DiceBear avatars
    await prisma.user.updateMany({
        where: { image: { contains: 'dicebear.com' } },
        data: { image: null }
    });
    console.log('Cleared existing DiceBear avatars');

    // Admin
    const admin = {
        name: 'Admin Mato\'s',
        email: 'admin@matos.com',
        role: 'admin',
    };

    const adminExists = await prisma.user.findUnique({ where: { email: admin.email } });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 12);
        await prisma.user.create({
            data: {
                id: 'admin_1',
                ...admin,
                password: hashedPassword,
            }
        });
        console.log(`Created Admin: ${admin.email}`);
    }

    const customers = [
        { name: 'Ahmed Belhadj', email: 'ahmed@example.com', points: 5450 },
        { name: 'Sarra Mansouri', email: 'sarra@example.com', points: 3820 },
        { name: 'Yassine Ben Salem', email: 'yassine@example.com', points: 2950 },
        { name: 'Meriem Dridi', email: 'meriem@example.com', points: 1840 },
        { name: 'Firas Hammami', email: 'firas@example.com', points: 1250 },
        { name: 'Ines Khalfallah', email: 'ines@example.com', points: 980 },
        { name: 'Walid Rouissi', email: 'walid@example.com', points: 720 },
        { name: 'Amel Trabelsi', email: 'amel@example.com', points: 450 },
        { name: 'Skander Mejri', email: 'skander@example.com', points: 150 },
        { name: 'Hela Gharbi', email: 'hela@example.com', points: 80 },
    ];

    const commonPassword = await bcrypt.hash('password123', 12);
    for (const c of customers) {
        const exists = await prisma.user.findUnique({ where: { email: c.email } });
        if (!exists) {
            await prisma.user.create({
                data: {
                    id: `customer_${c.email.split('@')[0]}`,
                    name: c.name,
                    email: c.email,
                    role: 'customer',
                    password: commonPassword,
                    loyalty_points: c.points
                }
            });
            console.log(`Created Customer: ${c.email}`);
        } else {
            await prisma.user.update({
                where: { email: c.email },
                data: { loyalty_points: c.points }
            });
            console.log(`Updated Customer: ${c.email} (+XP Sync)`);
        }
    }
}

async function seedReviews() {
    console.log('Seeding Reviews...');
    const users = await prisma.user.findMany({ where: { role: 'customer' } });
    const items = await prisma.menu_items.findMany({ take: 10 });

    if (users.length === 0 || items.length === 0) {
        console.warn('Need users and items to seed reviews.');
        return;
    }

    const reviewTexts = [
        "Le meilleur burger de Tunis, sans aucun doute. Le service est rapide.",
        "Une expérience incroyable à chaque visite. Les produits sont frais.",
        "J'adore les tacos signature. C'est devenu mon rituel hebdomadaire.",
        "La pizza Margherita est simple mais parfaite. La pâte est excellente.",
        "Le crispy chicken est vraiment croustillant, je recommande !",
        "Un accueil chaleureux et une cuisine délicieuse. 5 étoiles méritées.",
        "Les portions sont généreuses et le goût est au rendez-vous.",
        "Le programme de fidélité est vraiment avantageux, j'ai déjà eu mon premier cadeau.",
        "L'ambiance à Carthage est tout simplement unique. Un must-go !",
        "Enfin un vrai fast-food premium à Tunis. Je reviendrai souvent.",
        "Le milkshake à la fraise est une tuerie ! Parfait pour finir le repas.",
        "Le plat escalope grillée est healthy et savoureux. Top !"
    ];
    for (let i = 0; i < reviewTexts.length; i++) {
        const user = users[i % users.length];
        const item = items[i % items.length];

        const exists = await prisma.reviews.findFirst({
            where: {
                user_id: user.id,
                menu_item_id: item.id
            }
        });

        if (!exists) {
            await prisma.reviews.create({
                data: {
                    user_id: user.id,
                    menu_item_id: item.id,
                    rating: 5,
                    comment: reviewTexts[i],
                }
            });
            console.log(`Created Review: ${user.name} -> ${item.name}`);
        } else {
            console.log(`Skipped (Exists): Review ${user.name} -> ${item.name}`);
        }
    }
}

async function seedShopItems() {
    console.log('Seeding Shop Items...');

    const SHOP_ITEMS = [
        // ... (existing items)
        { id: 'shop-1', name: 'Shadow Crate', type: 'Loot Boxes', price: 500, act: 1, level: 1, rarity: 'Common', emoji: '📦', description: 'Une caisse basique contenant des items communs.' },
        { id: 'shop-2', name: 'Operative Cache', type: 'Loot Boxes', price: 1200, act: 1, level: 5, rarity: 'Uncommon', emoji: '🎁', description: 'Cache tactique avec une chance d\'obtenir du rare.' },
        { id: 'shop-3', name: 'Sultan Chest', type: 'Loot Boxes', price: 3000, act: 2, level: 2, rarity: 'Rare', emoji: '🎖️', description: 'Coffre royal garantissant au moins un item rare.' },
        { id: 'shop-4', name: 'Syndicate Vault', type: 'Loot Boxes', price: 7500, act: 3, level: 1, rarity: 'Epic', emoji: '🔒', description: 'Le trésor du syndicat. Contient souvent du légendaire.' },
        { id: 'shop-5', name: 'Obsidian Case', type: 'Loot Boxes', price: 15000, act: 4, level: 5, rarity: 'Legendary', emoji: '💎', description: 'Artefact ancien. Contenu ultra-légendaire garanti.' },

        // AURAS (Backgrounds)
        { id: 'shop-6', name: 'Neon Pulse', type: 'Auras', price: 800, act: 1, level: 3, rarity: 'Common', emoji: '🌈', description: 'Une aura vibrante pour illuminer votre profil.' },
        { id: 'shop-7', name: 'Acid Rain', type: 'Auras', price: 1500, act: 2, level: 1, rarity: 'Uncommon', emoji: '🧪', description: 'Des gouttes acides qui tombent sur votre avatar.' },
        { id: 'shop-8', name: 'Digital Ghost', type: 'Auras', price: 2500, act: 2, level: 4, rarity: 'Rare', emoji: '👻', description: 'Devenez un spectre dans la machine.' },
        { id: 'shop-9', name: 'Solar Flare', type: 'Auras', price: 5000, act: 3, level: 3, rarity: 'Epic', emoji: '🌞', description: 'La puissance d\'une étoile en arrière-plan.' },
        { id: 'shop-10', name: 'Void Matter', type: 'Auras', price: 12000, act: 4, level: 2, rarity: 'Legendary', emoji: '🌑', description: 'L\'obscurité totale du néant intersidéral.' },

        // FRAMES
        { id: 'shop-11', name: 'Steel Wire', type: 'Frames', price: 600, act: 1, level: 2, rarity: 'Common', emoji: '🖼️', description: 'Cadre industriel simple.' },
        { id: 'shop-12', name: 'Carbon Fiber', type: 'Frames', price: 1800, act: 2, level: 1, rarity: 'Uncommon', emoji: '⬛', description: 'Résistant et léger. Style course.' },
        { id: 'shop-13', name: 'Gold Trim', type: 'Frames', price: 4000, act: 2, level: 5, rarity: 'Rare', emoji: '✨', description: 'Une touche de luxe pour votre avatar.' },
        { id: 'shop-14', name: 'Plasma Glow', type: 'Frames', price: 8000, act: 3, level: 4, rarity: 'Epic', emoji: '🟣', description: 'Bordure énergétique pulsante.' },
        { id: 'shop-15', name: 'Reality Glitch', type: 'Frames', price: 20000, act: 4, level: 4, rarity: 'Legendary', emoji: '🌀', description: 'Un cadre qui défie la stabilité dimensionnelle.' },

        // TITLES
        { id: 'shop-16', name: 'Shadow', type: 'Titles', price: 300, act: 1, level: 1, rarity: 'Common', emoji: '👤', description: 'Pour ceux qui agissent dans l\'ombre.' },
        { id: 'shop-17', name: 'Runner', type: 'Titles', price: 900, act: 1, level: 4, rarity: 'Uncommon', emoji: '🏃', description: 'Toujours en mouvement.' },
        { id: 'shop-18', name: 'Mastermind', type: 'Titles', price: 2200, act: 2, level: 3, rarity: 'Rare', emoji: '🧠', description: 'Le cerveau de l\'opération.' },
        { id: 'shop-19', name: 'Ghost in Shell', type: 'Titles', price: 5500, act: 3, level: 2, rarity: 'Epic', emoji: '🛸', description: 'Esprit numérique transcendant.' },
        { id: 'shop-20', name: 'True Prophet', type: 'Titles', price: 15000, act: 4, level: 1, rarity: 'Legendary', emoji: '👁️', description: 'Celui qui a vu la vérité.' },

        // BOOSTERS
        { id: 'shop-21', name: 'XP Overdrive (1h)', type: 'Boosters', price: 400, act: 1, level: 1, rarity: 'Common', emoji: '⚡', description: 'Double XP sur toutes les commandes et quêtes pendant 1 heure.', multiplier: 2.0, boost_type: 'XP' },
        { id: 'shop-22', name: 'Token Magnet (3h)', type: 'Boosters', price: 1100, act: 2, level: 1, rarity: 'Uncommon', emoji: '🧲', description: 'Chaque 1 TND dépensé donne 2 Jetons pendant 3 heures.', multiplier: 3.0, boost_type: 'TOKEN' },
        { id: 'shop-23', name: 'Lucky Drop (24h)', type: 'Boosters', price: 3500, act: 2, level: 5, rarity: 'Rare', emoji: '🍀', description: 'Augmente les chances de Loot légendaire de 50% pendant 24 heures.', multiplier: 1.5, boost_type: 'LOOT' },
        { id: 'shop-24', name: 'Protocol Hack', type: 'Boosters', price: 7000, act: 3, level: 3, rarity: 'Epic', emoji: '💻', description: 'Réduit les pré-requis des quêtes de 1 niveau. Usage unique.', multiplier: 1.0, boost_type: 'PROTOCOL' },

        // EXCLUSIVE
        { id: 'shop-25', name: 'VIP Pass - Act I', type: 'Exclusive', price: 1000, act: 1, level: 5, rarity: 'Epic', emoji: '🎟️', description: 'Accès exclusif aux événements Acte I.' },
        { id: 'shop-26', name: 'Mato\'s Secret Sauce', type: 'Exclusive', price: 5000, act: 2, level: 10, rarity: 'Legendary', emoji: '🥫', description: 'La recette légendaire. (Cosmétique)' },

        // NEW THEMATIC ADDITIONS
        { id: 'shop-27', name: 'Agent Dormant', type: 'Titles', price: 1500, act: 1, level: 3, rarity: 'Uncommon', emoji: '💤', description: 'Toujours prêt à être activé.' },
        { id: 'shop-28', name: 'Légende du Mato\'s', type: 'Titles', price: 25000, act: 4, level: 10, rarity: 'Legendary', emoji: '🏆', description: 'Le nom qui fait trembler les concurrents.' },
        { id: 'shop-29', name: 'Maître des Tacos', type: 'Titles', price: 4500, act: 2, level: 5, rarity: 'Rare', emoji: '🌮', description: 'Il connaît chaque pli de la galette.' },
        { id: 'shop-30', name: 'Infiltrateur d\'Élite', type: 'Titles', price: 9000, act: 3, level: 8, rarity: 'Epic', emoji: '🕵️', description: 'Passé inaperçu, même dans la file d\'attente.' },
        { id: 'shop-31', name: 'L\'Ombre du Bazar', type: 'Titles', price: 1200, act: 1, level: 2, rarity: 'Uncommon', emoji: '🌆', description: 'Maître de la négociation discrète.' },
        { id: 'shop-32', name: 'Surcharge Tactique', type: 'Auras', price: 7000, act: 3, level: 5, rarity: 'Epic', emoji: '⚡', description: 'Une aura d\'énergie pure qui pulse autour de vous.' },
        { id: 'shop-33', name: 'Interférence Cyber', type: 'Auras', price: 3500, act: 2, level: 6, rarity: 'Rare', emoji: '🛰️', description: 'Distorsion visuelle de haute technologie.' },
        { id: 'shop-34', name: 'Néon Syndicate', type: 'Frames', price: 8500, act: 3, level: 7, rarity: 'Epic', emoji: '🟣', description: 'Le cadre officiel des hauts dignitaires.' },
        { id: 'shop-35', name: 'Chrome Industriel', type: 'Frames', price: 2200, act: 2, level: 2, rarity: 'Uncommon', emoji: '🔧', description: 'Brut, solide, efficace.' },
        { id: 'shop-36', name: 'Surcharge de Données (6h)', type: 'Boosters', price: 2000, act: 3, level: 1, rarity: 'Epic', emoji: '📡', description: 'Triple XP sur les quêtes de piratage pendant 6 heures.', multiplier: 3.0, boost_type: 'XP' },
    ];

    const SEEDED_ITEMS = [
        // HIGH-QUALITY THEMATIC BOOSTERS
        { id: 'shop-37', name: 'Mato\'s Mastery', type: 'Boosters', price: 1500, act: 1, level: 5, rarity: 'Uncommon', emoji: '🍗', description: 'Une sauce secrète qui double vos points de fidélité pour les 3 prochaines commandes.', multiplier: 2.0, boost_type: 'XP' },
        { id: 'shop-38', name: 'Cyber Recon', type: 'Boosters', price: 2500, act: 2, level: 3, rarity: 'Rare', emoji: '📡', description: 'Débloque instantanément la visibilité de toutes les quêtes cachées de l\'Acte II.', multiplier: 1.0, boost_type: 'RECON' },
        { id: 'shop-39', name: 'Shadow Stealth', type: 'Boosters', price: 4000, act: 2, level: 7, rarity: 'Epic', emoji: '👤', description: 'Réduit de 20% le prix de votre prochaine commande "Signature" passée après 22h.', multiplier: 1.0, boost_type: 'STEALTH' },
        { id: 'shop-40', name: 'Sultan\'s Blessing', type: 'Boosters', price: 8500, act: 3, level: 5, rarity: 'Legendary', emoji: '👑', description: 'Garantit un item épique ou légendaire dans votre prochain Loot Box.', multiplier: 1.0, boost_type: 'LUCK' },
        { id: 'shop-41', name: 'Data Override', type: 'Boosters', price: 3000, act: 2, level: 5, rarity: 'Rare', emoji: '💾', description: 'Permet de relancer une quête quotidienne échouée.', multiplier: 1.0, boost_type: 'DATA_RESET' },
        { id: 'shop-42', name: 'Neon Overdrive', type: 'Boosters', price: 5500, act: 3, level: 2, rarity: 'Epic', emoji: '⚡', description: 'Multiplie par 3 l\'XP gagnée pendant les 2 prochaines heures.', multiplier: 3.0, boost_type: 'XP' },
        { id: 'shop-43', name: 'Protocol Bypass', type: 'Boosters', price: 12000, act: 4, level: 1, rarity: 'Legendary', emoji: '🔓', description: 'Ignore les pré-requis de niveau pour n\'importe quel item du shop pendant 1h.', multiplier: 1.0, boost_type: 'BYPASS' },
        { id: 'shop-44', name: 'Bazaar Instinct', type: 'Boosters', price: 1800, act: 1, level: 4, rarity: 'Uncommon', emoji: '🏺', description: 'Affiche les promotions secrètes du jour dans le menu.', multiplier: 1.0, boost_type: 'INSTINCT' },
        { id: 'shop-45', name: 'Priority Uplink', type: 'Boosters', price: 6500, act: 3, level: 8, rarity: 'Epic', emoji: '🚀', description: 'Votre commande passe en priorité absolue dans la file de préparation.', multiplier: 1.0, boost_type: 'PRIORITY' },
        { id: 'shop-46', name: 'Legacy Protocol', type: 'Boosters', price: 15000, act: 4, level: 5, rarity: 'Legendary', emoji: '💾', description: 'Conservez vos bonus de palier (Acte) même si vos points descendent temporairement.', multiplier: 1.0, boost_type: 'LEGACY' }
    ];

    const ALL_ITEMS = [...SHOP_ITEMS, ...SEEDED_ITEMS];
    const seededIds = ALL_ITEMS.map(i => i.id);

    for (const item of ALL_ITEMS) {
        const exists = await prisma.shop_items.findUnique({ where: { id: item.id } });

        await prisma.shop_items.upsert({
            where: { id: item.id },
            update: {
                ...item,
                updated_at: new Date()
            },
            create: {
                ...item,
                updated_at: new Date()
            }
        });

        if (exists) {
            console.log(`Skipped (Exists): ${item.name}`);
        } else {
            console.log(`Created Item: ${item.name}`);
        }
    }

    // Orphan Cleanup: Delete any items not in the seeded list
    const orphans = await prisma.shop_items.deleteMany({
        where: {
            id: { notIn: seededIds }
        }
    });
    if (orphans.count > 0) {
        console.log(`Cleaned up ${orphans.count} orphaned shop items.`);
    }
}

async function seedQuests() {
    console.log('Seeding Quests...');
    const quests = [
        {
            id: 'quest-intro-1',
            title: 'Premier Pas',
            description: 'Complétez votre premier profil.',
            type: 'ONE_OFF',
            reward_amount: 100,
            reward_type: 'TOKEN',
            min_act: 1,
            is_active: true,
            emoji: '🌱'
        },
        {
            id: 'quest-spend-1',
            title: 'Gourmet Hunter',
            description: 'Dépensez 100 TND au total.',
            type: 'SPEND',
            reward_amount: 500,
            reward_type: 'TOKEN',
            min_act: 1,
            is_active: true,
            emoji: '🍔'
        },
        {
            id: 'q1',
            title: 'Tactical Lunch',
            description: 'Commande entre 12:00 et 14:00 (Mar-Sam).',
            type: 'TIME',
            reward_amount: 150,
            reward_type: 'XP',
            min_act: 0,
            is_active: true,
            emoji: '🕛'
        },
        {
            id: 'q2',
            title: 'Weekender Protocol',
            description: 'Une commande le Vendredi ou Samedi.',
            type: 'STREAK',
            reward_amount: 300,
            reward_type: 'XP',
            min_act: 0,
            is_active: true,
            emoji: '🗓️'
        },
        {
            id: 'q3',
            title: 'Signature Hunter',
            description: 'Essayez 5 items différents du menu.',
            type: 'COLLECTION',
            reward_amount: 500,
            reward_type: 'XP',
            min_act: 1,
            is_active: true,
            emoji: '🕵️'
        },
        {
            id: 'q4',
            title: 'Syndicate Recruit',
            description: 'Invitez un ami à rejoindre le rang.',
            type: 'SOCIAL',
            reward_amount: 100,
            reward_type: 'TOKEN',
            min_act: 1,
            is_active: true,
            emoji: '👥'
        }
    ];

    for (const q of quests) {
        const exists = await prisma.quests.findUnique({ where: { id: q.id } });

        await prisma.quests.upsert({
            where: { id: q.id },
            update: {
                ...q,
                updated_at: new Date()
            },
            create: {
                ...q,
                updated_at: new Date()
            }
        });

        if (exists) {
            console.log(`Skipped (Exists): ${q.title}`);
        } else {
            console.log(`Created Quest: ${q.title}`);
        }
    }
}

async function seedHeroSlides() {
    console.log('Seeding Hero Slides...');
    const slides = [
        {
            id: 1,
            title: "The Ultimate Pizza",
            subtitle: "Artisanale",
            tagline: "Une immersion sensorielle au-delà de la gastronomie. Préparée avec une rigueur absolue.",
            image_url: "/margherita-hero.png",
            accent: "from-yellow-400 to-orange-600",
            order: 1
        },
        {
            id: 2,
            title: "Signature Wagyu Burger",
            subtitle: "Premium",
            tagline: "Le bœuf Wagyu d'exception, sublimé par des ingrédients soigneusement sélectionnés.",
            image_url: "/wagyu-hero.png",
            accent: "from-orange-400 to-red-600",
            order: 2
        },
        {
            id: 3,
            title: "Atelier Baguette",
            subtitle: "Tradition",
            tagline: "Le pain croustillant rencontre des garnitures gourmandes pour un plaisir authentique.",
            image_url: "/images/baguette_farcie.png",
            accent: "from-yellow-300 to-yellow-600",
            order: 3
        }
    ];

    for (const slide of slides) {
        await prisma.hero_slides.upsert({
            where: { id: slide.id },
            update: slide,
            create: slide
        });
    }
}

async function seedContentPages() {
    console.log('Seeding Content Pages (Terms & Policy)...');
    const pages = [
        {
            slug: 'terms',
            title: 'Conditions Générales',
            subtitle: "Merci de lire attentivement nos conditions générales de vente et d'utilisation avant de profiter de l'expérience Mato's.",
            content: [
                {
                    icon: "Users",
                    title: "Accès et Utilisation",
                    content: "L'utilisation de la plateforme Mato's est réservée aux personnes âgées de 18 ans ou plus. Vous vous engagez à ne pas utiliser nos services à des fins illégales ou non autorisées."
                },
                {
                    icon: "CreditCard",
                    title: "Commandes et Paiements",
                    content: "Toutes les commandes sont soumises à la disponibilité des produits. Les prix sont indiqués en Dinars Tunisiens (DT). Le paiement s'effectue à la livraison ou via les moyens de paiement acceptés sur notre site."
                },
                {
                    icon: "Truck",
                    title: "Livraison",
                    content: "Nous nous efforçons de respecter les délais de livraison indiqués lors de votre commande. Toutefois, ces délais sont donnés à titre indicatif et Mato's ne peut être tenu responsable d'éventuels retards indépendants de sa volonté."
                },
                {
                    icon: "Gavel",
                    title: "Propriété Intellectuelle",
                    content: "Tous les contenus présents sur la plateforme (logos, textes, images, designs) sont la propriété exclusive de Mato's et sont protégés par les lois sur le droit d'auteur."
                }
            ]
        },
        {
            slug: 'policy',
            title: 'Politique de Confidentialité',
            subtitle: "Chez Mato's, nous prenons la protection de vos données personnelles très au sérieux. Cette politique détaille comment nous traitons vos informations.",
            content: [
                {
                    icon: "Shield",
                    title: "Collecte des Données",
                    content: "Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte, de vos commandes ou lors de vos échanges avec notre support. Cela inclut votre nom, adresse email, numéro de téléphone et adresse de livraison."
                },
                {
                    icon: "Lock",
                    title: "Sécurité de vos Informations",
                    content: "La sécurité de vos données est notre priorité absolue. Nous utilisons des protocoles de cryptage de pointe (SSL) et des mesures de sécurité physiques pour protéger vos informations contre tout accès non autorisé."
                },
                {
                    icon: "Eye",
                    title: "Utilisation des Cookies",
                    content: "Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme, mémoriser vos préférences et analyser notre trafic. Vous pouvez gérer vos préférences de cookies dans les réglages de votre navigateur."
                },
                {
                    icon: "FileText",
                    title: "Vos Droits",
                    content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez également vous opposer au traitement de vos données pour des motifs légitimes."
                }
            ]
        }
    ];

    for (const page of pages) {
        await prisma.content_pages.upsert({
            where: { slug: page.slug },
            update: page,
            create: page
        });
    }
}

async function main() {
    try {
        console.log('--- START SEEDING ---');
        await seedCategories();
        await seedMenuItems();
        await seedPromotions();
        await seedShopItems();
        await seedQuests();
        await seedHeroSlides();
        await seedContentPages();
        await seedUsers();
        await seedReviews();
        console.log('--- SEEDING FINISHED SUCCESSFULLY ---');
    } catch (error) {
        console.error('!!! SEEDING CRASHED !!!');
        console.error(error);
        throw error;
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });
