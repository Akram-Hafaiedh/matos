'use client';

import {
    Gavel,
    CreditCard,
    Truck,
    Users,
    ArrowLeft,
    BookOpen,
    Shield,
    Lock,
    Eye,
    FileText,
    ShieldAlert,
    Zap,
    Sparkles,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import AmbientBackground from '@/components/AmbientBackground';

const iconMap: Record<string, any> = {
    Gavel,
    CreditCard,
    Truck,
    Users,
    Shield,
    Lock,
    Eye,
    FileText,
    ShieldAlert,
    Zap
};

export default function TermsContent({ page, sections }: { page: any, sections: any[] }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -30]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

    return (
        <div ref={containerRef} className="min-h-screen bg-transparent text-white py-32 pb-0 relative overflow-hidden">
            <AmbientBackground />

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32 relative z-10">

                {/* Header Section with Parallax - SPLIT HIGHLIGHT STYLE */}
                <motion.div
                    style={{ y: headerY, opacity: headerOpacity }}
                    className="flex flex-col items-center gap-12 text-center"
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                            <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.4em] italic">Protocoles Officiels Mato's</span>
                        </motion.div>

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-[8rem] font-[1000] italic uppercase tracking-tighter text-white leading-none flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                                <span>{page.title.split(' ')[0]}</span>
                                <motion.span
                                    initial={{ clipPath: 'inset(0 100% 0 0)', x: -20 }}
                                    whileInView={{ clipPath: 'inset(0 0% 0 0)', x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                    className="relative bg-yellow-400 px-8 py-4 -rotate-1 text-black shadow-[15px_15px_0_rgba(0,0,0,1)] border-4 border-black inline-block"
                                >
                                    {page.title.split(' ').slice(1).join(' ')}
                                </motion.span>
                            </h1>

                            <div className="flex flex-col items-center gap-4">
                                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] italic max-w-2xl mx-auto leading-relaxed">
                                    {page.subtitle}
                                </p>
                                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                                        REVISÉ LE {page.updated_at.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Grid - Product Card Aesthetic (More Compact) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-32">
                    {sections.map((section, idx) => {
                        const Icon = iconMap[section.icon] || Gavel;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8 }}
                                className="group relative"
                            >
                                <div className="absolute -inset-1 bg-yellow-400/5 rounded-[3.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="relative bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 md:p-14 hover:border-yellow-400/20 transition-all duration-700 h-full flex flex-col gap-8">
                                    <div className="flex items-start justify-between">
                                        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-black shadow-[0_10px_30px_rgba(250,204,21,0.15)] transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className="text-gray-800 font-[1000] text-3xl italic tracking-tighter opacity-20 group-hover:opacity-40 transition-opacity">
                                            0{idx + 1}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors leading-none">
                                            {section.title}
                                        </h2>
                                        <div className="w-8 h-1 bg-yellow-400/20 group-hover:w-16 group-hover:bg-yellow-400 transition-all duration-700"></div>
                                        <p className="text-gray-500 font-bold text-base leading-relaxed italic uppercase tracking-wide group-hover:text-gray-400 transition-colors">
                                            {section.content}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 flex items-center gap-4 text-gray-800 text-[8px] font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all italic">
                                        <div className="w-6 h-px bg-gray-800"></div>
                                        Security Node Passive
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* SLANTED FOOTER SECTION (Site Standard - Refined Size) */}
            <section className="relative mt-20">
                <div
                    className="absolute inset-0 z-0 bg-yellow-400"
                    style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 100%, 0 100%)' }}
                >
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(black 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                </div>

                <div className="relative z-10 pt-32 pb-16 flex flex-col items-center text-center text-black px-6">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="space-y-6">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-yellow-400 shadow-xl mb-2 mx-auto transform hover:scale-110 transition-transform duration-700">
                            <BookOpen className="w-7 h-7" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-[1000] uppercase italic tracking-tighter leading-[0.9] max-w-2xl">
                            EN UTILISANT NOTRE PLATEFORME, <br />
                            VOUS ACCEPTEZ L'INTÉGRALITÉ <br />
                            DE CES <span className="underline decoration-black/20">PROTOCOLES.</span>
                        </h2>

                        <div className="pt-4">
                            <Link href="/menu" className="relative group overflow-hidden px-10 py-4 bg-black text-white font-[1000] uppercase italic tracking-widest rounded-full text-[10px] hover:scale-105 transition-all shadow-xl inline-block">
                                <span className="relative z-10">Entrer dans l'Arène</span>
                                <div className="absolute inset-0 flex items-center justify-center bg-white text-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 font-black uppercase text-[10px]">Accès Immédiat</div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
