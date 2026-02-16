// app/providers.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/app/cart/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <SessionProvider>
                <ToastProvider>
                    <ConfirmProvider>
                        {children}
                    </ConfirmProvider>
                </ToastProvider>
            </SessionProvider>
        </CartProvider>
    );
}