// app/providers.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./cart/CartContext";
import { ToastProvider } from "./context/ToastContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ToastProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </ToastProvider>
        </SessionProvider>
    );
}