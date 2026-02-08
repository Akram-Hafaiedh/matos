'use client';

import { useState, useEffect, useRef } from 'react';
import {
    MapPin,
    Phone,
    Clock,
    Mail,
    Send,
    MessageCircle,
    LifeBuoy,
    ExternalLink,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { submitContactMessage } from '@/lib/actions/contact';
import { useToast } from '@/app/context/ToastContext';

export default function ContactContent() {
    const [settings, setSettings] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -30]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.subject && formData.message) {
            setLoading(true);
            try {
                const result = await submitContactMessage(formData);
                if (result.success) {
                    setSubmitted(true);
                    toast.success('Message envoyé avec succès');
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                } else {
                    toast.error('Erreur lors de l\'envoi du message');
                }
            } catch (error) {
                console.error("Contact submission failed", error);
                toast.error('Erreur de connexion');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                            <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.4em] italic">On reste en contact</span>
                        </motion.div>

                        <div className="relative group">
                            <div className="absolute -inset-16 bg-yellow-400/15 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative bg-yellow-400 py-8 px-12 md:px-20 -rotate-1 hover:rotate-0 transition-all duration-700 shadow-[20px_20px_0_rgba(0,0,0,1)] border-4 border-black overflow-hidden group">
                                <h1 className="text-5xl md:text-[9rem] font-[1000] italic uppercase tracking-tighter text-black leading-none inline-block relative z-10 pr-[0.4em]">
                                    Contact
                                </h1>
                            </div>
                        </div>

                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[11px] italic pt-8">
                            Une question ? Une suggestion ? <br /> L'équipe Mato's est à votre entière disposition.
                        </p>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-20 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-yellow-400 p-10 rounded-[3.5rem] text-black shadow-[0_30px_60px_rgba(250,204,21,0.15)] group relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="p-4 bg-black/10 rounded-2xl">
                                        <LifeBuoy className="w-8 h-8" />
                                    </div>
                                    <ShieldCheck className="w-6 h-6 opacity-40 hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-4">Support Prioritaire</h3>
                                <p className="font-bold text-black/70 mb-10 uppercase tracking-wide text-xs leading-relaxed">
                                    Nos membres bénéficient d'une assistance dédiée avec un suivi en temps réel.
                                </p>
                                <Link href="/support" className="flex items-center justify-between bg-black text-white p-6 rounded-2xl font-black transition hover:bg-white hover:text-black shadow-2xl group/btn">
                                    <span className="uppercase tracking-[0.2em] text-[10px]">Ouvrir un ticket</span>
                                    <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { icon: Phone, label: 'Téléphone', value: settings?.phone || 'Loading...', delay: 0.1 },
                                { icon: Mail, label: 'Email', value: 'hello@matos.tn', delay: 0.2 },
                                { icon: MapPin, label: 'Localisation', value: settings?.address || 'Loading...', delay: 0.3 }
                            ].map((info, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: info.delay + 0.3, duration: 0.6 }}
                                    className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] group hover:border-yellow-400/30 transition-all duration-500"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-500 transform group-hover:rotate-6">
                                            <info.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1 italic">{info.label}</p>
                                            <p className="text-lg font-[1000] uppercase tracking-tighter text-white italic">{info.value}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-[#0a0a0a] border border-white/5 p-12 md:p-16 rounded-[4rem] shadow-3xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/[0.02] blur-[100px] rounded-full pointer-events-none group-hover:bg-yellow-400/[0.04] transition-colors duration-1000"></div>

                            <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-12 flex items-center gap-6 relative z-10">
                                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-black">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                Envoyez un message
                            </h2>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-24 text-center space-y-8 relative z-10"
                                >
                                    <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                                        ✓
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-[1000] uppercase italic tracking-tighter">Message Envoyé !</h3>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] italic leading-relaxed max-w-sm mx-auto">
                                            Nous avons bien reçu votre demande et reviendrons vers vous dans les plus brefs délais.
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Nom Complet</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white uppercase tracking-widest text-xs"
                                                placeholder="votre nom"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white uppercase tracking-widest text-xs"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Sujet de votre demande</label>
                                        <div className="relative group/select">
                                            <select
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-[1000] text-white uppercase tracking-widest text-xs appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-[#0a0a0a]">Choisissez un sujet</option>
                                                <option value="commande" className="bg-[#0a0a0a]">Suivi de commande</option>
                                                <option value="partenariat" className="bg-[#0a0a0a]">Partenariat</option>
                                                <option value="reclamation" className="bg-[#0a0a0a]">Réclamation</option>
                                                <option value="autre" className="bg-[#0a0a0a]">Autre chose</option>
                                            </select>
                                            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 rotate-90 pointer-events-none transition-colors group-hover/select:text-yellow-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Votre Message</label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={6}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white uppercase tracking-widest text-xs resize-none"
                                            placeholder="Comment pouvons-nous vous aider ?"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-yellow-400 hover:bg-white text-black py-8 rounded-2xl font-[1000] uppercase text-xs tracking-[0.3em] transition-all transform hover:scale-[1.01] shadow-[0_20px_50px_rgba(250,204,21,0.15)] flex items-center justify-center gap-4 group/form-btn active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 group-hover/form-btn:translate-x-1 group-hover/form-btn:-translate-y-1 transition-transform" />
                                                <span>Envoyer ma demande</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
