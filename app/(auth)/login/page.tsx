// app/(auth)/login/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            const userRole = (session.user as any).role;
            if (callbackUrl && callbackUrl !== '/') {
                router.push(callbackUrl);
            } else if (userRole === 'admin' || userRole === 'super_admin') {
                router.push('/dashboard/orders');
            } else {
                router.push('/account');
            }
        }
    }, [session, status, router, callbackUrl]);

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
                router.push(result?.url || callbackUrl);
                router.refresh();
            }
        } catch (error) {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-black overflow-hidden selection:bg-yellow-400 selection:text-black">

            {/* Visual Side (50%) */}
            <div className="lg:flex-1 relative overflow-hidden hidden lg:block">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
                        alt="Mato's Signature Cuisine"
                        className="w-full h-full object-cover opacity-60 grayscale-[20%]"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black"></div>

                {/* Visual Content Overlay */}
                <div className="absolute bottom-16 left-16 space-y-8 max-w-xl z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 bg-yellow-400 px-5 py-2 -rotate-3 rounded-sm shadow-2xl"
                    >
                        <Sparkles className="w-4 h-4 text-black" />
                        <span className="text-[11px] font-[1000] uppercase tracking-[0.3em] text-black">Excellence Mato's</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-7xl xl:text-8xl font-[1000] italic text-white uppercase tracking-tighter leading-none"
                    >
                        L'EXPÉRIENCE<br />
                        <span className="text-yellow-400 text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600">SIGNATURE.</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-white"
                    >
                        <span>Authenticité</span>
                        <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                        <span>Passion</span>
                        <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                        <span>Prestige</span>
                    </motion.div>
                </div>

                {/* Ambient Light */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-yellow-400/5 blur-[120px] rounded-full"></div>
            </div>

            {/* Form Side (50% or full on mobile) */}
            <div className="w-full lg:w-[550px] min-h-screen bg-black relative flex flex-col items-center justify-center p-8 lg:p-20 border-l border-white/5">

                {/* Mobile/Global Header */}
                <div className="absolute top-10 left-10 lg:left-20">
                    <Link href="/" className="group flex items-center gap-3 text-gray-600 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.3em] italic">
                        <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-yellow-400/50 group-hover:text-yellow-400 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Accueil</span>
                    </Link>
                </div>

                <div className="w-full max-w-sm space-y-12">

                    {/* Header */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 bg-yellow-400 flex items-center justify-center rounded-2xl rotate-6 shadow-2xl shadow-yellow-400/20"
                        >
                            <KeyRound className="w-8 h-8 text-black" />
                        </motion.div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-[1000] italic text-white uppercase tracking-tighter">Connexion</h1>
                            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500">Maison Mato's — Accès Membre</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3"
                            >
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <p className="text-red-500 font-black text-[10px] uppercase tracking-wider italic">{error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-gray-500 font-black uppercase text-[9px] tracking-[0.3em] ml-2 italic">Identifiant Email</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-yellow-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-16 pr-6 py-5 rounded-2xl font-bold transition-all outline-none focus:bg-white/[0.07] focus:border-yellow-400/30 placeholder:text-gray-800 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                                        placeholder="votre@email.com"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-gray-500 font-black uppercase text-[9px] tracking-[0.3em] italic">Code Secret</label>
                                    <Link href="/forgot-password" title="Mot de passe oublié" className="text-gray-700 hover:text-yellow-400 font-black uppercase text-[9px] tracking-widest transition-colors italic">Perdu ?</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-yellow-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-16 pr-14 py-5 rounded-2xl font-bold transition-all outline-none focus:bg-white/[0.07] focus:border-yellow-400/30 placeholder:text-gray-800 placeholder:uppercase"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 hover:text-yellow-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-400 hover:bg-white text-black py-6 rounded-2xl font-[1000] text-[11px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_40px_rgba(250,204,21,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                                        <span className="italic">Traitement...</span>
                                    </>
                                ) : (
                                    <>
                                        Entrer dans le Club
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </span>
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/btn:animate-shimmer"></div>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-8 border-t border-white/5">
                        <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest italic leading-relaxed">
                            Pas encore parmi nous ?<br />
                            <Link href="/register" className="text-yellow-400 hover:text-white transition-all font-black uppercase tracking-[0.2em] mt-3 inline-block underline decoration-yellow-400/20 underline-offset-8">
                                Créer un accès privilégié
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
