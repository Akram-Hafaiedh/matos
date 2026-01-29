// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, MapPin, AlertCircle, CheckCircle, ArrowRight, UserPlus } from 'lucide-react';
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

        // Basic validation
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
                    role: 'customer', // Default role for registration
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de l\'inscription');
            }

            setSuccess('Compte créé avec succès ! Redirection...');
            // Redirect to login after 2 seconds
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
        <div className="w-full relative">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none animate-pulse delay-700"></div>

            {/* Header */}
            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-950 rounded-[2rem] border-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5 mb-6 group hover:border-yellow-400/50 transition-colors duration-500">
                    <UserPlus className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter leading-none">
                    Rejoindre <span className="text-yellow-400 block mt-1">Mato's</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Devenez un client privilégié</p>
            </div>

            {/* Registration Form */}
            <div className="bg-gray-900/50 rounded-[3.5rem] p-10 border-2 border-gray-800 backdrop-blur-3xl shadow-3xl shadow-black relative z-10 hover:border-yellow-400/10 transition-colors duration-500">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-500 font-black text-[10px] uppercase tracking-wider">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <p className="text-green-500 font-black text-[10px] uppercase tracking-wider">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Nom complet *</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-700 text-sm"
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Email *</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-700 text-sm"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone & Map in Grid if needed, but let's keep it simple */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Téléphone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-700 text-sm"
                                        placeholder="XX XXX XXX"
                                    />
                                </div>
                            </div>
                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Adresse</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-700 text-sm"
                                        placeholder="Votre adresse"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Mot de passe *</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-700 text-sm"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Confirmation *</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-700 text-sm"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-yellow-400/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                                Traitement...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                S'inscrire maintenant
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 font-bold text-xs">
                        Déjà membre ?{' '}
                        <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-black uppercase tracking-wider underline underline-offset-4 decoration-yellow-400/20 hover:decoration-yellow-400 transition-all">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}