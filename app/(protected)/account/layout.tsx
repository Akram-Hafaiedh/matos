'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';
import { getUserTier } from '@/lib/loyalty';
import {
    User,
    Package,
    Star,
    LifeBuoy,
    ShieldCheck,
    ChevronRight,
    Trophy,
    Settings,
    Lock,
    Bell,
    ShoppingBag
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/app/cart/CartContext';

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
        { id: 'notifications', label: 'Notifications', icon: Bell, href: '/account/notifications' },
        { id: 'tickets', label: 'Support', icon: LifeBuoy, href: '/account/tickets' },
        { id: 'security', label: 'Sécurité', icon: Lock, href: '/account/security' },
        { id: 'cart', label: 'Mon Panier', icon: ShoppingBag, href: '#', isCart: true },
    ];

    const { getTotalItems, setCartOpen } = useCart() as any;
    const totalItems = getTotalItems();

    const displayUser = {
        name: session?.user?.name || userData?.name,
        image: session?.user?.image || userData?.image,
        selectedBg: session?.user?.selectedBg || userData?.selectedBg,
        selectedFrame: session?.user?.selectedFrame || userData?.selectedFrame,
        loyaltyPoints: userData?.loyaltyPoints || 0,
        role: session?.user?.role || userData?.role,
        rank: userData?.rank
    };

    const currentTier = displayUser.loyaltyPoints !== undefined ? getUserTier(displayUser.loyaltyPoints) : null;

    if (!session) return null;

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Unified Header */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-gray-900/40 p-10 rounded-[3rem] border border-gray-800 backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>

                    <div className="flex items-center gap-8 z-10 w-full font-sans">
                        <UserAvatar
                            image={displayUser.image}
                            name={displayUser.name}
                            size="xl"
                            rank={displayUser.rank}
                            backgroundColor={displayUser.selectedBg}
                            className={`transform group-hover:scale-105 transition-transform duration-500 border-8 shadow-yellow-500/20 text-5xl flex-shrink-0 ${displayUser.selectedFrame || 'border-gray-900'}`}
                        />
                        <div className="space-y-3 flex-1">
                            <h1 className="text-4xl font-black tracking-tight uppercase italic">{displayUser.name || 'Utilisateur'}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-400">
                                <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-gray-950 px-4 py-2 rounded-full border border-gray-800 ${currentTier?.textColor}`}>
                                    {currentTier?.emoji}
                                    {currentTier?.name || 'Client Privilège'}
                                </span>
                                {displayUser.role === 'admin' && (
                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-gray-950 px-4 py-2 rounded-full border border-gray-800">
                                        <ShieldCheck className="w-3 h-3 text-yellow-400" />
                                        Admin
                                    </span>
                                )}
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-gray-950 px-4 py-2 rounded-full border border-gray-800">
                                    <Trophy className="w-3 h-3 text-yellow-400" />
                                    #{displayUser.rank || '-'}
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-gray-950 px-4 py-2 rounded-full border border-gray-800">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    {displayUser.loyaltyPoints} Points
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Persistent Navigation Sidebar */}
                    <div className="space-y-3">
                        {navItems.map((item) => {
                            const isActive = item.href === '/account/profile'
                                ? (pathname === '/account/profile' || pathname === '/account/edit')
                                : (item.href !== '#' && pathname.startsWith(item.href));

                            const handleClick = (e: React.MouseEvent) => {
                                if ((item as any).isCart) {
                                    e.preventDefault();
                                    setCartOpen(true);
                                }
                            };

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={handleClick}
                                    className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all duration-300 border ${isActive
                                        ? 'bg-yellow-400 border-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/10 translate-x-4'
                                        : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:bg-gray-800 hover:border-gray-700 hover:translate-x-2'
                                        } ${(item as any).isCart && totalItems > 0 ? 'border-yellow-400/30' : ''}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <item.icon className={`w-6 h-6 ${isActive ? 'text-gray-900' : (item as any).isCart && totalItems > 0 ? 'text-yellow-400' : 'text-gray-600'}`} />
                                            {(item as any).isCart && totalItems > 0 && (
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center text-[10px] font-black border border-gray-900">
                                                    {totalItems}
                                                </span>
                                            )}
                                        </div>
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
