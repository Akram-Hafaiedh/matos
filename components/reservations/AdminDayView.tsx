'use client';

import { useMemo } from 'react';
import {
    Clock,
    Users,
    User,
    ChevronRight,
    Table as TableIcon,
    AlertCircle,
    ChevronLeft,
    Calendar as CalendarIcon
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

interface AdminDayViewProps {
    reservations: Reservation[];
    onReservationSelect: (res: Reservation) => void;
    onDateSelect: (date: string) => void;
    selectedDate?: string | null;
}

export default function AdminDayView({ reservations, onReservationSelect, onDateSelect, selectedDate }: AdminDayViewProps) {
    const formatDateLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const focusDate = useMemo(() => {
        return selectedDate ? new Date(selectedDate) : new Date();
    }, [selectedDate]);

    const handlePrevDay = () => {
        const prev = new Date(focusDate);
        prev.setDate(prev.getDate() - 1);
        onDateSelect(formatDateLocal(prev));
    };

    const handleNextDay = () => {
        const next = new Date(focusDate);
        next.setDate(next.getDate() + 1);
        onDateSelect(formatDateLocal(next));
    };

    // 11:00 to 23:30 (standard service hours)
    const hours = Array.from({ length: 13 }, (_, i) => i + 11);

    const dayReservations = useMemo(() => {
        const dateStr = focusDate.toISOString().split('T')[0];
        return reservations.filter(res => res.reservation_date.startsWith(dateStr));
    }, [reservations, focusDate]);

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/[0.02] blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="flex items-center gap-5 font-black italic">
                    <div className="w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center border border-yellow-400/20 text-yellow-400">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-4xl text-white uppercase tracking-tighter">
                            {focusDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })} <span className="text-yellow-400">{focusDate.getFullYear()}</span>
                        </h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em]">Planning Journalier Tactique</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handlePrevDay}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all active:scale-95"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNextDay}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all active:scale-95"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="relative pt-6">
                {/* Hourly grid */}
                <div className="space-y-4">
                    {hours.map(hour => {
                        const slots = [`${hour.toString().padStart(2, '0')}:00`, `${hour.toString().padStart(2, '0')}:30`];
                        return slots.map(time => {
                            const resInSlot = dayReservations.filter(res => {
                                const date = new Date(res.reservation_date);
                                const h = date.getHours().toString().padStart(2, '0');
                                const m = date.getMinutes().toString().padStart(2, '0');
                                return `${h}:${m}` === time;
                            });

                            return (
                                <div key={time} className="flex gap-8 group">
                                    <div className="w-20 text-right pt-2">
                                        <span className="text-[10px] font-black text-gray-700 tracking-[0.2em] group-hover:text-yellow-400/50 transition-colors uppercase italic">{time}</span>
                                    </div>

                                    <div className="flex-1 min-h-[60px] relative border-l border-white/5 group-hover:border-yellow-400/20 transition-colors pl-8 pb-4">
                                        {resInSlot.length > 0 ? (
                                            <div className="space-y-3">
                                                {resInSlot.map(res => (
                                                    <button
                                                        key={res.id}
                                                        onClick={() => onReservationSelect(res)}
                                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-yellow-400/30 hover:bg-white/[0.04] transition-all text-left group/card flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div className={`w-3 h-3 rounded-full animate-pulse
                                                                ${res.status === 'confirmed' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                                                                    res.status === 'pending' ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                                                                        'bg-gray-700'}
                                                            `}></div>
                                                            <div>
                                                                <p className="text-sm font-[1000] text-white uppercase tracking-tighter italic group-hover/card:text-yellow-400 transition-colors uppercase">
                                                                    {res.customer_name}
                                                                </p>
                                                                <div className="flex items-center gap-4 text-gray-500 font-bold uppercase text-[9px] tracking-widest mt-1 italic">
                                                                    <Users size={10} className="text-yellow-400/50" />
                                                                    {res.party_size} PERS.
                                                                    {res.table_number && (
                                                                        <span className="text-green-500 ml-2">TABLE #{res.table_number}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={18} className="text-gray-800 group-hover/card:text-yellow-400 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-full border-t border-white/[0.01] mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            );
                        });
                    }).flat()}
                </div>
            </div>
        </div>
    );
}
