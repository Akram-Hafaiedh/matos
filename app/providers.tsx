// app/providers.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./cart/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ToastProvider>
                <ConfirmProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </ConfirmProvider>
            </ToastProvider>
        </SessionProvider>
    );
}