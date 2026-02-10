'use client';

import { CartItem } from "@/types/cart";
import { MenuItem, Promotion } from "@/types/menu";
import { calculateCartTotal } from "@/lib/pricing";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface CartContextType {
    cart: { [key: string]: CartItem };
    addToCart: (item: MenuItem | Promotion, type: 'menuItem' | 'promotion', size?: string, choices?: any, quantity?: number) => void;
    removeFromCart: (cartKey: string) => void;
    updateQuantity: (cartKey: string, delta: number) => void; // Added for convenience if needed
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    orderType: 'delivery' | 'pickup';
    setOrderType: (type: 'delivery' | 'pickup') => void;
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
    const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
    const [isCartOpen, setCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load
    useEffect(() => {
        const savedCart = localStorage.getItem('matos_cart');
        const savedOrderType = localStorage.getItem('matos_order_type');

        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
            }
        }

        if (savedOrderType === 'delivery' || savedOrderType === 'pickup') {
            setOrderType(savedOrderType);
        }

        setIsLoaded(true);
    }, []);

    // Save on changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('matos_cart', JSON.stringify(cart));
            localStorage.setItem('matos_order_type', orderType);
        }
    }, [cart, orderType, isLoaded]);

    const addToCart = (item: any, type: 'menuItem' | 'promotion', size?: string, choices?: any, quantity: number = 1) => {
        // Create unique key
        const cartKey = type === 'promotion'
            ? `promo-${item.id}${choices ? `-${JSON.stringify(choices)}` : ''}`
            : (size ? `${item.id}-${size}` : `${item.id}`);

        setCart(prev => ({
            ...prev,
            [cartKey]: {
                item,
                type,
                quantity: (prev[cartKey]?.quantity || 0) + quantity,
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

    const updateQuantity = (cartKey: string, delta: number) => {
        setCart(prev => {
            if (!prev[cartKey]) return prev;
            const newQuantity = prev[cartKey].quantity + delta;

            if (newQuantity <= 0) {
                const newCart = { ...prev };
                delete newCart[cartKey];
                return newCart;
            }

            return {
                ...prev,
                [cartKey]: { ...prev[cartKey], quantity: newQuantity }
            };
        });
    };


    // Calculate total price
    const getTotalPrice = () => {
        return calculateCartTotal(cart);
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
                updateQuantity,
                clearCart,
                getTotalPrice,
                getTotalItems,
                orderType,
                setOrderType,
                isCartOpen,
                setCartOpen
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart hook must be used within a CartProvider. Please ensure your component is wrapped inside a <CartProvider>.');
    }

    return context;
}