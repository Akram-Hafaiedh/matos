'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    User,
    Package,
    Star,
    LifeBuoy,
    ShieldCheck,
    ChevronRight,
    Settings,
    Lock
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/user/profile')
            .then(res => res.json())
            .then(data => {
                if (data.success) setUserData(data.user);
            });
    }, []);

    const navItems = [
        { id: 'profile', label: 'Mon Profil', icon: User, href: '/account/profile' },
        { id: 'orders', label: 'Mes Commandes', icon: Package, href: '/account/orders' },
        { id: 'loyalty', label: 'Fidélité', icon: Star, href: '/account/loyalty' },
        { id: 'tickets', label: 'Support', icon: LifeBuoy, href: '/account/tickets' },
        { id: 'security', label: 'Sécurité', icon: Lock, href: '/account/security' },
    ];

    if (!session) return null;

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Unified Header */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-gray-900/40 p-10 rounded-[3rem] border border-gray-800 backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>

                    <div className="flex items-center gap-8 z-10 w-full font-sans">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl shadow-yellow-500/20 transform group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
                            {userData?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="space-y-2 flex-1">
                            <h1 className="text-4xl font-black tracking-tight uppercase italic">{userData?.name || 'Utilisateur'}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-400">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-gray-950 px-4 py-2 rounded-full border border-gray-800">
                                    <ShieldCheck className="w-3 h-3 text-yellow-400" />
                                    {userData?.role === 'admin' ? 'Administrateur' : 'Client Privilège'}
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-gray-950 px-4 py-2 rounded-full border border-gray-800">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    {userData?.loyaltyPoints || 0} Points
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Persistent Navigation Sidebar */}
                    <div className="space-y-3">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all duration-300 border ${isActive
                                            ? 'bg-yellow-400 border-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/10 translate-x-4'
                                            : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:bg-gray-800 hover:border-gray-700 hover:translate-x-2'
                                        }`}
                                >
                                    <div className="flex items-center gap-5">
                                        <item.icon className={`w-6 h-6 ${isActive ? 'text-gray-900' : 'text-gray-600'}`} />
                                        <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-800'}`} />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="lg:col-span-3 min-h-[500px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
