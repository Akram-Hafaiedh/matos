import { MenuItem, Promotion } from "@/types/menu";
import { CartItem } from "@/types/cart";

/**
 * Calculates the unit price for a single item (MenuItem or Promotion)
 * based on its configuration, selected size, and choices.
 */
export function calculateItemPrice(cartItem: CartItem): number {
    const { item, selectedSize, type, choices } = cartItem;
    let itemPrice = 0;

    if (type === 'promotion') {
        const promo = item as Promotion;

        // 1. Calculate original total from choices (selections)
        let originalTotal = 0;
        if (choices) {
            Object.values(choices).forEach((items: any) => {
                if (Array.isArray(items)) {
                    items.forEach(choiceItem => {
                        if (choiceItem.price) {
                            if (typeof choiceItem.price === 'number') {
                                originalTotal += choiceItem.price;
                            } else if (typeof choiceItem.price === 'object') {
                                originalTotal += choiceItem.price.xl || Object.values(choiceItem.price)[0] || 0;
                            }
                        }
                    });
                }
            });
        } else if (promo.originalPrice) {
            originalTotal = promo.originalPrice;
        }

        // 2. Determine the final item price
        if (promo.price && promo.price > 0) {
            // Fixed price promo (e.g., "Any 2 Pizzas for 25 DT")
            itemPrice = promo.price;
        } else if (promo.discount && originalTotal > 0) {
            // Percentage discount promo (e.g., "15% off and more")
            itemPrice = originalTotal * (1 - promo.discount / 100);
        } else {
            // Fallback to original total (no discount, or just a selection bundle)
            itemPrice = originalTotal;
        }
    } else {
        const menuItem = item as MenuItem;
        if (typeof menuItem.price === 'number') {
            itemPrice = menuItem.price;
        } else if (menuItem.price && typeof menuItem.price === 'object') {
            // For multi-size items, prioritize selectedSize, then 'xl', then first available
            if (selectedSize && (menuItem.price as any)[selectedSize]) {
                itemPrice = (menuItem.price as any)[selectedSize];
            } else if ('xl' in menuItem.price) {
                itemPrice = (menuItem.price as any).xl;
            } else {
                const prices = Object.values(menuItem.price);
                if (prices.length > 0) itemPrice = prices[0] as number;
            }
        }
    }

    return itemPrice;
}

/**
 * Calculates the original total price (pre-discount) for a promotion 
 * or the base price for a menu item.
 */
export function calculateOriginalTotal(cartItem: CartItem): number {
    const { item, type, choices } = cartItem;

    if (type === 'promotion') {
        let originalTotal = 0;
        if (choices) {
            Object.values(choices).forEach((items: any) => {
                if (Array.isArray(items)) {
                    items.forEach(choiceItem => {
                        if (choiceItem.price) {
                            if (typeof choiceItem.price === 'number') {
                                originalTotal += choiceItem.price;
                            } else if (typeof choiceItem.price === 'object') {
                                originalTotal += choiceItem.price.xl || Object.values(choiceItem.price)[0] || 0;
                            }
                        }
                    });
                }
            });
            return originalTotal;
        }
        return (item as Promotion).originalPrice || 0;
    } else {
        const menuItem = item as MenuItem;
        if (typeof menuItem.price === 'number') {
            return menuItem.price;
        } else if (menuItem.price && typeof menuItem.price === 'object' && cartItem.selectedSize) {
            return (menuItem.price as any)[cartItem.selectedSize] || 0;
        }
        return 0;
    }
}

/**
 * Calculates the total sum for a collection of cart items.
 */
export function calculateCartTotal(cart: { [key: string]: CartItem }): number {
    return Object.values(cart).reduce((total, cartItem) => {
        const unitPrice = calculateItemPrice(cartItem);
        return total + (unitPrice * cartItem.quantity);
    }, 0);
}
