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
    | 'supplements';
    sauce?: 'rouge' | 'blanche'; // For pizzas only
}


export interface Category {
    id: string;
    name: string;
    emoji: string;
}