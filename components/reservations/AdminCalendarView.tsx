'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Users,
    Clock,
    Sparkles,
    CheckCircle,
    XCircle,
    AlertCircle
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

interface AdminCalendarViewProps {
    reservations: Reservation[];
    onDateSelect: (date: string) => void;
    onReservationSelect: (res: Reservation) => void;
    onClose?: () => void;
}

export default function AdminCalendarView({ reservations, onDateSelect, onReservationSelect }: AdminCalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [focusedDate, setFocusedDate] = useState<Date | null>(null);

    const daysInMonth = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days = [];

        // Padding for start of week (Monday start)
        const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }, [currentMonth]);

    const formatDateLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getReservationsForDate = (date: Date) => {
        const dateString = formatDateLocal(date);
        return reservations.filter(res => res.reservation_date.startsWith(dateString));
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        setFocusedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        setFocusedDate(null);
    };

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 space-y-8 shadow-3xl overflow-hidden relative group">
            {/* Daily Perspective Side Panel */}
            <AnimatePresence>
                {focusedDate && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setFocusedDate(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 right-0 bottom-0 w-full md:w-[400px] bg-[#0a0a0a] border-l border-white/10 z-30 p-10 flex flex-col shadow-[-50px_0_100px_rgba(0,0,0,0.9)]"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-[1000] text-yellow-400 uppercase tracking-tighter italic">Mission Logs</h3>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">
                                        {focusedDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setFocusedDate(null)}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6">
                                {getReservationsForDate(focusedDate).length === 0 ? (
                                    <div className="py-20 text-center space-y-4">
                                        <AlertCircle size={48} className="text-gray-800 mx-auto" />
                                        <p className="text-gray-700 font-bold uppercase tracking-widest text-xs italic">Pas d'activité détectée</p>
                                    </div>
                                ) : (
                                    getReservationsForDate(focusedDate).map(res => (
                                        <button
                                            key={res.id}
                                            onClick={() => onReservationSelect(res)}
                                            className="w-full text-left bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:border-yellow-400/30 hover:bg-white/[0.04] transition-all group/item relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="space-y-1">
                                                    <p className="text-lg font-[1000] text-white uppercase tracking-tighter italic group-hover/item:text-yellow-400 transition-colors uppercase">
                                                        {res.customer_name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-yellow-400/50">
                                                        <Clock size={12} />
                                                        <span className="text-[10px] font-bold tracking-widest uppercase">
                                                            {new Date(res.reservation_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest italic
                                                    ${res.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                        res.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                                                            'bg-gray-800 text-gray-400'}
                                                `}>
                                                    {res.status}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black italic tracking-widest">
                                                    <Users size={12} className="text-yellow-400" />
                                                    {res.party_size} PERS.
                                                </div>
                                                <div className="text-[10px] text-gray-700 font-black uppercase tracking-widest group-hover/item:text-yellow-400/50 transition-colors italic flex items-center gap-2">
                                                    Inspect Log <Sparkles size={10} />
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5">
                                <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.5em] italic leading-relaxed">
                                    Mato's Integrated Support Vector • Tactical Reservation Management Protocol
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/[0.02] blur-[100px] rounded-full pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="flex items-center gap-5 font-black italic">
                    <div className="w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center border border-yellow-400/20 text-yellow-400 shadow-[inset_0_0_20px_rgba(250,204,21,0.1)]">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-4xl text-white uppercase tracking-tighter">
                            {monthNames[currentMonth.getMonth()]} <span className="text-yellow-400">{currentMonth.getFullYear()}</span>
                        </h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em]">Tactical Reservation Ledger • v2.0</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handlePrevMonth}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all active:scale-95"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all active:scale-95"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-4">
                {/* Weekdays */}
                {weekDays.map(day => (
                    <div key={day} className="text-center py-4 text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] italic border-b border-white/5 mb-4">
                        {day}
                    </div>
                ))}

                {/* Days */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentMonth.getTime()}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="col-span-7 grid grid-cols-7 gap-4"
                    >
                        {daysInMonth.map((date, i) => {
                            if (!date) return <div key={`empty-${i}`} className="min-h-[160px]" />;

                            const dayReservations = getReservationsForDate(date);
                            const isToday = new Date().toDateString() === date.toDateString();

                            return (
                                <button
                                    key={date.getTime()}
                                    onClick={() => {
                                        setFocusedDate(date);
                                        onDateSelect(formatDateLocal(date));
                                    }}
                                    className={`
                                        min-h-[160px] p-5 rounded-3xl border transition-all duration-500 text-left flex flex-col justify-between group/day relative overflow-hidden
                                        ${isToday
                                            ? 'bg-yellow-400/10 border-yellow-400/40'
                                            : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                                        }
                                    `}
                                >
                                    <div className="relative z-10 flex justify-between items-start">
                                        <span className={`text-2xl font-[1000] italic ${isToday ? 'text-yellow-400' : 'text-white/40 group-hover/day:text-white transition-colors'}`}>
                                            {date.getDate()}
                                        </span>
                                        {dayReservations.length > 0 && (
                                            <div className="px-3 py-1 bg-yellow-400 text-black text-[10px] font-black rounded-lg uppercase tracking-widest italic shadow-xl">
                                                {dayReservations.length} FLUX
                                            </div>
                                        )}
                                    </div>

                                    {dayReservations.length > 0 ? (
                                        <div className="relative z-10 space-y-3 mt-4">
                                            <div className="flex -space-x-2">
                                                {dayReservations.slice(0, 4).map((res, i) => (
                                                    <div
                                                        key={res.id}
                                                        className={`w-7 h-7 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-[8px] font-black z-[${4 - i}]
                                                            ${res.status === 'confirmed' ? 'bg-green-500 text-white' :
                                                                res.status === 'pending' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}
                                                        `}
                                                    >
                                                        {res.customer_name[0].toUpperCase()}
                                                    </div>
                                                ))}
                                                {dayReservations.length > 4 && (
                                                    <div className="w-7 h-7 rounded-full border-2 border-[#0a0a0a] bg-white/5 text-[8px] font-black flex items-center justify-center text-gray-400">
                                                        +{dayReservations.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest italic">
                                                <Users size={12} className="text-yellow-400" />
                                                {dayReservations.reduce((acc, curr) => acc + curr.party_size, 0)} Pers.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4 opacity-0 group-hover/day:opacity-50 transition-opacity">
                                            <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest italic leading-none">Matrix Empty</p>
                                        </div>
                                    )}

                                    {/* Decoration */}
                                    {isToday && (
                                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-yellow-400/20 blur-2xl rounded-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="pt-8 border-t border-white/5 flex items-center justify-between gap-10">
                <div className="flex gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Pending</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Confirmed</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Others</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <Clock size={14} className="text-yellow-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Real-time Matrix Synchronization Enabled</span>
                </div>
            </div>
        </div>
    );
}
