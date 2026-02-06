// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, AlertCircle, CheckCircle, ArrowRight, UserPlus, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    password: formData.password,
                    role: 'customer',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de l\'inscription');
            }

            setSuccess('Compte créé avec succès ! Bienvenue au Club.');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-black overflow-hidden selection:bg-yellow-400 selection:text-black">

            {/* Visual Side (50%) */}
            <div className="lg:flex-1 relative overflow-hidden hidden lg:block">
                <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop"
                        alt="Mato's Maison"
                        className="w-full h-full object-cover opacity-60 grayscale-[10%]"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black"></div>

                {/* Branding Overlay */}
                <div className="absolute bottom-16 left-16 space-y-6 z-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white text-black px-6 py-2 font-black text-[12px] uppercase tracking-[0.4em] -rotate-2 inline-block shadow-2xl"
                    >
                        Rejoindre le Prestige
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-7xl xl:text-9xl font-[1000] italic text-white uppercase tracking-tighter leading-[0.85]"
                    >
                        DEVENIR<br />
                        <span className="text-yellow-400">MEMBRE.</span>
                    </motion.h1>
                </div>

                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/5 blur-[150px] rounded-full"></div>
            </div>

            {/* Form Side (50%) */}
            <div className="w-full lg:w-[650px] min-h-screen bg-black relative flex flex-col items-center justify-center p-8 lg:p-16 border-l border-white/5 overflow-y-auto">

                {/* Back Button */}
                <div className="absolute top-10 left-10 lg:left-16">
                    <Link href="/" className="group flex items-center gap-3 text-gray-600 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.3em] italic">
                        <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-yellow-400/50 group-hover:text-yellow-400 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Accueil</span>
                    </Link>
                </div>

                <div className="w-full max-w-lg space-y-12">

                    <div className="space-y-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-14 h-14 bg-yellow-400 flex items-center justify-center rounded-2xl -rotate-6"
                        >
                            <UserPlus className="w-7 h-7 text-black" />
                        </motion.div>
                        <div className="space-y-1">
                            <h2 className="text-4xl font-[1000] italic text-white uppercase tracking-tighter">Inscription Elite</h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Maison Mato's — Accès Privilégié</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3"
                            >
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <p className="text-red-500 font-bold text-[10px] uppercase tracking-widest">{error}</p>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3"
                            >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <p className="text-green-500 font-bold text-[10px] uppercase tracking-widest">{success}</p>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Identity */}
                            <div className="space-y-2 col-span-2">
                                <label className="text-gray-500 font-black uppercase text-[9px] tracking-[0.3em] ml-2 italic">Identité Complète</label>
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-yellow-400 transition-colors w-4 h-4" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-16 pr-6 py-4 rounded-xl font-bold transition-all outline-none focus:bg-white/[0.07] focus:border-yellow-400/30 placeholder:text-gray-800 uppercase text-xs"
                                        placeholder="VOTRE NOM"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2 col-span-2">
                                <label className="text-gray-500 font-black uppercase text-[9px] tracking-[0.3em] ml-2 italic">Contact Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-yellow-400 transition-colors w-4 h-4" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-16 pr-6 py-4 rounded-xl font-bold transition-all outline-none focus:bg-white/[0.07] focus:border-yellow-400/30 placeholder:text-gray-800 uppercase text-xs font-sans"
                                        placeholder="VOTRE@EMAIL.COM"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-gray-500 font-black uppercase text-[9px] tracking-[0.3em] ml-2 italic">Téléphone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-yellow-400 transition-colors w-4 h-4" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-16 pr-6 py-4 rounded-xl font-bold transition-all outline-none focus:bg-white/[0.07] focus:border-yellow-400/30 placeholder:text-gray-800 text-xs font-sans"
                                        placeholder="0X XX XX XX"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-gray-500 font-black uppercase text-[9px] tracking-[0.3em] ml-2 italic">Localisation</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-yellow-400 transition-colors w-4 h-4" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-16 pr-6 py-4 rounded-xl font-bold transition-all outline-none focus:bg-white/[0.07] focus:border-yellow-400/30 placeholder:text-gray-800 uppercase text-xs"
                                        placeholder="VOTRE VILLE"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-gray-500 font-black uppercase text-[9px] tracking-[0.3em] ml-2 italic">Code Secret</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-yellow-400 transition-colors w-4 h-4" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-16 pr-12 py-4 rounded-xl font-bold transition-all outline-none focus:bg-white/[0.07] focus:border-yellow-400/30 placeholder:text-gray-800 text-xs font-sans"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-white transition-colors">
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm */}
                            <div className="space-y-2">
                                <label className="text-gray-500 font-black uppercase text-[9px] tracking-[0.3em] ml-2 italic">Confirmation</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-yellow-400 transition-colors w-4 h-4" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-16 pr-12 py-4 rounded-xl font-bold transition-all outline-none focus:bg-white/[0.07] focus:border-yellow-400/30 placeholder:text-gray-800 text-xs font-sans"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-white transition-colors">
                                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-400 hover:bg-white text-black py-6 rounded-2xl font-[1000] text-[11px] uppercase tracking-[0.4em] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden mt-4"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? 'TRAITEMENT...' : 'REJOINDRE LE CLUB'}
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/btn:animate-shimmer"></div>
                        </button>
                    </form>

                    <div className="text-center pt-8 border-t border-white/5">
                        <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest italic">
                            Déjà membre ? <Link href="/login" className="text-white hover:text-yellow-400 transition-colors ml-2 underline underline-offset-4 decoration-white/20">Se connecter</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
