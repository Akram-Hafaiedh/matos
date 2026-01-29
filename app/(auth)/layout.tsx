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
            <div className="min-h-screen bg-black flex items-center justify-center px-4 py-24 relative overflow-hidden">
                {/* Ambient Background Glows */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/5 blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-400/5 blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {children}
                    </div>

                    {/* Elite Footer Section */}
                    <div className="text-center mt-12 pt-8 border-t border-gray-900/50">
                        <a href="/" className="group inline-flex items-center gap-2 text-gray-600 hover:text-yellow-400 transition-all font-black uppercase text-[10px] tracking-[0.2em]">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            Retour à l'accueil
                        </a>
                        <div className="mt-6 flex flex-col items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-yellow-400/20"></div>
                            <p className="text-gray-700 font-black text-[9px] uppercase tracking-[0.4em]">
                                Signature Mato's • {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Providers>
    );
}