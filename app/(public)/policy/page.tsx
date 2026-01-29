'use client';

import { Shield, Lock, Eye, FileText, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
    const sections = [
        {
            icon: <Shield className="w-6 h-6 text-yellow-400" />,
            title: "Collecte des Données",
            content: "Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte, de vos commandes ou lors de vos échanges avec notre support. Cela inclut votre nom, adresse email, numéro de téléphone et adresse de livraison."
        },
        {
            icon: <Lock className="w-6 h-6 text-yellow-400" />,
            title: "Sécurité de vos Informations",
            content: "La sécurité de vos données est notre priorité absolue. Nous utilisons des protocoles de cryptage de pointe (SSL) et des mesures de sécurité physiques pour protéger vos informations contre tout accès non autorisé."
        },
        {
            icon: <Eye className="w-6 h-6 text-yellow-400" />,
            title: "Utilisation des Cookies",
            content: "Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme, mémoriser vos préférences et analyser notre trafic. Vous pouvez gérer vos préférences de cookies dans les réglages de votre navigateur."
        },
        {
            icon: <FileText className="w-6 h-6 text-yellow-400" />,
            title: "Vos Droits",
            content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez également vous opposer au traitement de vos données pour des motifs légitimes."
        }
    ];

    return (
        <main className="min-h-screen bg-black pt-32 pb-20 px-4 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-500/5 blur-[150px] pointer-events-none"></div>

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
                        <div className="text-yellow-400 font-black uppercase text-xs tracking-[0.4em]">Confidentialité</div>
                        <h1 className="text-5xl md:text-7xl font-[1000] text-white italic tracking-tighter leading-none">
                            Politique de <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Confidentialité</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
                        Chez Mato's, nous prenons la protection de vos données personnelles très au sérieux.
                        Cette politique détaille comment nous traitons vos informations.
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

                {/* Last Update */}
                <div className="mt-16 pt-8 border-t border-white/5 text-center text-gray-600 font-black text-[10px] uppercase tracking-[0.3em]">
                    Dernière mise à jour : 29 Janvier 2026
                </div>
            </div>
        </main>
    );
}
