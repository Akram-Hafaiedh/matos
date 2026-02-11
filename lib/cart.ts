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
 * Returns the appropriate image or emoji for a cart item.
 */
export function getItemImage(item: any, type: 'menuItem' | 'promotion'): string {
    if (type === 'promotion') {
        return item.imageUrl || item.emoji || '🎁';
    }
    return item.imageUrl || item.image || item.emoji || '🍕';
}
