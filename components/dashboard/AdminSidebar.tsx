// components/dashboard/AdminSidebar.tsx
'use client';

import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Menu as MenuIcon,
    X,
    Tag,
    Gift,
    LifeBuoy,
    Home
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    session: any;
    handleLogout: () => Promise<void>;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, session, handleLogout }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Commandes', href: '/dashboard/orders', icon: ShoppingBag },
        { name: 'Menu', href: '/dashboard/menu', icon: MenuIcon },
        { name: 'Catégories', href: '/dashboard/categories', icon: Tag },
        { name: 'Promotions', href: '/dashboard/promotions', icon: Gift },
        { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
        { name: 'Clients', href: '/dashboard/customers', icon: Users },
        { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gray-800 border-r-2 border-gray-700 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                {/* Logo & Public Link */}
                <div className="p-6 border-b-2 border-gray-700 space-y-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="text-2xl">🍕</span>
                            <h1 className="text-2xl font-black text-white">
                                <span className="text-yellow-400">Admin</span>
                            </h1>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black transition text-xs text-yellow-400 border-2 border-yellow-400/20 hover:border-yellow-400/50 hover:bg-yellow-400/5"
                    >
                        <Home className="w-4 h-4" />
                        Retour au site public
                    </button>

                    <div className="pt-2 border-t border-gray-700/50">
                        <p className="text-gray-400 text-xs font-bold line-clamp-1">
                            Connecté en tant que: <span className="text-white">{session?.user?.name}</span>
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    router.push(item.href);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black transition text-sm ${isActive
                                    ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/20'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-500'}`} />
                                {item.name}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-gray-700 bg-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-red-400 hover:bg-red-500/10 hover:text-red-500 transition text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
}
