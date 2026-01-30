import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from '../app/generated/prisma/client'

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
    const promoCat = await prisma.category.findFirst({ where: { name: 'Promos' } });
    if (promoCat) {
        await prisma.menuItem.deleteMany({ where: { categoryId: promoCat.id } });
    }
    await prisma.promotion.deleteMany({});
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
        let category = await prisma.category.findFirst({ where: { name: cat.name } });

        if (!category) {
            category = await prisma.category.create({
                data: {
                    name: cat.name,
                    emoji: cat.emoji,
                    displayOrder: categoriesList.indexOf(cat) + 1
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

            const exists = await prisma.menuItem.findFirst({ where: { name: item.name } });

            if (!exists) {
                await prisma.menuItem.create({
                    data: {
                        name: item.name,
                        price: finalPrice,
                        categoryId: categoryId,
                        imageUrl: (item as any).image,
                        ingredients: ingredientsArray,
                        popular: (item as any).popular || false,
                        bestseller: (item as any).bestseller || false,
                        hot: (item as any).hot || false,
                        discount: (item as any).discount || null,
                        sauce: (item as any).sauce || null,
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

    for (const promo of menuItems.promos) {
        let finalPrice: number | null = null;
        if (typeof promo.price === 'number') {
            finalPrice = promo.price;
        }

        const exists = await prisma.promotion.findFirst({ where: { name: promo.name } });

        if (!exists) {
            await prisma.promotion.create({
                data: {
                    name: promo.name,
                    description: promo.ingredients,
                    price: finalPrice,
                    originalPrice: promo.originalPrice || null,
                    discount: promo.discount || null,
                    imageUrl: promo.image,
                    emoji: promo.image && promo.image.length <= 4 ? promo.image : '🎁',
                    isActive: true,
                    conditions: promo.name.includes('Pizzas') ? 'Valable sur XL et XXL' : null,
                    selectionRules: promo.name === 'Menu Étudiant'
                        ? [
                            { id: 'burger', label: 'Votre Burger', type: 'category', categoryId: categoryMap.get('burger'), quantity: 1 },
                            { id: 'boisson', label: 'Votre Boisson', type: 'category', categoryId: categoryMap.get('drinks'), quantity: 1 }
                        ]
                        : promo.name === 'Pizza + Boisson Offerte'
                            ? [
                                { id: 'pizza', label: 'Votre Pizza (XL ou XXL)', type: 'category', categoryId: categoryMap.get('pizza'), quantity: 1 },
                                { id: 'boisson', label: 'Votre Boisson', type: 'category', categoryId: categoryMap.get('drinks'), quantity: 1 }
                            ]
                            : promo.name === '2 Pizzas = -30%'
                                ? [
                                    { id: 'pizza1', label: 'Première Pizza', type: 'category', categoryId: categoryMap.get('pizza'), quantity: 1 },
                                    { id: 'pizza2', label: 'Deuxième Pizza', type: 'category', categoryId: categoryMap.get('pizza'), quantity: 1 }
                                ]
                                : []
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
    // We can't easily use bcryptjs in some seed environments if it's not pre-bundled or if we have execution policy issues, 
    // but Prisma seed usually runs with tsx which should be fine.
    // For simplicity, we'll just create users with plain text or simple hashes if needed.
    // However, the schema says password is a string.

    const users = [
        {
            name: 'Admin Mato\'s',
            email: 'admin@matos.com',
            role: 'admin',
        },
        {
            name: 'Yassine K.',
            email: 'yassine@example.com',
            role: 'customer',
        },
        {
            name: 'Sonia M.',
            email: 'sonia@example.com',
            role: 'customer',
        }
    ];

    for (const u of users) {
        const exists = await prisma.user.findUnique({ where: { email: u.email } });
        if (!exists) {
            await prisma.user.create({
                data: {
                    ...u,
                    password: 'password123', // In a real app, hash this
                }
            });
            console.log(`Created User: ${u.email}`);
        }
    }
}

async function seedReviews() {
    console.log('Seeding Reviews...');
    const users = await prisma.user.findMany({ where: { role: 'customer' } });
    const items = await prisma.menuItem.findMany({ take: 10 });

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

        const exists = await prisma.review.findFirst({
            where: {
                userId: user.id,
                menuItemId: item.id
            }
        });

        if (!exists) {
            await prisma.review.create({
                data: {
                    userId: user.id,
                    menuItemId: item.id,
                    rating: 5,
                    comment: reviewTexts[i],
                    showOnHome: i < 9 // Select first 9 for home page
                }
            });
        }
    }
}

async function main() {
    console.log('Start seeding...');
    await cleanup();
    await seedCategories();
    await seedMenuItems();
    await seedPromotions();
    await seedUsers();
    await seedReviews();
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
