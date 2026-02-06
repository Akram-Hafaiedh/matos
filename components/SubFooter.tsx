'use client';

import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";

export default function SubFooter({ className = "" }: { className?: string }) {
    const currentYear = new Date().getFullYear();

    return (
        <div className={`pt-12 border-t border-white/5 ${className}`}>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

                {/* Copyright */}
                <div className="order-3 lg:order-1">
                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] italic text-center lg:text-left">
                        © {currentYear} Mato's Restaurant Gourmet • Propriété Intellectuelle Réservée
                    </p>
                </div>

                {/* Legal Hub */}
                <div className="flex items-center gap-10 order-2">
                    <Link href="/terms" className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic hover:text-white transition-colors">Conditions</Link>
                    <div className="w-1 h-1 bg-yellow-400/20 rounded-full"></div>
                    <Link href="/policy" className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic hover:text-white transition-colors">Politique</Link>
                </div>

                {/* Credits */}
                <div className="order-1 lg:order-3">
                    <a
                        href="https://portfolio-six-mu-c3zpt9l3gd.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 group"
                    >
                        <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest italic">Crafted by</span>
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black text-white hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all flex items-center gap-2 italic">
                            Akram Hafaiedh
                            <ExternalLink className="w-3 h-3 text-yellow-400" />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
