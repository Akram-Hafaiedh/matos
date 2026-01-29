'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    User,
    Package,
    Settings,
    LogOut,
    Clock,
    CheckCircle2,
    ChevronRight,
    Star,
    LifeBuoy,
    MapPin,
    Phone,
    ShieldCheck,
    AlertCircle,
    Loader2,
    Mail
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface Order {
    id: string;
    orderNumber: string;
    finalTotal: number;
    status: string;
    createdAt: string;
    cart: any[];
}

interface SupportTicket {
    id: number;
    subject: string;
    status: string;
    createdAt: string;
}

export default function AccountPage() {
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'orders' | 'loyalty' | 'support' | 'profile'>('orders');
    const [orders, setOrders] = useState<Order[]>([]);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // We ensure we fetch specifically the orders for the logged-in user
            // even though the API already enforces this check based on session
            const [ordersRes, ticketsRes, profileRes] = await Promise.all([
                fetch('/api/orders?limit=10'),
                fetch('/api/support'),
                fetch('/api/user/profile')
            ]);

            const [ordersData, ticketsData, profileData] = await Promise.all([
                ordersRes.json(),
                ticketsRes.json(),
                profileRes.json()
            ]);

            if (ordersData.success) setOrders(ordersData.orders);
            if (ticketsData.success) setTickets(ticketsData.tickets);
            if (profileData.success) setUserData(profileData.user);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Account Header */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-gray-900/40 p-10 rounded-[2.5rem] border border-gray-800 backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>

                    <div className="flex items-center gap-8 z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-yellow-500/20 transform group-hover:scale-105 transition-transform duration-500">
                            {userData?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight">{userData?.name || 'Utilisateur'}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-400">
                                <span className="flex items-center gap-2 text-sm bg-gray-950 px-3 py-1.5 rounded-full border border-gray-800">
                                    <ShieldCheck className="w-4 h-4 text-yellow-400" />
                                    {userData?.role === 'admin' ? 'Administrateur' : 'Client Privilège'}
                                </span>
                                <span className="flex items-center gap-2 text-sm bg-gray-950 px-3 py-1.5 rounded-full border border-gray-800">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    {userData?.loyaltyPoints || 0} Points Fidélité
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 z-10 w-full md:w-auto">
                        <button
                            onClick={() => signOut()}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-8 py-4 rounded-2xl border border-red-500/20 transition-all font-black duration-300"
                        >
                            <LogOut className="w-5 h-5" />
                            Déconnexion
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Navigation Sidebar */}
                    <div className="space-y-3">
                        {[
                            { id: 'orders', label: 'Mes Commandes', icon: Package },
                            { id: 'loyalty', label: 'Programme Fidélité', icon: Star },
                            { id: 'support', label: 'Mes Demandes', icon: LifeBuoy },
                            { id: 'profile', label: 'Mon Profil', icon: User }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 border ${activeTab === tab.id
                                    ? 'bg-yellow-400 border-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/10 translate-x-3'
                                    : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:bg-gray-800 hover:border-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500'}`} />
                                    <span className="font-black text-lg">{tab.label}</span>
                                </div>
                                <ChevronRight className={`w-5 h-5 ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-800'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 min-h-[500px]">
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                                    Historique des <span className="text-yellow-400">Commandes</span>
                                </h2>

                                {orders.length === 0 ? (
                                    <div className="text-center py-24 bg-gray-900/30 rounded-[2.5rem] border-2 border-dashed border-gray-800">
                                        <Package className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                                        <h3 className="text-2xl font-black text-white/50">Aucune commande encore</h3>
                                        <p className="text-gray-600 mt-2">Prêt à commander votre premier burger ?</p>
                                        <Link href="/menu" className="mt-8 inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-2xl font-black shadow-xl">
                                            Voir le Menu
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="bg-gray-900/60 p-6 md:p-8 rounded-[2rem] border border-gray-800 hover:border-yellow-400/30 transition-all duration-500 group">
                                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-yellow-400/10 text-yellow-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-yellow-400/20">
                                                                {order.orderNumber}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-gray-400 text-sm font-bold">
                                                                <Clock className="w-4 h-4" />
                                                                {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(order as any).cart?.map((item: any) => (
                                                                <span key={item.id} className="text-sm bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-800 text-white/80 font-bold">
                                                                    {item.quantity}x {item.itemName}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row md:flex-col justify-between md:items-end gap-2">
                                                        <div className="text-2xl font-black text-white">{order.finalTotal.toFixed(1)} DT</div>
                                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                            order.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                'bg-yellow-400/10 text-yellow-500 border-yellow-400/20'
                                                            }`}>
                                                            {order.status === 'delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                                                            {order.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'loyalty' && (
                            <div className="space-y-12">
                                <h2 className="text-3xl font-black mb-8">
                                    Programme <span className="text-yellow-400">Fidélité</span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-10 rounded-[3rem] text-gray-900 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                                        <Star className="absolute top-4 right-4 w-32 h-32 text-white/10 -mr-12 -mt-12 transform rotate-12" />
                                        <div>
                                            <div className="text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-80 underline underline-offset-4">Solde actuel</div>
                                            <div className="text-7xl font-black tracking-tighter">{userData?.loyaltyPoints || 0} <span className="text-2xl opacity-50">pts</span></div>
                                        </div>
                                        <div className="mt-12 space-y-4">
                                            <div className="w-full bg-black/10 rounded-full h-3">
                                                <div className="bg-white rounded-full h-full" style={{ width: `${Math.min((userData?.loyaltyPoints || 0) / 5, 100)}%` }}></div>
                                            </div>
                                            <p className="text-sm font-black text-black/60 italic">+{500 - ((userData?.loyaltyPoints || 0) % 500)} points avant votre prochain cadeau</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-900/60 p-10 rounded-[3rem] border border-gray-800 space-y-8">
                                        <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                                            Comment ça marche ?
                                        </h3>
                                        <ul className="space-y-6">
                                            <li className="flex gap-4">
                                                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-black text-gray-900 flex-shrink-0">1</div>
                                                <p className="text-gray-400 font-bold">Gagnez <span className="text-white">1 point pour chaque 1 DT</span> dépensé lors de vos commandes.</p>
                                            </li>
                                            <li className="flex gap-4">
                                                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-black text-gray-900 flex-shrink-0">2</div>
                                                <p className="text-gray-400 font-bold">Échangez vos points contre des <span className="text-white">réductions exclusives</span> ou des produits offerts.</p>
                                            </li>
                                            <li className="flex gap-4">
                                                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-black text-gray-900 flex-shrink-0">3</div>
                                                <p className="text-gray-400 font-bold">Profitez d'un accès anticipé aux <span className="text-white">nouvelles promotions</span>.</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'support' && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black">
                                        Support & <span className="text-yellow-400">Demandes</span>
                                    </h2>
                                    <Link href="/support" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-bold border border-gray-800 transition">
                                        Nouveau Ticket
                                    </Link>
                                </div>

                                {tickets.length === 0 ? (
                                    <div className="text-center py-24 bg-gray-900/30 rounded-[2.5rem] border-2 border-dashed border-gray-800">
                                        <LifeBuoy className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                                        <h3 className="text-2xl font-black text-white/50">Aucune demande en cours</h3>
                                        <p className="text-gray-600 mt-2">Nous sommes là si vous avez besoin d'aide.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {tickets.map((ticket) => (
                                            <div key={ticket.id} className="bg-gray-900/40 p-6 rounded-3xl border border-gray-800 hover:border-yellow-400/20 transition group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ticket.status === 'open' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                        }`}>
                                                        {ticket.status}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-600">
                                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="font-black text-white group-hover:text-yellow-400 transition mb-2">{ticket.subject}</h4>
                                                <p className="text-sm text-gray-500 font-bold flex items-center gap-2">
                                                    Ticket ID: #{ticket.id}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black mb-8">
                                    Mon <span className="text-yellow-400">Profil</span>
                                </h2>

                                <div className="bg-gray-900/60 p-10 rounded-[2.5rem] border border-gray-800 space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-2">
                                            <label className="text-gray-600 text-xs font-black uppercase tracking-widest block ml-1">Nom complet</label>
                                            <div className="flex items-center gap-4 bg-gray-950 p-5 rounded-2xl border border-gray-800">
                                                <User className="w-5 h-5 text-yellow-400" />
                                                <span className="font-black">{userData?.name || '-'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-gray-600 text-xs font-black uppercase tracking-widest block ml-1">Email</label>
                                            <div className="flex items-center gap-4 bg-gray-950 p-5 rounded-2xl border border-gray-800">
                                                <Mail className="w-5 h-5 text-yellow-400" />
                                                <span className="font-black">{userData?.email || '-'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-gray-600 text-xs font-black uppercase tracking-widest block ml-1">Téléphone</label>
                                            <div className="flex items-center gap-4 bg-gray-950 p-5 rounded-2xl border border-gray-800">
                                                <Phone className="w-5 h-5 text-yellow-400" />
                                                <span className="font-black">{userData?.phone || 'Non renseigné'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-gray-600 text-xs font-black uppercase tracking-widest block ml-1">Adresse de livraison par défaut</label>
                                            <div className="flex items-center gap-4 bg-gray-950 p-5 rounded-2xl border border-gray-800">
                                                <MapPin className="w-5 h-5 text-yellow-400" />
                                                <span className="font-black line-clamp-1">{userData?.address || 'Non renseignée'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-800 flex justify-between items-center">
                                        <p className="text-gray-500 text-xs font-bold">Membre depuis le {new Date(userData?.createdAt).toLocaleDateString()}</p>
                                        <Link href="/account/edit" className="flex items-center gap-2 text-yellow-400 font-black hover:text-yellow-300 transition uppercase text-sm tracking-widest">
                                            Modifier mes infos
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
