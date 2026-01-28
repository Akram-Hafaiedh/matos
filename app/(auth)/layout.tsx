// app/auth/layout.tsx
'use client';

import { Providers } from "../providers";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {children}
                    {/* Simple bottom section for auth pages only */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-700">
                        <a href="/" className="text-gray-400 hover:text-yellow-400 transition text-sm">
                            ← Retour à l'accueil du restaurant
                        </a>
                        <p className="text-gray-500 text-xs mt-2">
                            © {new Date().getFullYear()} Mato's Restaurant
                        </p>
                    </div>
                </div>
            </div>
        </Providers>
    );
}