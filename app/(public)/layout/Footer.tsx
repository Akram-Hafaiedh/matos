'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Facebook,
    Instagram,
    Phone,
    Mail,
    MapPin,
    Clock,
    ChevronRight,
    ExternalLink,
    UtensilsCrossed,
    Heart,
    Star,
    MessageCircle
} from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);


export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data) setSettings(data);
            } catch (error) {
                console.error("Error loading settings in footer:", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="relative bg-black pt-24 pb-12 overflow-hidden border-t border-white/5">
            {/* Ambient Background Glows */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative w-16 h-16 bg-white/5 rounded-2xl border-2 border-yellow-400/30 p-2 flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-yellow-400 transition-all duration-500">
                                <Image
                                    src="/logo.svg"
                                    alt="Mato's Logo"
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-3xl font-black text-white tracking-widest uppercase italic group-hover:text-yellow-400 transition-colors">MATO'S</span>
                        </Link>
                        <p className="text-gray-500 font-bold leading-relaxed">
                            L'excellence de la gastronomie rapide. Découvrez nos pizzas artisanales, burgers gourmets et tacos généreux, préparés avec passion et fraîcheur.
                        </p>
                        <div className="flex items-center gap-4">
                            {settings?.facebook && (
                                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-gray-900 hover:border-yellow-400 transition-all duration-300">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.instagram && (
                                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-300">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.tiktok && (
                                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-white transition-all duration-300">
                                    <TikTokIcon className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.whatsapp && (
                                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300">
                                    <MessageCircle className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-8">
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                            <UtensilsCrossed className="w-5 h-5 text-yellow-400" />
                            Exploration
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Notre Carte", href: "/menu" },
                                { name: "Promotions", href: "/promos" },
                                { name: "Service Client", href: "/support" },
                                { name: "Contactez-nous", href: "/contact" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-400 hover:text-yellow-400 font-bold flex items-center gap-2 group transition-colors">
                                        <ChevronRight className="w-4 h-4 text-gray-800 group-hover:text-yellow-400 transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Information */}
                    <div className="space-y-8">
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                            <Clock className="w-5 h-5 text-yellow-400" />
                            Informations
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <MapPin className="w-5 h-5 text-gray-700 mt-1" />
                                <div>
                                    <p className="text-white font-black text-sm uppercase">Adresse</p>
                                    <p className="text-gray-500 text-sm font-bold">{settings?.address || 'Chargement...'}</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <Phone className="w-5 h-5 text-gray-700 mt-1" />
                                <div>
                                    <p className="text-white font-black text-sm uppercase">Réservation</p>
                                    <p className="text-gray-500 text-sm font-bold">{settings?.phone || 'Chargement...'}</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <Mail className="w-5 h-5 text-gray-700 mt-1" />
                                <div>
                                    <p className="text-white font-black text-sm uppercase">Support</p>
                                    <p className="text-gray-500 text-sm font-bold">contact@matos.tn</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter / App */}
                    <div className="space-y-8">
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                            <Star className="w-5 h-5 text-yellow-400" />
                            Avantages
                        </h4>
                        <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-2xl">
                            <p className="text-white font-black text-sm uppercase tracking-wide">Programme Fidélité</p>
                            <p className="text-gray-500 text-xs font-bold leading-relaxed">
                                Rejoignez le club Mato's et commencez à cumuler des points à chaque bouchée.
                            </p>
                            <Link href="/register" className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-black text-xs transition-all w-full justify-center shadow-lg shadow-yellow-400/10">
                                S'inscrire maintenant
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sub-Footer */}
                <div className="pt-12 border-t border-white/5">
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
            </div>
        </footer>
    );
}
