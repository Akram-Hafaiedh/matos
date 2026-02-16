import { MenuItem, Promotion } from "@/types/menu";

/**
 * Generates a unique key for a cart item based on its type, ID, size, and selected choices.
 * This ensures that identical items with different options are treated separately.
 */
export function generateCartKey(
    item: MenuItem | Promotion,
    type: 'menuItem' | 'promotion',
    size?: string,
    choices?: any
): string {
    if (type === 'promotion') {
        const choicesKey = choices ? `-${JSON.stringify(choices)}` : '';
        return `promo-${item.id}${choicesKey}`;
    }

    return size ? `${item.id}-${size}` : `${item.id}`;
}

/**
 * Calculates the total number of items in the cart, summing up quantities.
 */
export function countTotalItems(cart: { [key: string]: any }): number {
    return Object.values(cart).reduce((sum, item) => sum + (item.quantity || 0), 0);
}

/**
 * Returns the appropriate image or emoji for a menu item or promotion.
 * Handles both database (snake_case) and frontend (camelCase) naming conventions,
 * and includes a tactical fallback mechanism for signature items.
 */
export function getItemImage(item: any, type: 'menuItem' | 'promotion' = 'menuItem'): string {
    if (!item) return type === 'promotion' ? '🎁' : '🍕';

    // 1. Check for explicit image paths (support both camelCase and snake_case)
    const imagePath = item.imageUrl || item.image_url || item.image;

    // Validate if it's a real path/URL
    if (imagePath && (imagePath.startsWith('/') || imagePath.startsWith('http'))) {
        return imagePath;
    }

    // 2. Tactical Name-based Resolution (for missing paths in DB)
    const name = (item.name || '').toLowerCase();

    // Map common items to their expected public assets if no URL is provided
    if (name.includes('texane')) return '/images/pizzas/texane.png';
    if (name.includes('norv') || name.includes('norway')) return '/images/pizzas/norvegienne.png';
    if (name.includes('quatre') || name.includes('4 fromage')) return '/images/pizzas/4-fromages.png';
    if (name.includes('reine')) return '/images/pizzas/reine.png';
    if (name.includes('chef')) return '/images/pizzas/chef.png';
    if (name.includes('veget')) return '/images/pizzas/vegetarienne.png';
    if (name.includes('thon')) return '/images/pizzas/thon.png';
    if (name.includes('marguerite') || name.includes('margherita')) return '/images/pizzas/margherita.png';

    // 3. Fallback to Emoji or Default Icon
    return item.emoji || (type === 'promotion' ? '🎁' : '🍕');
}
