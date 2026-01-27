'use client';

import { CartItem } from "@/types/cart";
import { MenuItem } from "@/types/menu";
import { createContext, ReactNode, useContext, useState } from "react";

interface CartContextType {
    cart: { [key: string]: CartItem };
    addToCart: (item: MenuItem, size?: string) => void;
    removeFromCart: (cartKey: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<{ [key: string]: CartItem }>({});

    const addToCart = (item: MenuItem, size?: string) => {
        // Create unique key: if size is provided, use "id-size", otherwise just "id"
        const cartKey = size ? `${item.id}-${size}` : item.id;

        setCart(prev => ({
            ...prev,
            [cartKey]: {
                item,
                quantity: (prev[cartKey]?.quantity || 0) + 1,
                selectedSize: size
            }
        }));
    }


    // Remove one item or decrease quantity
    const removeFromCart = (cartKey: string) => {
        setCart(prev => {
            const newCart = { ...prev };

            if (newCart[cartKey].quantity > 1) {
                // Decrease quantity
                newCart[cartKey] = {
                    ...newCart[cartKey],
                    quantity: newCart[cartKey].quantity - 1
                };
            } else {
                // Remove item completely
                delete newCart[cartKey];
            }

            return newCart;
        });
    };

    // Clear entire cart
    const clearCart = () => {
        setCart({});
    };


    // Calculate total price
    const getTotalPrice = () => {
        return Object.values(cart).reduce((total, cartItem) => {
            const { item, quantity, selectedSize } = cartItem;
            let itemPrice = 0;

            if (typeof item.price === 'number') {
                // Simple numeric price
                itemPrice = item.price;
            } else if (item.price && typeof item.price === 'object') {
                // Object price (xl/xxl or multiple sizes)
                if (selectedSize && item.price[selectedSize]) {
                    itemPrice = item.price[selectedSize];
                } else if ('xl' in item.price) {
                    // Default to XL if no size selected
                    itemPrice = item.price.xl;
                }
            }

            return total + (itemPrice * quantity);
        }, 0);
    };

    // Get total number of items
    const getTotalItems = () => {
        return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    };


    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                getTotalPrice,
                getTotalItems
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
}