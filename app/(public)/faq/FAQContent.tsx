'use client';

import {
    HelpCircle,
    ChevronDown,
    MessageCircle,
    Sparkles,
    ChevronRight,
    Phone,
    Truck,
    CreditCard,
    ShieldCheck
} from 'lucide-react';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const iconMap: Record<string, any> = {
    Truck,
    CreditCard,
    ShieldCheck,
    HelpCircle
};

interface FAQContentProps {
    faqs: any[];
}

export default function FAQContent({ faqs }: FAQContentProps) {
    const [openIndex, setOpenIndex] = useState<string | null>("0-0");
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -30]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

    const toggleFaq = (idx: string) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-transparent text-white py-32 pb-40 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32 relative z-10">

                {/* Header Section with Parallax */}
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
                            <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.4em] italic">Centre d'aide Mato's</span>
                        </motion.div>

                        <div className="relative group">
                            <div className="absolute -inset-16 bg-yellow-400/15 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative bg-yellow-400 py-8 px-12 md:px-20 -rotate-1 hover:rotate-0 transition-all duration-700 shadow-[0_0_80px_rgba(250,204,21,0.15)]">
                                <h1 className="text-5xl md:text-[9rem] font-[1000] italic uppercase tracking-tighter text-black leading-none inline-block pr-[0.4em]">
                                    Questions
                                </h1>
                            </div>
                        </div>

                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[11px] italic pt-8">
                            Tout ce que vous devez savoir sur l'expérience Mato's, <br /> regroupé au même endroit.
                        </p>
                    </div>
                </motion.div>

                {/* FAQ List */}
                <div className="space-y-24">
                    {faqs.map((cat, catIdx) => (
                        <div key={catIdx} className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-6"
                            >
                                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-black shadow-[0_15px_40px_rgba(250,204,21,0.2)] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                    {(() => {
                                        const Icon = iconMap[cat.icon] || HelpCircle;
                                        return <Icon className="w-7 h-7" />;
                                    })()}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-[1000] uppercase italic tracking-tighter text-white">{cat.category}</h2>
                            </motion.div>

                            <div className="grid gap-8">
                                {cat.questions.map((faq: { q: string, a: string }, faqIdx: number) => {
                                    const id = `${catIdx}-${faqIdx}`;
                                    const isOpen = openIndex === id;
                                    return (
                                        <motion.div
                                            key={faqIdx}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: faqIdx * 0.1 }}
                                            className={`group relative rounded-[3rem] overflow-hidden transition-all duration-700 border ${isOpen
                                                ? 'bg-white/[0.04] border-yellow-400/30 shadow-2xl'
                                                : 'bg-[#0a0a0a] border-white/5 hover:border-yellow-400/20'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleFaq(id)}
                                                className="w-full text-left p-10 md:p-12 flex items-center justify-between gap-8 group/btn"
                                            >
                                                <span className={`text-2xl md:text-3xl font-[1000] italic tracking-tight uppercase leading-tight transition-colors ${isOpen ? 'text-yellow-400' : 'text-white'}`}>
                                                    {faq.q}
                                                </span>
                                                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-yellow-400 text-black' : 'bg-white/5 text-gray-500 group-hover/btn:bg-white/10'
                                                    }`}>
                                                    <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                                    >
                                                        <div className="px-12 pb-12 pt-0">
                                                            <div className="border-t border-white/5 pt-10">
                                                                <p className="text-gray-400 font-bold text-lg italic leading-relaxed uppercase tracking-wide">
                                                                    {faq.a}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Kinetic CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-[#0a0a0a] rounded-[4rem] p-16 md:p-24 border border-white/5 overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/[0.02] blur-[150px] rounded-full -mr-48 -mt-48 transition-colors duration-1000 group-hover:bg-yellow-400/[0.05]"></div>

                    <div className="relative z-10 flex flex-col items-center text-center gap-12">
                        <div className="space-y-6">
                            <h3 className="text-5xl md:text-7xl font-[1000] uppercase italic tracking-tighter leading-none text-white">
                                Vous avez toujours <br /> <span className="text-yellow-400">une question ?</span>
                            </h3>
                            <p className="font-bold text-gray-500 uppercase tracking-[0.2em] text-xs italic max-w-xl mx-auto">
                                Notre équipe est là pour vous aider 7j/7. <br /> N'hésitez pas à nous contacter directement.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                            <Link
                                href="/contact"
                                className="group/link bg-yellow-400 text-black px-12 py-6 rounded-2xl font-[1000] uppercase text-xs tracking-[0.2em] hover:bg-white transition-all shadow-[0_20px_50px_rgba(250,204,21,0.15)] flex items-center gap-4 active:scale-95 w-full sm:w-auto justify-center"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>Nous Contacter</span>
                                <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="tel:+21671000000"
                                className="bg-white/5 backdrop-blur-xl border border-white/10 text-white px-12 py-6 rounded-2xl font-[1000] uppercase text-xs tracking-[0.2em] hover:border-yellow-400/40 hover:bg-white/10 transition-all flex items-center gap-4 active:scale-95 w-full sm:w-auto justify-center"
                            >
                                <Phone className="w-5 h-5 text-yellow-400" />
                                71 000 000
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
