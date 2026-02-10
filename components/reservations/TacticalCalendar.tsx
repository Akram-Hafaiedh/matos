'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface TacticalCalendarProps {
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    variant?: 'card' | 'naked';
}

export default function TacticalCalendar({ value, onChange, variant = 'card' }: TacticalCalendarProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const date = new Date(year, month, 1);
        const days = [];

        // Add empty slots for days before the first of the month
        const firstDayOfWeek = (date.getDay() + 6) % 7; // Monday start
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [currentMonth]);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const isSelected = (date: Date) => {
        if (!value) return false;
        const [y, m, d] = value.split('-').map(Number);
        return date.getFullYear() === y && date.getMonth() === (m - 1) && date.getDate() === d;
    };

    const isToday = (date: Date) => {
        return date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
    };

    const isPast = (date: Date) => {
        return date < today;
    };

    const handleDateSelect = (date: Date) => {
        if (isPast(date)) return;
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        onChange(`${yyyy}-${mm}-${dd}`);
    };

    const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const isNaked = variant === 'naked';

    return (
        <div className={`
            select-none relative overflow-hidden group/cal w-full
            ${isNaked
                ? 'p-0 space-y-4'
                : 'bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-4 space-y-4 shadow-[0_30px_60px_rgba(0,0,0,0.9)]'
            }
        `}>
            {/* Tactical Decorations - Only in card mode */}
            {!isNaked && (
                <>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/[0.03] blur-2xl rounded-full pointer-events-none"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t border-r border-yellow-400/20 rounded-tr-xl"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b border-l border-yellow-400/20 rounded-bl-xl"></div>
                </>
            )}

            {/* Header */}
            <div className={`flex items-center justify-between relative z-10 gap-2 ${isNaked ? 'pb-2' : ''}`}>
                <div className="flex items-center gap-2.5 min-w-0">
                    {!isNaked && (
                        <div className="w-8 h-8 bg-yellow-400/5 rounded-lg flex-shrink-0 flex items-center justify-center border border-yellow-400/10 text-yellow-400">
                            <CalendarIcon size={14} />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className={`${isNaked ? 'text-sm' : 'text-xs'} font-[1000] uppercase italic tracking-tighter text-white leading-none mb-0.5 truncate`}>
                            {monthNames[currentMonth.getMonth()]} <span className="text-yellow-400">{currentMonth.getFullYear()}</span>
                        </h3>
                        {!isNaked && (
                            <div className="flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-yellow-400/50 animate-pulse"></div>
                                <span className="text-[6px] font-black text-gray-600 uppercase tracking-[0.3em] italic truncate">Mato's Uplink</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="w-7 h-7 rounded-md bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all active:scale-90"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="w-7 h-7 rounded-md bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all active:scale-90"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-4">
                {/* Week Days */}
                <div className="grid grid-cols-7 gap-1.5">
                    {weekDays.map((day, i) => (
                        <div key={i} className="text-[8px] font-black text-gray-800 text-center uppercase tracking-[0.2em] py-1 italic font-mono opacity-50">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Date Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentMonth.getTime()}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="col-span-7 grid grid-cols-7 gap-1"
                        >
                            {daysInMonth.map((date, i) => {
                                if (!date) return <div key={`empty-${i}`} className="aspect-square" />;

                                const selected = isSelected(date);
                                const current = isToday(date);
                                const disabled = isPast(date);

                                return (
                                    <button
                                        key={date.getTime()}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => handleDateSelect(date)}
                                        className={`
                                            aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all duration-300 group/day
                                            ${selected
                                                ? 'bg-yellow-400 text-black shadow-[0_5px_15px_rgba(250,204,21,0.2)] scale-105 z-10'
                                                : disabled
                                                    ? 'text-gray-800 cursor-not-allowed opacity-10'
                                                    : 'hover:bg-white/5 text-gray-600 hover:text-white border border-transparent hover:border-white/5'
                                            }
                                        `}
                                    >
                                        <span className={`text-[10px] sm:text-xs font-[1000] ${selected ? 'italic' : ''} tracking-tighter`}>
                                            {date.getDate()}
                                        </span>
                                        {current && !selected && (
                                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-yellow-400/40" />
                                        )}
                                        {selected && (
                                            <motion.div
                                                layoutId="cal-active-premium"
                                                className="absolute inset-0 border border-black/5 rounded-lg"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Legend */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex gap-2.5">
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/30"></div>
                        <span className="text-[6px] font-black text-gray-700 uppercase tracking-widest italic leading-none">Ready</span>
                    </div>
                </div>
                {value && (
                    <motion.div
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[7px] font-[1000] text-yellow-400 bg-yellow-400/5 px-2 py-0.5 rounded-md border border-yellow-400/10 uppercase tracking-[0.2em] italic whitespace-nowrap flex items-center gap-1.5"
                    >
                        <Sparkles size={6} className="animate-pulse" />
                        <span>{value.split('-').reverse().join(' . ')}</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
