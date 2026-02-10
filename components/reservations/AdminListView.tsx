'use client';

import { useMemo } from 'react';
import {
    Users,
    User,
    ChevronRight,
    Table as TableIcon,
    AlertCircle,
    Calendar,
    Phone,
    Mail,
    Clock
} from 'lucide-react';

interface Reservation {
    id: number;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    reservation_date: string;
    party_size: number;
    status: string;
    notes?: string;
    table_number?: number;
    created_at: string;
}

interface AdminListViewProps {
    reservations: Reservation[];
    onReservationSelect: (res: Reservation) => void;
}

export default function AdminListView({ reservations, onReservationSelect }: AdminListViewProps) {
    const sortedReservations = useMemo(() => {
        return [...reservations].sort((a, b) => new Date(a.reservation_date).getTime() - new Date(b.reservation_date).getTime());
    }, [reservations]);

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-3xl relative overflow-hidden">
            {/* Header section moved inside component for more control */}
            <div className="flex justify-between items-end border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400 border border-yellow-400/20">
                            <TableIcon size={20} />
                        </div>
                        <h3 className="text-4xl font-[1000] text-white uppercase tracking-tighter italic">Registre <span className="text-yellow-400">Tactique</span></h3>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em] italic">Total Ops: {reservations.length}</p>
                </div>
            </div>

            {reservations.length === 0 ? (
                <div className="py-40 text-center space-y-8 bg-white/[0.01] rounded-[3rem] border border-white/5 border-dashed">
                    <AlertCircle size={64} className="text-gray-800 mx-auto" />
                    <div className="space-y-2">
                        <h4 className="text-2xl font-[1000] text-white uppercase tracking-tighter italic">Base de Données Vide</h4>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 relative">
                    <div className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>

                    {sortedReservations.map((res) => {
                        const date = new Date(res.reservation_date);
                        const day = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
                        const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                        return (
                            <div key={res.id} className="flex gap-10 group">
                                <div className="w-24 text-right pt-4">
                                    <p className="text-sm font-black text-white/40 uppercase tracking-widest italic leading-none">{day}</p>
                                    <p className="text-xl font-[1000] text-white italic tracking-tighter group-hover:text-yellow-400 transition-colors uppercase mt-1">{time}</p>
                                </div>

                                <div className="relative">
                                    <div className={`w-4 h-4 rounded-full border-2 border-[#0a0a0a] z-10 relative mt-5 transition-transform group-hover:scale-125
                                        ${res.status === 'confirmed' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                                            res.status === 'pending' ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]' :
                                                'bg-gray-700'}
                                    `}></div>
                                </div>

                                <button
                                    onClick={() => onReservationSelect(res)}
                                    className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:border-yellow-400/30 hover:bg-white/[0.04] transition-all text-left group/card flex items-center justify-between"
                                >
                                    <div className="flex gap-10 items-center">
                                        <div className="space-y-1">
                                            <p className="text-xl font-[1000] text-white uppercase tracking-tighter italic group-hover/card:text-yellow-400 transition-colors uppercase">
                                                {res.customer_name}
                                            </p>
                                            <div className="flex items-center gap-4 text-gray-500 font-bold uppercase text-[9px] tracking-widest italic">
                                                <Phone size={10} className="text-yellow-400/50" />
                                                {res.customer_phone}
                                            </div>
                                        </div>

                                        <div className="hidden lg:flex gap-8">
                                            <div className="flex items-center gap-3 text-white font-black italic text-[10px] tracking-widest">
                                                <Users size={14} className="text-yellow-400" />
                                                {res.party_size} PERS.
                                            </div>
                                            {res.table_number && (
                                                <div className="flex items-center gap-3 text-green-500 font-black italic text-[10px] tracking-widest">
                                                    <TableIcon size={14} />
                                                    T#{res.table_number}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest italic border
                                            ${res.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                res.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
                                                    'bg-gray-800 text-gray-600 border-white/5'}
                                        `}>
                                            {res.status}
                                        </div>
                                        <ChevronRight size={20} className="text-gray-800 group-hover/card:text-yellow-400 transition-all" />
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
