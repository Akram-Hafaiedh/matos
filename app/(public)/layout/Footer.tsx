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
    UtensilsCrossed,
    Star,
    MessageCircle,
    HelpCircle,
    Crown,
    ArrowRight
} from "lucide-react";
import SubFooter from "@/components/SubFooter";
import { useSession } from "next-auth/react";

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);


export default function Footer() {
    const { data: session, status } = useSession();
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
        <footer className="relative bg-transparent pt-32 pb-12 overflow-hidden border-t border-white/5 mt-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

                    {/* Brand Section */}
                    <div className="space-y-10">
                        <Link href="/" className="inline-block group">
                            <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-yellow-400 group-hover:bg-yellow-400 transition-all duration-500">
                                    <Image
                                        src="/logo.svg"
                                        alt="Mato's Logo"
                                        width={36}
                                        height={36}
                                        className="object-contain group-hover:brightness-0 transition-all duration-500"
                                    />
                                </div>
                                <span className="text-2xl font-[1000] text-white tracking-widest uppercase italic group-hover:text-yellow-400 transition-all duration-500">MATO'S</span>
                            </div>
                        </Link>
                        <p className="text-gray-500 text-[11px] font-bold leading-relaxed uppercase tracking-wider italic pr-4">
                            L'essence de la gastronomie rapide. Découvrez l'alliance parfaite entre tradition artisanale et innovation culinaire.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Facebook, href: settings?.facebook, hover: 'hover:bg-blue-600' },
                                { icon: Instagram, href: settings?.instagram, hover: 'hover:bg-pink-600' },
                                { icon: TikTokIcon, href: settings?.tiktok, hover: 'hover:bg-white hover:text-black' },
                                { icon: MessageCircle, href: settings?.whatsapp, hover: 'hover:bg-green-500' }
                            ].map((social, i) => social.href && (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 transition-all duration-300 ${social.hover} hover:text-white hover:border-transparent hover:scale-110 active:scale-95`}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-10 pt-4">
                        <h4 className="text-[10px] font-black text-gray-600 italic uppercase tracking-[0.4em] flex items-center gap-3">
                            <UtensilsCrossed className="w-3.5 h-3.5" />
                            Navigation
                        </h4>
                        <ul className="space-y-5">
                            {[
                                { name: "Menu Gourmet", href: "/menu" },
                                { name: "Offres Limitées", href: "/promos" },
                                { name: "Suivi Commande", href: "/track" },
                                { name: "Centre d'Aide", href: "/faq" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white hover:text-yellow-400 font-[1000] italic uppercase tracking-tighter text-base flex items-center gap-2 group transition-all">
                                        <ChevronRight className="w-4 h-4 text-gray-800 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Information */}
                    <div className="space-y-10 pt-4">
                        <h4 className="text-[10px] font-black text-gray-600 italic uppercase tracking-[0.4em] flex items-center gap-3">
                            <Clock className="w-3.5 h-3.5" />
                            Prestige
                        </h4>
                        <ul className="space-y-6">
                            <li className="space-y-2">
                                <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] italic">Localisation</p>
                                <p className="text-white font-bold text-xs uppercase tracking-widest italic leading-relaxed">{settings?.address || 'Tunis, Tunisie'}</p>
                            </li>
                            <li className="space-y-2">
                                <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] italic">Contact Direct</p>
                                <p className="text-white font-bold text-xs uppercase tracking-widest italic">{settings?.phone}</p>
                                <p className="text-yellow-400 font-bold text-[10px] uppercase tracking-[0.1em] italic">contact@matos.tn</p>
                            </li>
                        </ul>
                    </div>

                    {/* Loyalty Card App Style */}
                    <div className="lg:pt-4">
                        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[50px] rounded-full group-hover:bg-yellow-400/10 transition-all duration-1000"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20">
                                    <Crown className="w-3 h-3 text-yellow-400" />
                                    <span className="text-yellow-400 font-black text-[8px] uppercase tracking-[0.4em] italic">Mato's Elite</span>
                                </div>
                                <h4 className="text-xl font-[1000] text-white italic uppercase tracking-tighter leading-tight">
                                    {status === 'authenticated' ? `Bienvenue \n${session?.user?.name?.split(' ')[0]}` : 'Accès Privilège'}
                                </h4>
                                <p className="text-gray-500 text-[10px] font-black leading-relaxed uppercase tracking-widest italic">
                                    {status === 'authenticated'
                                        ? 'Découvrez vos récompenses et offres exclusives.'
                                        : 'Cumulez des privilèges à chaque dégustation.'}
                                </p>
                                <Link
                                    href={status === 'authenticated' ? "/account/loyalty" : "/register"}
                                    className="flex items-center justify-between bg-white hover:bg-yellow-400 text-black px-6 py-4 rounded-2xl transition-all group/btn"
                                >
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">
                                        {status === 'authenticated' ? 'Ma Carte Elite' : 'Rejoindre l\'Elite'}
                                    </span>
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Footer */}
                <SubFooter />
            </div>
        </footer>
    );
}
