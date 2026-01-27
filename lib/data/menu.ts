import { Category, MenuItem } from "@/types/menu";

export const menuItems: Record<string, MenuItem[]> = {
    // PIZZAS - SAUCE TOMATE (Red Sauce)
    pizza: [
        {
            id: 'psr1',
            name: 'Pizza Margherita',
            price: { xl: 10, xxl: 12 },
            ingredients: 'Sauce tomate, mozzarella, basilic, olives',
            popular: true,
            image: '/images/pizza/pizza_sr_margherita.png',
            category: 'pizza',
            sauce: 'rouge'
        },
        {
            id: 'psr2',
            name: 'Pizza Neptune',
            price: { xl: 12, xxl: 17 },
            ingredients: 'Sauce tomate, fromage mozzarella, thon, olives',
            bestseller: true,
            image: '/images/pizza/pizza_sr_neptune.png',
            category: 'pizza',
            sauce: 'rouge'
        },
        {
            id: 'psr3',
            name: 'Pizza Montagnarde',
            price: { xl: 14, xxl: 19 },
            ingredients: 'Sauce tomate, mozzarella, charcuterie, champignons',
            image: '/images/pizza/pizza_sr_montagnarde.png',
            category: 'pizza',
            sauce: 'rouge'
        },
        {
            id: 'psr4',
            name: 'Pizza Napolitaine',
            price: { xl: 13, xxl: 18 },
            ingredients: 'Sauce tomate, mozzarella, basilic, anchois, câpres, olives',
            hot: true,
            image: '/images/pizza/pizza_sr_napolitaine.png',
            category: 'pizza',
            sauce: 'rouge'
        },
        {
            id: 'psr5',
            name: 'Pizza Arménienne',
            price: { xl: 18, xxl: 22 },
            ingredients: 'Sauce tomate, mozzarella, bœuf haché, poivrons, oignons',
            image: '/images/pizza/pizza_sr_armenienne.png',
            category: 'pizza',
            sauce: 'rouge'
        },
        {
            id: 'psr6',
            name: 'Pizza Quatre Fromages',
            price: { xl: 20, xxl: 23 },
            ingredients: 'Sauce tomate, mozzarella, gruyère, cheddar, parmesan',
            image: '/images/pizza/pizza_sr_quatres_fromages.png',
            category: 'pizza',
            sauce: 'rouge'
        },
        {
            id: 'psr7',
            name: 'Pizza Viking',
            price: { xl: 19, xxl: 23 },
            ingredients: 'Sauce tomate, mozzarella, bœuf et filocher, pommes de terre, écrasées',
            image: '/images/pizza/pizza_sr_viking.png',
            category: 'pizza',
            sauce: 'rouge'
        },
        {
            id: 'psr8',
            name: 'Pizza Caesar',
            price: { xl: 16, xxl: 20 },
            ingredients: 'Sauce tomate, mozzarella, poulet pané, croûton, parmesan balsamique',
            image: '/images/pizza/pizza_sr_caesar.png',
            category: 'pizza',
            sauce: 'rouge'
        },
        {
            id: 'psr9',
            name: 'Pizza Pepperoni',
            price: { xl: 16, xxl: 20 },
            ingredients: 'Sauce tomate, mozzarella, pepperoni, olives',
            popular: true,
            image: '/images/pizza/pizza_sr_peperoni.png',
            category: 'pizza',
            sauce: 'rouge'
        },
        {
            id: 'psr10',
            name: 'Pizza Fruits De Mer',
            price: { xl: 23, xxl: 29 },
            ingredients: 'Sauce tomate, mozzarella, fruits de mer, olive, olives',
            image: '/images/pizza/pizza_sr_fruit_de_mer.png',
            category: 'pizza',
            sauce: 'rouge'
        },
        {
            id: 'psr11',
            name: 'Pizza Végans',
            price: { xl: 13, xxl: 17 },
            ingredients: 'Sauce tomate, mozzarella, légumes, champignons',
            image: '/images/pizza/pizza_sr_vegans.png',
            category: 'pizza',
            sauce: 'rouge'
        },


        // PIZZAS - SAUCE BLANCHE (White Sauce)

        {
            id: 'psb1',
            name: 'Pizza Poulet',
            price: { xl: 15, xxl: 18 },
            ingredients: 'Sauce blanche, mozzarella, poulet, nature, olives',
            image: '/images/pizza/pizza_sb_poulet.png',
            category: 'pizza',
            sauce: 'blanche'
        },
        {
            id: 'psb2',
            name: 'Pizza Alpine',
            price: { xl: 15, xxl: 19 },
            ingredients: 'Sauce blanche, mozzarella, pommes de terre écrasées, jambon, olives',
            image: '/images/pizza/pizza_sb_alpine.png',
            category: 'pizza',
            sauce: 'blanche'
        },
        {
            id: 'psb3',
            name: 'Pizza Miel',
            price: { xl: 17, xxl: 20 },
            ingredients: 'Sauce blanche, mozzarella, poulet pané, miel',
            bestseller: true,
            image: '/images/pizza/pizza_sb_miel.png',
            category: 'pizza',
            sauce: 'blanche'
        },
        {
            id: 'psb4',
            name: 'Pizza Fromaggi',
            price: { xl: 20, xxl: 24 },
            ingredients: 'Sauce blanche, mozzarella, gruyère, cheddar, fromage bleu',
            image: '/images/pizza/pizza_sb_fromaggi.png',
            category: 'pizza',
            sauce: 'blanche'
        },
        {
            id: 'psb5',
            name: 'Pizza Norvégienne',
            price: { xl: 23, xxl: 29 },
            ingredients: 'Sauce blanche, mozzarella, saumon fumé, aneth',
            image: '/images/pizza/pizza_sb_norvegienne.png',
            category: 'pizza',
            sauce: 'blanche'
        },
        {
            id: 'psb6',
            name: 'Pizza Texane',
            price: { xl: 20, xxl: 25 },
            ingredients: 'Sauce blanche, mozzarella, goûta, épinard, viande, hachée, champignons',
            image: '/images/pizza/pizza_sb_texane.png',
            category: 'pizza',
            sauce: 'blanche'
        },
    ],


    // TACOS & MAKLOUB
    tacos: [
        {
            id: 't1',
            name: 'Tacos Escalope Grillée',
            price: 8,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée',
            popular: true,
            image: '/images/tacos/tacos_escalope_grillee.png',
            category: 'tacos'
        },
        {
            id: 't2',
            name: 'Tacos Crispy Chicken',
            price: 10,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, crispy chicken',
            image: '/images/tacos/tacos_crispy_chicken.png',
            category: 'tacos'
        },
        {
            id: 't3',
            name: 'Tacos Cordon Bleu',
            price: 11,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, cordon bleu',
            bestseller: true,
            image: '/images/tacos/tacos_cordon_bleu.png',
            category: 'tacos'
        },
        {
            id: 't4',
            name: 'Tacos Viande Hachée',
            price: 13,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, viande hachée',
            image: '/images/tacos/tacos_viande_hachee.png',
            category: 'tacos'
        },
        {
            id: 't5',
            name: 'Tacos Forestière',
            price: 14,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée, champignon',
            image: '/images/tacos/tacos_forestiere.png',
            category: 'tacos'
        },
    ],

    makloub: [
        {
            id: 'm1',
            name: 'Makloub Escalope Grillée',
            price: 10,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée',
            image: '/images/makloub/makloub_escalope_grillée.png',
            category: 'makloub'
        },
        {
            id: 'm2',
            name: 'Makloub Crispy Chicken',
            price: 11,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, crispy chicken',
            image: '/images/makloub/makloub_crispy_chicken.png',
            category: 'makloub'
        },
        {
            id: 'm3',
            name: 'Makloub Cordon Bleu',
            price: 12.5,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, cordon bleu',
            bestseller: true,
            image: '/images/makloub/makloub_cordon_bleu.png',
            category: 'makloub'
        },
        {
            id: 'm4',
            name: 'Makloub Viande Hachée',
            price: 14.5,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, viande hachée',
            image: '/images/makloub/makloub_viande_hachée.png',
            category: 'makloub'
        },
        {
            id: 'm5',
            name: 'Makloub Forestière',
            price: 15.5,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée, champignon',
            image: '/images/makloub/makloub_forestière.png',
            category: 'makloub'
        },
    ],

    // BAGUETTE FARCIE
    baguetteFarcie: [
        {
            id: 'bf1',
            name: 'Baguette Farcie Escalope Grillée',
            price: 10,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée',
            popular: true,
            image: '/images/baguette_farcie.png',
            category: 'sandwich'
        },
        {
            id: 'bf2',
            name: 'Baguette Farcie Crispy Chicken',
            price: 11,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, crispy chicken',
            image: '/images/baguette_farcie.png',
            category: 'sandwich'
        },
        {
            id: 'bf3',
            name: 'Baguette Farcie Cordon Bleu',
            price: 12.5,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, cordon bleu',
            image: '/images/baguette_farcie.png',
            category: 'sandwich'
        },
        {
            id: 'bf4',
            name: 'Baguette Farcie Viande Hachée',
            price: 14.5,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, viande hachée',
            image: '/images/baguette_farcie.png',
            category: 'sandwich'
        },
        {
            id: 'bf5',
            name: 'Baguette Farcie Forestière',
            price: 15.5,
            ingredients: 'Sauces aux choix, garnitures aux choix, mozzarella, frites, escalope grillée, champignon',
            image: '/images/baguette_farcie.png',
            category: 'sandwich'
        },
    ],

    // SANDWICHES (Pain au choix)
    sandwich: [
        {
            id: 's1',
            name: 'Escalope Grillée',
            price: 8,
            ingredients: 'Ciabatta, rustique, pain, baguette',
            popular: true,
            image: '🥪',
            category: 'sandwich'
        },
        {
            id: 's2',
            name: 'Crispy Chicken',
            price: 10,
            ingredients: 'Ciabatta, rustique, pain, baguette',
            image: '🥪',
            category: 'sandwich'
        },
        {
            id: 's3',
            name: 'Cordon Bleu',
            price: 12,
            ingredients: 'Ciabatta, rustique, pain, baguette',
            image: '🥪',
            category: 'sandwich'
        },
        {
            id: 's4',
            name: 'Viande Hachée',
            price: 12,
            ingredients: 'Ciabatta, rustique, pain, baguette',
            image: '🥪',
            category: 'sandwich'
        },
        {
            id: 's5',
            name: 'Jambon De Dinde',
            price: 6,
            ingredients: 'Ciabatta, rustique, pain, baguette',
            bestseller: true,
            image: '🥪',
            category: 'sandwich'
        },
    ],

    // BURGERS
    burger: [
        {
            id: 'b1',
            name: 'Classique',
            price: 14,
            ingredients: 'Pain, viande, salade, tomate',
            popular: true,
            image: '🍔',
            category: 'burger'
        },
        {
            id: 'b2',
            name: 'Cheeseburger',
            price: 16,
            ingredients: 'Pain, viande, cheddar, salade',
            bestseller: true,
            image: '🍔',
            category: 'burger'
        },
        {
            id: 'b3',
            name: 'Rustique',
            price: 18,
            ingredients: 'Pain rustique, viande, légumes',
            image: '🍔',
            category: 'burger'
        },
        {
            id: 'b4',
            name: 'Crispy Chicken',
            price: 13,
            ingredients: 'Pain, poulet croustillant, sauce',
            hot: true,
            image: '🍗',
            category: 'burger'
        },
    ],
    // PLATS (Plates)
    plat: [
        {
            id: 'pl1',
            name: 'Tenders 6 Pcs',
            price: 5,
            ingredients: 'Poulet pané croustillant',
            image: '/images/plats.png',
            category: 'plat'
        },
        {
            id: 'pl2',
            name: 'Tenders 8 Pcs',
            price: 8,
            ingredients: 'Poulet pané croustillant',
            image: '/images/plats.png',
            category: 'plat'
        },
        {
            id: 'pl3',
            name: 'Chicken Wings 6 Pcs',
            price: 6,
            ingredients: 'Ailes de poulet épicées',
            image: '/images/plats.png',
            category: 'plat'
        },
        {
            id: 'pl4',
            name: 'Chicken Wings 9 Pcs',
            price: 9,
            ingredients: 'Ailes de poulet épicées',
            image: '/images/plats.png',
            category: 'plat'
        },
        {
            id: 'pl5',
            name: 'Cuisse De Poulet Braisé',
            price: 10,
            ingredients: 'Cuisse de poulet marinée et grillée',
            popular: true,
            image: '/images/plats.png',
            category: 'plat'
        },
        {
            id: 'pl6',
            name: 'Cordons Bleu Maison',
            price: 12,
            ingredients: 'Cordon bleu fait maison',
            image: '/images/plats.png',
            category: 'plat'
        },
        {
            id: 'pl7',
            name: 'Émincé De Bœuf, Sauce Blanche',
            price: 16,
            ingredients: 'Bœuf émincé avec sauce crémeuse',
            image: '/images/plats.png',
            category: 'plat'
        },
        {
            id: 'pl8',
            name: 'Lasagne',
            price: 18,
            ingredients: 'Lasagne à la viande et béchamel',
            bestseller: true,
            image: '/images/plats.png',
            category: 'plat'
        },
        {
            id: 'pl9',
            name: 'Plat Escalope Grillée',
            price: 15,
            ingredients: 'Riz, salade verte, salade mechouia, harissa, sauce à l\'ail, frites, escalope grillée',
            image: '/images/plats.png',
            category: 'plat'
        },
        {
            id: 'pl10',
            name: 'Plat Cuisse De Poulet Rôti',
            price: 17,
            ingredients: 'Riz, salade verte, salade mechouia, harissa, sauce à l\'ail, frites, cuisse de poulet rôti',
            image: '/images/plats.png',
            category: 'plat'
        },
        {
            id: 'pl11',
            name: 'Plat Escalope Panée',
            price: 17,
            ingredients: 'Riz, salade verte, salade mechouia, harissa, sauce à l\'ail, frites, escalope panée',
            image: '/images/plats.png',
            category: 'plat'
        },
    ],

    // SALADES & ENTRÉES
    salade: [
        {
            id: 'sal1',
            name: 'Salade Caesar',
            price: 13,
            ingredients: 'Laitue, poulet, croûtons, parmesan, sauce caesar',
            image: '🥗',
            category: 'salade'
        },
        {
            id: 'sal2',
            name: 'Salade Chicken Cowslow',
            price: 13,
            ingredients: 'Poulet, chou, carottes, sauce coleslaw',
            image: '🥗',
            category: 'salade'
        },
        {
            id: 'sal3',
            name: 'Salade Méditerranéenne',
            price: 13,
            ingredients: 'Thon, maïs, olive, vinaigrette',
            image: '🥗',
            category: 'salade'
        },
        {
            id: 'sal4',
            name: 'Salade Crunchy',
            price: 15,
            ingredients: 'Poulet pané, chips de tortillas, sauce salade',
            image: '🥗',
            category: 'salade'
        },
        {
            id: 'sal5',
            name: 'Dynamite Poulet',
            price: 9,
            ingredients: 'Poulet épicé avec sauce dynamite',
            hot: true,
            image: '🌶️',
            category: 'salade'
        },
        {
            id: 'sal6',
            name: 'Salade Fruits De Mer',
            price: 23,
            ingredients: 'Fruits de mer frais, vinaigrette',
            image: '🥗',
            category: 'salade'
        },
    ],

    // FRIES GRATINÉ
    friesGratine: [
        {
            id: 'fg1',
            name: 'Fries Crispy Chiken',
            price: 12,
            ingredients: 'Frites gratinées au fromage avec poulet crispy',
            image: '🍟',
            category: 'sides'
        },
        {
            id: 'fg2',
            name: 'Fries Bœuf Haché',
            price: 14,
            ingredients: 'Frites gratinées au fromage avec bœuf haché',
            image: '🍟',
            category: 'sides'
        },
        {
            id: 'fg3',
            name: 'Fries Poulet Nature',
            price: 10,
            ingredients: 'Frites gratinées au fromage avec poulet nature',
            image: '🍟',
            category: 'sides'
        },
    ],

    // COIN TUNISIEN
    coinTunisien: [
        {
            id: 'ct1',
            name: 'Madfouna',
            price: 23,
            ingredients: 'Spécialité tunisienne traditionnelle',
            popular: true,
            image: '🥙',
            category: 'tunisian'
        },
        {
            id: 'ct2',
            name: 'Pate Poulet A La Tunisienne',
            price: 14,
            ingredients: 'Pâtes au poulet à la tunisienne',
            image: '🍝',
            category: 'tunisian'
        },
    ],

    // MENU ENFANTS
    menuEnfants: [
        {
            id: 'me1',
            name: 'Mini Pizza',
            price: 5,
            ingredients: 'Pizza enfant avec frites',
            image: '🍕',
            category: 'kids'
        },
        {
            id: 'me2',
            name: 'Tenders',
            price: 5,
            ingredients: 'Tenders avec frites',
            image: '🍗',
            category: 'kids'
        },
    ],


    // BOISSONS
    drinks: [
        {
            id: 'd1',
            name: 'Canette',
            price: 2.5,
            ingredients: 'Coca, Fanta, Sprite, Boga Lim, Boga Cidre, Apla Pomme',
            image: '/images/boisson.png',
            category: 'drinks'
        },
        {
            id: 'd2',
            name: 'Eau Minérale 0.5 L',
            price: 1.5,
            ingredients: 'Eau minérale',
            image: '/images/boisson.png',
            category: 'drinks'
        },
        {
            id: 'd3',
            name: 'Eau 1L',
            price: 1,
            ingredients: 'Eau 1 litre',
            image: '/images/boisson.png',
            category: 'drinks'
        },
        {
            id: 'd4',
            name: 'Citronnade Menthe',
            price: 2,
            ingredients: 'Citronnade fraîche à la menthe',
            popular: true,
            image: '/images/boisson.png',
            category: 'drinks'
        },
        {
            id: 'd5',
            name: 'Fraise',
            price: 2,
            ingredients: 'Jus de fraise frais',
            image: '/images/boisson.png',
            category: 'drinks'
        },
        {
            id: 'd6',
            name: 'Jus Carottes',
            price: 2,
            ingredients: 'Jus de carottes frais',
            image: '/images/boisson.png',
            category: 'drinks'
        },
        {
            id: 'd7',
            name: 'Café Capsule',
            price: 3.5,
            ingredients: 'Café en capsule',
            image: '/images/boisson.png',
            category: 'drinks'
        },
    ],


    // DESSERTS
    dessert: [
        {
            id: 'de1',
            name: 'Carottes Cake',
            price: 5,
            popular: true,
            ingredients: 'Gâteau aux carottes maison',
            image: '🍰',
            category: 'dessert'
        },
        {
            id: 'de2',
            name: 'Mousse Au Chocolat',
            price: 5,
            bestseller: true,
            ingredients: 'Mousse au chocolat onctueuse',
            image: '🍫',
            category: 'dessert'
        },
        {
            id: 'de3',
            name: 'Tarte Au Citron',
            price: 5,
            ingredients: 'Tarte au citron meringuée',
            image: '🥧',
            category: 'dessert'
        },
        {
            id: 'de4',
            name: 'Supp Tacos Gratiné',
            price: 3.5,
            ingredients: 'Supplément tacos gratiné',
            image: '🧀',
            category: 'dessert'
        },
    ],

    // SUPPLÉMENTS
    supplements: [
        {
            id: 'sup1',
            name: 'Gruyère',
            price: 2.5,
            ingredients: 'Supplément fromage gruyère',
            image: '🧀',
            category: 'supplements'
        },
        {
            id: 'sup2',
            name: 'Cheddar',
            price: 2,
            ingredients: 'Supplément cheddar',
            image: '🧀',
            category: 'supplements'
        },
        {
            id: 'sup3',
            name: 'Jambon',
            price: 2,
            ingredients: 'Supplément jambon',
            image: '🥓',
            category: 'supplements'
        },
    ],

    // GARNITURES
    garnitures: [
        {
            id: 'gar1',
            name: 'Garnitures',
            price: null,
            ingredients: 'Riz vermicelles, pommes de terre grenaille, pommes de terre rissolée, frites, pâtes',
            image: '🍚',
            category: 'sides'
        },
    ],

};

export const categories: Category[] = [
    { id: 'all', name: 'Tout', emoji: '🍽️' },
    { id: 'pizza', name: 'Pizzas', emoji: '🍕' },
    { id: 'burger', name: 'Burgers', emoji: '🍔' },
    { id: 'tacos', name: 'Tacos & Makloub', emoji: '🌮' },
    { id: 'sandwich', name: 'Sandwichs', emoji: '🥪' },
    { id: 'plat', name: 'Plats', emoji: '🍽️' },
    { id: 'salade', name: 'Salades', emoji: '🥗' },
    { id: 'sides', name: 'Accompagnements', emoji: '🍟' },
    { id: 'tunisian', name: 'Coin Tunisien', emoji: '🥙' },
    { id: 'kids', name: 'Menu Enfants', emoji: '👶' },
    { id: 'drinks', name: 'Boissons', emoji: '🥤' },
    { id: 'dessert', name: 'Desserts', emoji: '🍰' },
];