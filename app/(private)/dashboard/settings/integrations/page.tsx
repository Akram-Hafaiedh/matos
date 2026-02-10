'use client';

import {
    Send, Mail, Smartphone, Globe, Activity,
    ChevronRight, Zap, Shield, Sparkles, Cpu
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TacticalAura from '@/components/TacticalAura';

export default function IntegrationsPage() {
    const integrations = [
        {
            id: 'sms',
            title: "SMS Gateway",
            description: "Passerelle de transmission GSM. Support Twilio, Ooredoo, TT & Orange.",
            icon: Smartphone,
            href: "/dashboard/settings/integrations/sms",
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            border: "border-yellow-400/20",
            status: "Operational"
        },
        {
            id: 'email',
            title: "Email SMTP",
            description: "Serveur de messagerie transactionnelle pour les confirmations et rapports.",
            icon: Mail,
            href: "/dashboard/settings/integrations/email",
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "border-blue-400/20",
            status: "Active"
        }
    ];

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            <TacticalAura />

            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Cpu size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Central Intelligence Unit</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Passerelles<span className="text-yellow-400"> Connectiques</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1 italic">Gestionnaire des flux de communication et protocoles externes</p>
                </div>
            </div>

            {/* Grid Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {integrations.map((item, idx) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className="group bg-white/[0.02] border border-white/5 p-12 rounded-[4rem] relative overflow-hidden transition-all duration-700 hover:border-yellow-400/30 shadow-3xl flex flex-col justify-between min-h-[350px]"
                    >
                        <div className={`absolute top-0 right-0 w-64 h-64 ${item.bg} blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-1000`}></div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.border} border flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-700`}>
                                    <item.icon size={28} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">{item.status}</span>
                                </div>
                            </div>

                            <h3 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 font-bold uppercase text-[11px] tracking-widest leading-relaxed italic max-w-xs">
                                {item.description}
                            </p>
                        </div>

                        <div className="relative z-10 mt-10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield size={12} className="text-yellow-400/40" />
                                <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em] italic">Encryption Layer Active</span>
                            </div>
                            <div className="text-yellow-400 font-[1000] uppercase text-[10px] tracking-[0.4em] italic flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
                                Configurer <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Diagnostic Alert */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-400/5 border border-yellow-400/10 p-10 rounded-[3.5rem] flex items-center justify-between group"
            >
                <div className="flex items-start gap-8">
                    <Activity className="w-10 h-10 text-yellow-400 shrink-0 mt-1 animate-pulse" />
                    <div className="space-y-2">
                        <h4 className="text-xl font-[1000] text-white uppercase italic tracking-tighter">Moniteur de Transmission</h4>
                        <p className="text-gray-600 font-bold uppercase tracking-widest text-[9px] italic leading-loose max-w-2xl">
                            Tous les vecteurs de communication sont synchronisés. <br />
                            Le système Mato's utilise des protocoles haute-fidélité pour garantir 100% de délivrabilité.
                        </p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                        <Sparkles size={20} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
