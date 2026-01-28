export interface MenuItem {
    id: string;
    name: string;
    price?: number | Record<string, number> | null;
    ingredients?: string;
    popular?: boolean;
    bestseller?: boolean;
    hot?: boolean;
    image: string; // Emoji for now, can be replaced with real images later
    category:
    | 'pizza'
    | 'burger'
    | 'tacos'
    | 'makloub'
    | 'sandwich'
    | 'plat'
    | 'salade'
    | 'sides'
    | 'tunisian'
    | 'kids'
    | 'drinks'
    | 'dessert'
    | 'supplements'
    | 'promos';
    sauce?: 'rouge' | 'blanche'; // For pizzas only
    originalPrice?: number;
    savings?: number; // How much you save
    discount?: number; // Percentage discount
}


export interface Category {
    id: string;
    name: string;
    emoji: string;

    heroTitle?: string;
    heroSubtitle?: string;
    heroColor?: string;
    showInHero?: boolean;
}