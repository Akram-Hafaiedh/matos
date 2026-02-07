
'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle, MessageCircle, ArrowRight, ChevronDown } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        q: "Quels sont vos délais de livraison ?",
        a: "Nous livrons généralement en 30 à 45 minutes. Pendant les heures de pointe, ce délai peut varier, mais nous garantissons un repas chaud !"
    },
    {
        q: "Livrez-vous dans tout le Grand Tunis ?",
        a: "Nous couvrons actuellement La Goulette, Le Kram, Carthage et La Marsa. D'autres zones arrivent bientôt !"
    },
    {
        q: "Comment fonctionne le programme de fidélité ?",
        a: "C'est simple : 1 DT dépensé = 1 Point. Cumulez-les pour débloquer des cadeaux exclusifs ou des réductions."
    },
    {
        q: "Avez-vous des options végétariennes ?",
        a: "Absolument ! Plusieurs de nos pizzas signature et salades sont 100% végétariennes et délicieuses."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-transparent relative overflow-hidden">

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 relative z-10">
                {/* Header */}
                <SectionHeader
                    badge="Support Center"
                    title={<>Des <span className="text-yellow-400">Réponses</span> <br /> à Tout</>}
                    description="Vous avez des questions ? Nous avons les réponses pour rendre votre expérience Mato's fluide."
                    sideDescription={true}
                />

                {/* FAQ List */}
                <div className="grid gap-6 w-full">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <motion.div
                                key={idx}
                                initial={false}
                                className={`group border transition-all duration-500 rounded-[2.5rem] overflow-hidden ${isOpen
                                    ? 'bg-white/[0.04] border-yellow-400/30'
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className="w-full text-left p-8 md:p-10 flex items-center justify-between gap-6"
                                >
                                    <span className={`text-xl md:text-2xl font-black italic tracking-tight transition-colors ${isOpen ? 'text-yellow-400' : 'text-white'}`}>
                                        {faq.q}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-yellow-400 text-gray-900' : 'bg-white/5 text-gray-500'
                                            }`}
                                    >
                                        <ChevronDown className="w-6 h-6" />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                        >
                                            <div className="px-10 pb-10 text-gray-400 font-bold leading-relaxed text-lg italic border-t border-white/5 pt-8">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Footer */}
                <div className="pt-12 text-center">
                    <Link
                        href="/faq"
                        className="group inline-flex items-center gap-4 text-gray-500 hover:text-yellow-400 transition-all font-black uppercase text-[10px] tracking-[0.4em]"
                    >
                        VOIR TOUTES LES QUESTIONS
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-yellow-400 group-hover:translate-x-2 transition-all">
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
