'use client';

import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";

export default function SubFooter({ className = "" }: { className?: string }) {
    const currentYear = new Date().getFullYear();

    return (
        <div className={`pt-12 border-t border-white/5 ${className}`}>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Copyright */}
                <div className="text-gray-600 text-xs font-bold order-3 lg:order-1 text-center lg:text-left">
                    © {currentYear} Mato's Restaurant Gourmet. Propriété intellectuelle réservée.
                </div>

                {/* Legal */}
                <div className="flex items-center gap-6 text-gray-500 text-xs font-black uppercase tracking-widest order-2">
                    <Link href="/terms" className="hover:text-white transition-colors">Conditions</Link>
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                    <Link href="/policy" className="hover:text-white transition-colors">Politique</Link>
                </div>

                {/* Credits */}
                <div className="flex items-center gap-3 order-1 lg:order-3">
                    <span className="text-gray-600 text-xs font-bold flex items-center gap-2">
                        Crafted with <Heart className="w-3 h-3 text-red-500 animate-pulse fill-red-500" /> by
                    </span>
                    <a
                        href="https://portfolio-six-mu-c3zpt9l3gd.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-black transition-all border border-white/5 hover:border-yellow-400/30 flex items-center gap-2"
                    >
                        Akram Hafaiedh
                        <ExternalLink className="w-3 h-3 text-yellow-400" />
                    </a>
                </div>
            </div>
        </div>
    );
}
