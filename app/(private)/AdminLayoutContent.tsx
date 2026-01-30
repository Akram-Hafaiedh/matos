// app/(private)/AdminLayoutContent.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import NotificationsDropdown from '@/components/NotificationsDropdown';

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Redirect if not authenticated or not admin
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    // Show loading state
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white">Chargement...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated or not admin
    if (status !== 'authenticated' || (session?.user as any)?.role !== 'admin') {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-900 overflow-hidden">
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                session={session}
                handleLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-64 relative">
                {/* Global Header */}
                <header className="bg-gray-800/80 backdrop-blur-xl border-b-2 border-gray-700/50 p-4 sticky top-0 z-30 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-white hover:text-yellow-400 transition"
                            >
                                <MenuIcon className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">
                                Mato's <span className="text-yellow-400">Admin</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <NotificationsDropdown />

                            {/* User Dropdown */}
                            <div className="relative group/menu">
                                <button className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-yellow-400/50 rounded-2xl p-2 pr-4 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10">
                                    <div className="w-8 h-8 bg-yellow-400 rounded-xl flex items-center justify-center text-gray-900 font-black uppercase text-sm">
                                        {(session?.user?.name?.[0] || 'A').toUpperCase()}
                                    </div>
                                    <div className="text-left hidden md:block">
                                        <p className="text-xs font-black text-white uppercase tracking-wider">{session?.user?.name}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Admin</p>
                                    </div>
                                </button>

                                <div className="absolute right-0 mt-2 w-48 bg-gray-950 border border-gray-800 rounded-2xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 transform origin-top-right overflow-hidden">
                                    <button
                                        onClick={() => router.push('/dashboard/account')}
                                        className="w-full text-left px-5 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition uppercase tracking-wider flex items-center gap-2"
                                    >
                                        ⚙️ Mon Compte
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-5 py-3 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition uppercase tracking-wider flex items-center gap-2 border-t border-gray-900"
                                    >
                                        🚪 Déconnexion
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content - This sub-container will now handle its own scroll independently if needed */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
