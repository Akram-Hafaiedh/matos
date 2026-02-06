export interface MenuItem {
    id: number | string;
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
    likeCount?: number;
    rating?: number;
    reviewCount?: number;
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

export interface Promotion {
    id: number;
    name: string;
    description: string;
    price: number | null;
    originalPrice: number | null;
    discount: number | null;
    imageUrl: string | null;
    emoji: string | null;
    badgeText: string | null;
    badgeColor: string | null;
    isActive: boolean;
    startDate: Date | string | null;
    endDate: Date | string | null;
    selectionRules?: any;
}