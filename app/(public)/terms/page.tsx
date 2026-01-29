'use client';

import { Gavel, CreditCard, Truck, Users, ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
    const sections = [
        {
            icon: <Users className="w-6 h-6 text-yellow-400" />,
            title: "Accès et Utilisation",
            content: "L'utilisation de la plateforme Mato's est réservée aux personnes âgées de 18 ans ou plus. Vous vous engagez à ne pas utiliser nos services à des fins illégales ou non autorisées."
        },
        {
            icon: <CreditCard className="w-6 h-6 text-yellow-400" />,
            title: "Commandes et Paiements",
            content: "Toutes les commandes sont soumises à la disponibilité des produits. Les prix sont indiqués en Dinars Tunisiens (DT). Le paiement s'effectue à la livraison ou via les moyens de paiement acceptés sur notre site."
        },
        {
            icon: <Truck className="w-6 h-6 text-yellow-400" />,
            title: "Livraison",
            content: "Nous nous efforçons de respecter les délais de livraison indiqués lors de votre commande. Toutefois, ces délais sont donnés à titre indicatif et Mato's ne peut être tenu responsable d'éventuels retards indépendants de sa volonté."
        },
        {
            icon: <Gavel className="w-6 h-6 text-yellow-400" />,
            title: "Propriété Intellectuelle",
            content: "Tous les contenus présents sur la plateforme (logos, textes, images, designs) sont la propriété exclusive de Mato's et sont protégés par les lois sur le droit d'auteur."
        }
    ];

    return (
        <main className="min-h-screen bg-black pt-32 pb-20 px-4 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-orange-500/5 blur-[150px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="space-y-6 mb-16">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition-colors font-bold text-sm uppercase tracking-widest group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Retour à l'accueil
                    </Link>
                    <div className="space-y-2">
                        <div className="text-yellow-400 font-black uppercase text-xs tracking-[0.4em]">Conditions d'utilisation</div>
                        <h1 className="text-5xl md:text-7xl font-[1000] text-white italic tracking-tighter leading-none">
                            Conditions <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Générales</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
                        Merci de lire attentivement nos conditions générales de vente et d'utilisation avant de profiter de l'expérience Mato's.
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 hover:border-yellow-400/20 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 bg-gray-950 rounded-2xl border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                                    {section.icon}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <h2 className="text-2xl font-black text-white italic group-hover:text-yellow-400 transition-colors">
                                        {section.title}
                                    </h2>
                                    <p className="text-gray-400 font-bold leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Accept Disclaimer */}
                <div className="mt-12 p-8 bg-yellow-400/10 border border-yellow-400/20 rounded-[2rem] text-center">
                    <div className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Engagement
                    </div>
                    <p className="text-white font-bold italic">
                        En utilisant notre plateforme, vous acceptez pleinement et sans réserve l'intégralité de ces conditions.
                    </p>
                </div>

                {/* Last Update */}
                <div className="mt-16 pt-8 border-t border-white/5 text-center text-gray-600 font-black text-[10px] uppercase tracking-[0.3em]">
                    Dernière mise à jour : 29 Janvier 2026
                </div>
            </div>
        </main>
    );
}
