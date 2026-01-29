// app/(auth)/login/page.tsx
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, AlertCircle, ArrowRight, User, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    // Default redirect for customers, admin dashboard for admins
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            // Check user role for appropriate redirect
            const userRole = (session.user as any).role;
            if (userRole === 'admin' || userRole === 'super_admin') {
                router.push('/dashboard/orders');
            } else {
                router.push('/');
            }
        }
    }, [session, status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                setError('Email ou mot de passe incorrect');
            } else {
                // NextAuth will handle the redirect based on your callback configuration
                router.push(result?.url || callbackUrl);
                router.refresh();
            }
        } catch (error) {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking session
    if (status === 'loading') {
        return (
            <div className="w-full flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full relative">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none animate-pulse delay-700"></div>

            {/* Logo/Header */}
            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-950 rounded-[2rem] border-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5 mb-6 group hover:border-yellow-400/50 transition-colors duration-500">
                    <KeyRound className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter leading-none">
                    Connexion <span className="text-yellow-400 block mt-1">Mato's</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Accès membre privilégié</p>
            </div>

            {/* Login Form */}
            <div className="bg-gray-900/50 rounded-[3rem] p-10 border-2 border-gray-800 backdrop-blur-3xl shadow-3xl shadow-black relative z-10 hover:border-yellow-400/10 transition-colors duration-500">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-500 font-black text-xs uppercase tracking-wider">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-700"
                                    placeholder="votre@email.com"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-4 pr-4">
                                <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Mot de passe</label>
                                <Link href="/forgot-password" title="Mot de passe oublié" className="text-gray-600 hover:text-yellow-400 font-black uppercase text-[10px] tracking-widest transition-colors">Oublié ?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-14 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-700"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
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
                                Se Connecter
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </form>

                {/* Registration Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 font-bold text-xs">
                        Pas encore de compte ?{' '}
                        <Link href="/register" className="text-yellow-400 hover:text-yellow-300 font-black uppercase tracking-wider underline underline-offset-4 decoration-yellow-400/20 hover:decoration-yellow-400 transition-all">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}