'use client';

import { useState, useEffect } from 'react';
import {
    MapPin,
    Phone,
    Clock,
    Mail,
    Send,
    MessageCircle,
    Instagram,
    Facebook,
    LifeBuoy,
    ExternalLink,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    Video
} from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    const [settings, setSettings] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data) setSettings(data);
            } catch (error) {
                console.error("Error loading settings in contact page:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.subject && formData.message) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            }, 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-black text-white py-24 px-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-24 relative z-10">
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm font-black uppercase tracking-widest animate-fade-in">
                        <Sparkles className="w-4 h-4" />
                        On reste en contact
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none animate-slide-up">
                        Contactez <span className="text-yellow-400">Nous</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-bold animate-fade-in delay-200">
                        Une question ? Une suggestion ? L'équipe Mato's est à votre entière disposition pour vous offrir la meilleure expérience.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Support Promo Card */}
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-[2.5rem] text-gray-900 shadow-2xl shadow-yellow-400/10 group transition-transform duration-500 hover:scale-[1.02]">
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-3 bg-black/10 rounded-2xl">
                                    <LifeBuoy className="w-8 h-8" />
                                </div>
                                <ShieldCheck className="w-6 h-6 opacity-40" />
                            </div>
                            <h3 className="text-2xl font-black mb-3">Support Prioritaire</h3>
                            <p className="font-bold text-black/70 mb-8">
                                Nos membres bénéficient d'une assistance dédiée avec un suivi en temps réel de leurs demandes.
                            </p>
                            <Link href="/support" className="flex items-center justify-between bg-black text-white p-5 rounded-2xl font-black transition group-hover:bg-gray-900 shadow-xl">
                                <span>Ouvrir un ticket</span>
                                <ExternalLink className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-xl group hover:border-yellow-400/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center border border-gray-800 group-hover:rotate-6 transition-transform">
                                        <Phone className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Téléphone</p>
                                        <p className="text-lg font-black">{settings?.phone || 'Loading...'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-xl group hover:border-yellow-400/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center border border-gray-800 group-hover:rotate-6 transition-transform">
                                        <Mail className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Email</p>
                                        <p className="text-lg font-black">hello@matos.tn</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-xl group hover:border-yellow-400/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center border border-gray-800 group-hover:rotate-6 transition-transform">
                                        <MapPin className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Localisation</p>
                                        <p className="text-lg font-black">{settings?.address || 'Loading...'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-900/40 border border-gray-800 p-10 md:p-12 rounded-[3.5rem] shadow-3xl backdrop-blur-3xl relative overflow-hidden">
                            <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
                                <MessageCircle className="w-8 h-8 text-yellow-400" />
                                Envoyez un message
                            </h2>

                            {submitted ? (
                                <div className="py-20 text-center space-y-6 animate-fade-in">
                                    <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl border border-green-500/30">
                                        ✓
                                    </div>
                                    <h3 className="text-3xl font-black">Message Envoyé !</h3>
                                    <p className="text-gray-500 font-bold max-w-sm mx-auto text-lg">
                                        Nous avons bien reçu votre demande et reviendrons vers vous très prochainement.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest ml-1">Nom Complet</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-gray-950 border border-gray-800 p-5 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors font-bold"
                                                placeholder="votre nom"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest ml-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-gray-950 border border-gray-800 p-5 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors font-bold"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-600 uppercase tracking-widest ml-1">Sujet de votre demande</label>
                                        <select
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full bg-gray-950 border border-gray-800 p-5 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors font-black appearance-none"
                                        >
                                            <option value="">Choisissez un sujet</option>
                                            <option value="commande">Suivi de commande</option>
                                            <option value="partenariat">Partenariat</option>
                                            <option value="reclamation">Réclamation</option>
                                            <option value="autre">Autre chose</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-600 uppercase tracking-widest ml-1">Message</label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full bg-gray-950 border border-gray-800 p-5 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors font-bold resize-none"
                                            placeholder="Comment pouvons-nous vous aider ?"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-6 rounded-2xl font-black text-xl transition-all transform hover:scale-[1.01] shadow-xl shadow-yellow-400/10 flex items-center justify-center gap-3 group"
                                    >
                                        <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        Envoyer ma demande
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Socials & Networking */}
                <div className="bg-gray-900/20 border border-gray-800/50 p-12 rounded-[3.5rem] text-center space-y-8">
                    <h3 className="text-3xl font-black">Suivez l'aventure sur les réseaux</h3>
                    <div className="flex justify-center gap-6">
                        {settings?.instagram && (
                            <Link href={settings.instagram} target="_blank" className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 hover:border-yellow-400 transition-all duration-500 group">
                                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </Link>
                        )}
                        {settings?.facebook && (
                            <Link href={settings.facebook} target="_blank" className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-500 group">
                                <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </Link>
                        )}
                        {settings?.tiktok && (
                            <Link href={settings.tiktok} target="_blank" className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center hover:bg-black hover:text-white hover:border-white transition-all duration-500 group">
                                <Video className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}