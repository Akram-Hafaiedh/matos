// app/(private)/AdminLayoutContent.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';

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
        <div className="min-h-screen bg-gray-900">
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                session={session}
                handleLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Header (Mobile) */}
                <header className="lg:hidden bg-gray-800 border-b-2 border-gray-700 p-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-white hover:text-yellow-400 transition"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-black text-white">
                            🍕 <span className="text-yellow-400">Admin</span>
                        </h1>
                        <div className="w-6" /> {/* Spacer */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
