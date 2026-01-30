'use client';

import { CartItem } from "@/types/cart";
import { MenuItem, Promotion } from "@/types/menu";
import { createContext, ReactNode, useContext, useState } from "react";

interface CartContextType {
    cart: { [key: string]: CartItem };
    addToCart: (item: MenuItem | Promotion, type: 'menuItem' | 'promotion', size?: string, choices?: any) => void;
    removeFromCart: (cartKey: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    orderType: 'delivery' | 'pickup';
    setOrderType: (type: 'delivery' | 'pickup') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
    const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

    const addToCart = (item: any, type: 'menuItem' | 'promotion', size?: string, choices?: any) => {
        // Create unique key
        const cartKey = type === 'promotion'
            ? `promo-${item.id}${choices ? `-${JSON.stringify(choices)}` : ''}`
            : (size ? `${item.id}-${size}` : `${item.id}`);

        setCart(prev => ({
            ...prev,
            [cartKey]: {
                item,
                type,
                quantity: (prev[cartKey]?.quantity || 0) + 1,
                selectedSize: size,
                choices
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
            const { item, quantity, selectedSize, type } = cartItem;
            let itemPrice = 0;

            if (type === 'promotion') {
                itemPrice = (item as Promotion).price || 0;
            } else {
                const menuItem = item as MenuItem;
                if (typeof menuItem.price === 'number') {
                    itemPrice = menuItem.price;
                } else if (menuItem.price && typeof menuItem.price === 'object') {
                    if (selectedSize && (menuItem.price as any)[selectedSize]) {
                        itemPrice = (menuItem.price as any)[selectedSize];
                    } else if ('xl' in menuItem.price) {
                        itemPrice = (menuItem.price as any).xl;
                    }
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
                getTotalItems,
                orderType,
                setOrderType
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