'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import UserAvatar from './UserAvatar';
import { UserCircle, LayoutDashboard, LogOut, Loader2 } from 'lucide-react';
import { useConfirm } from '@/app/context/ConfirmContext';

export default function UserMenu() {
    const { data: session, status } = useSession();
    const confirm = useConfirm();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        const confirmed = await confirm({
            title: 'Déconnexion',
            message: 'Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour passer une commande ou consulter votre fidélité.',
            type: 'warning',
            confirmText: 'Me déconnecter',
            cancelText: 'Rester connecté'
        });

        if (confirmed) {
            setIsLoggingOut(true);
            await signOut({ callbackUrl: '/' });
        }
    };

    if (status !== 'authenticated') {
        return (
            <Link
                href="/login"
                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-black hover:bg-yellow-400 hover:text-gray-900 hover:border-yellow-400 transition transform hover:scale-105"
            >
                Connexion
            </Link>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-yellow-400/50 transition truncate max-w-[180px]"
            >
                <UserAvatar
                    image={session.user?.image}
                    name={session.user?.name}
                    size="sm"
                />
                <span className="text-sm font-bold text-white truncate">{session.user?.name}</span>
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-gray-900 border border-gray-800 rounded-3xl shadow-3xl z-20 overflow-hidden py-2 animate-slide-up">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800 mb-2">
                            <UserAvatar
                                image={session.user?.image}
                                name={session.user?.name}
                                size="md"
                                className="border border-white/10"
                            />
                            <div className="truncate">
                                <p className="text-white font-black truncate text-sm">{session.user?.name}</p>
                                <p className="text-gray-500 text-xs font-bold truncate">{session.user?.email}</p>
                            </div>
                        </div>

                        <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 transition font-bold text-sm">
                            <UserCircle className="w-4 h-4" /> Mon Compte
                        </Link>

                        {(session.user as any)?.role === 'admin' && (
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-yellow-400 hover:bg-yellow-400/10 transition font-black text-sm">
                                <LayoutDashboard className="w-4 h-4" /> Dashboard Admin
                            </Link>
                        )}

                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-400/10 transition font-bold text-sm mt-2 border-t border-gray-800 pt-4 disabled:opacity-50"
                        >
                            {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                            {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
