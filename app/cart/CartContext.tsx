'use client';

import { CartItem } from "@/types/cart";
import { MenuItem, Promotion } from "@/types/menu";
import { calculateCartTotal } from "@/lib/pricing";
import { generateCartKey, countTotalItems } from "@/lib/cart";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface CartContextType {
    cart: { [key: string]: CartItem };
    addToCart: (item: MenuItem | Promotion, type: 'menuItem' | 'promotion', size?: string, choices?: any, quantity?: number) => void;
    removeFromCart: (cartKey: string) => void;
    updateQuantity: (cartKey: string, delta: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    orderType: 'delivery' | 'pickup';
    setOrderType: (type: 'delivery' | 'pickup') => void;
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
}

const CART_STORAGE_KEY = 'matos_cart';
const ORDER_TYPE_STORAGE_KEY = 'matos_order_type';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
    const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
    const [isCartOpen, setCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load and Cross-Tab Synchronization
    useEffect(() => {
        const loadCart = () => {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            const savedOrderType = localStorage.getItem(ORDER_TYPE_STORAGE_KEY);

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
        };

        // Load initially
        loadCart();
        setIsLoaded(true);

        // Listen for changes from other tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === CART_STORAGE_KEY || e.key === ORDER_TYPE_STORAGE_KEY) {
                loadCart();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Save on local state changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            localStorage.setItem(ORDER_TYPE_STORAGE_KEY, orderType);
        }
    }, [cart, orderType, isLoaded]);

    const addToCart = (item: any, type: 'menuItem' | 'promotion', size?: string, choices?: any, quantity: number = 1) => {
        const cartKey = generateCartKey(item, type, size, choices);

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
    };

    const removeFromCart = (cartKey: string) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (!newCart[cartKey]) return prev;

            if (newCart[cartKey].quantity > 1) {
                newCart[cartKey] = {
                    ...newCart[cartKey],
                    quantity: newCart[cartKey].quantity - 1
                };
            } else {
                delete newCart[cartKey];
            }

            return newCart;
        });
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

    const clearCart = () => {
        setCart({});
    };

    const getTotalPrice = () => calculateCartTotal(cart);
    const getTotalItems = () => countTotalItems(cart);

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
        throw new Error('useCart must be used within a CartProvider.');
    }
    return context;
}
