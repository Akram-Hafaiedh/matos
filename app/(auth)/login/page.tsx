// app/(auth)/login/page.tsx
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    
    // Default redirect for customers, admin dashboard for admins
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="w-full">
            {/* Logo/Header */}
            <div className="text-center mb-8">
                <div className="inline-block bg-yellow-400 rounded-full p-4 mb-4">
                    <Lock className="w-12 h-12 text-gray-900" />
                </div>
                <h1 className="text-4xl font-black text-white mb-2">
                    Connexion <span className="text-yellow-400">Mato's</span>
                </h1>
                <p className="text-gray-400">Connectez-vous à votre compte</p>
            </div>

            {/* Login Form */}
            <div className="bg-gray-800 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-600/20 border-2 border-red-600 rounded-lg p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-500 font-bold text-sm">{error}</p>
                        </div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className="block text-white font-bold mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="votre@email.com"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-white font-bold mb-2">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-4 rounded-xl font-black text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                                Connexion...
                            </span>
                        ) : (
                            'Se Connecter'
                        )}
                    </button>
                </form>

                {/* Registration Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        Pas de compte ?{' '}
                        <Link href="/register" className="text-yellow-400 hover:text-yellow-300 font-bold transition">
                            Créer un compte
                        </Link>
                    </p>
                </div>

                {/* Role Information */}
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">📋 Différents types de comptes:</p>
                    <ul className="text-white text-xs space-y-1">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Clients → Accès au site public</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Administrateurs → Accès au tableau de bord</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}