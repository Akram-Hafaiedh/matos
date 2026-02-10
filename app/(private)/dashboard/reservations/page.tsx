// app/(private)/dashboard/reservations/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw,
    Users,
    ChevronRight,
    Hash,
    Phone,
    MessageSquare,
    Loader2,
    User,
    Mail,
    Filter,
    Table as TableIcon,
    LayoutGrid,
    List as ListIcon,
    CalendarDays
} from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import ConfirmModal from '@/components/ConfirmModal';
import SideDrawer from '@/components/SideDrawer';
import AdminCalendarView from '@/components/reservations/AdminCalendarView';
import AdminListView from '@/components/reservations/AdminListView';
import AdminDayView from '@/components/reservations/AdminDayView';

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
    user_id?: string;
    users?: {
        name: string;
        email: string;
    }
}

export default function AdminReservationsPage() {
    const { toast } = useToast();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [lastFetch, setLastFetch] = useState<Date>(new Date());
    const [tableInput, setTableInput] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar' | 'day'>('grid');
    const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

    const fetchReservations = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const url = filterStatus === 'all'
                ? '/api/reservations'
                : `/api/reservations?status=${filterStatus}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setReservations(data.reservations);
                setLastFetch(new Date());
                if (selectedReservation) {
                    const updated = data.reservations.find((r: Reservation) => r.id === selectedReservation.id);
                    if (updated) setSelectedReservation(updated);
                }
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
            toast.error('Erreur lors de la récupération des réservations');
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [filterStatus]);

    // Polling
    useEffect(() => {
        const interval = setInterval(() => {
            fetchReservations(true);
        }, 15000);
        return () => clearInterval(interval);
    }, [filterStatus]);

    const updateStatus = async (id: number, status: string, additionalData = {}) => {
        try {
            const response = await fetch(`/api/reservations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, ...additionalData })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Réservation mise à jour');
                fetchReservations(true);
                if (status === 'confirmed') setTableInput('');
            } else {
                toast.error(data.error || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Erreur de connexion');
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: Clock, label: 'En attente' };
            case 'confirmed': return { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle, label: 'Confirmée' };
            case 'completed': return { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: Hash, label: 'Terminée' };
            case 'cancelled': return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle, label: 'Annulée' };
            default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: Calendar, label: status };
        }
    };

    return (
        <div className="w-full pb-20 animate-in fade-in duration-700">
            <SideDrawer
                isOpen={!!selectedReservation}
                onClose={() => setSelectedReservation(null)}
                title={selectedReservation ? (
                    <>RESERVATION <span className="text-yellow-400">#{selectedReservation.id}</span></>
                ) : ''}
                footer={selectedReservation && (
                    <div className="space-y-4">
                        {selectedReservation.status === 'pending' && (
                            <div className="flex flex-col gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Assigner une Table (Optionnel)</label>
                                    <input
                                        type="number"
                                        placeholder="Numéro de table"
                                        value={tableInput}
                                        onChange={(e) => setTableInput(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-yellow-400/50 focus:outline-none transition-all font-bold text-white uppercase tracking-widest text-xs"
                                    />
                                </div>
                                <button
                                    onClick={() => updateStatus(selectedReservation.id, 'confirmed', { table_number: tableInput || undefined })}
                                    className="w-full bg-yellow-400 text-black py-6 rounded-[2rem] font-[1000] uppercase text-xs tracking-[0.3em] italic shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Confirmer la Réservation
                                </button>
                            </div>
                        )}
                        {selectedReservation.status === 'confirmed' && (
                            <button
                                onClick={() => updateStatus(selectedReservation.id, 'completed')}
                                className="w-full bg-green-500 text-white py-6 rounded-[2rem] font-[1000] uppercase text-xs tracking-[0.3em] italic shadow-2xl hover:scale-105 active:scale-95 transition-all"
                            >
                                Marquer comme Complétée
                            </button>
                        )}
                        {selectedReservation.status !== 'cancelled' && (
                            <button
                                onClick={() => updateStatus(selectedReservation.id, 'cancelled')}
                                className="w-full bg-white/[0.03] hover:bg-red-500/10 text-gray-600 hover:text-red-500 border border-white/5 hover:border-red-500/20 py-4 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.4em] italic transition-all"
                            >
                                Annuler la Réservation
                            </button>
                        )}
                    </div>
                )}
            >
                {selectedReservation && (
                    <div className="space-y-10">
                        {/* Customer Details */}
                        <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-3xl font-[1000] text-white uppercase tracking-tighter italic">{selectedReservation.customer_name}</p>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <Phone size={14} className="text-yellow-400" />
                                            <p className="font-black text-xs tracking-widest">{selectedReservation.customer_phone}</p>
                                        </div>
                                        {selectedReservation.customer_email && (
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <Mail size={14} className="text-yellow-400" />
                                                <p className="font-black text-xs tracking-widest">{selectedReservation.customer_email}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                                    <User size={32} />
                                </div>
                            </div>
                        </section>

                        {/* Booking Matrix */}
                        <section className="grid grid-cols-2 gap-6 pb-2">
                            <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] space-y-2">
                                <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] italic">Date & Heure</p>
                                <div className="flex items-center gap-3 text-white font-[1000] italic text-xs tracking-widest whitespace-nowrap">
                                    <Calendar size={14} className="text-yellow-400" />
                                    {new Date(selectedReservation.reservation_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                    <span className="text-yellow-400">@</span>
                                    {new Date(selectedReservation.reservation_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] space-y-2">
                                <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] italic">Taille de Table</p>
                                <div className="flex items-center gap-3 text-white font-[1000] italic text-xs tracking-widest">
                                    <Users size={14} className="text-yellow-400" />
                                    {selectedReservation.party_size} PERSONNES
                                </div>
                            </div>
                        </section>

                        {selectedReservation.table_number && (
                            <section className="bg-green-500/5 border border-green-500/10 p-8 rounded-[2.5rem] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <TableIcon size={20} className="text-green-500" />
                                    <p className="text-[11px] font-[1000] uppercase text-green-500 tracking-widest italic">TABLE ASSIGNÉE</p>
                                </div>
                                <span className="text-2xl font-[1000] text-white bg-black/40 px-6 py-2 rounded-xl">#{selectedReservation.table_number}</span>
                            </section>
                        )}

                        {selectedReservation.notes && (
                            <section className="bg-yellow-400/[0.02] border-dashed border border-yellow-400/10 p-8 rounded-[2.5rem] space-y-4">
                                <div className="flex items-center gap-3">
                                    <MessageSquare size={14} className="text-yellow-400/50" />
                                    <p className="text-[10px] font-black text-yellow-400/50 uppercase tracking-[0.3em] italic">Notes & Demandes Especiales</p>
                                </div>
                                <p className="text-gray-400 text-xs font-black uppercase italic tracking-widest leading-relaxed">"{selectedReservation.notes}"</p>
                            </section>
                        )}
                    </div>
                )}
            </SideDrawer>

            <div className="space-y-10">
                {/* Dashboard Header */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-400 animate-ping' : 'bg-green-500'} shadow-[0_0_10px_rgba(34,197,94,0.5)]`}></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">SYSTEM STATUS: {loading ? 'SCANNING' : 'LIVE'}</span>
                        </div>
                        <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-[0.85] mb-6">
                            Reservations <br />
                            <span className="text-yellow-400">Logistics</span>
                        </h1>
                        <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Mato's Table Management Platform • Beta Signal</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
                            {[
                                { id: 'grid', icon: LayoutGrid, label: 'Grid' },
                                { id: 'list', icon: ListIcon, label: 'List' },
                                { id: 'calendar', icon: CalendarDays, label: 'Calendar' },
                                { id: 'day', icon: Clock, label: 'Timeline' }
                            ].map(view => (
                                <button
                                    key={view.id}
                                    onClick={() => setViewMode(view.id as any)}
                                    className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 ${viewMode === view.id ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <view.icon size={14} />
                                    <span className="hidden lg:inline">{view.label}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => fetchReservations()}
                            className="bg-white text-black px-10 py-5 rounded-3xl font-[1000] uppercase text-[11px] tracking-[0.2em] italic hover:scale-105 transition-all shadow-2xl flex items-center gap-4 group"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                            Sync Feed
                        </button>
                    </div>
                </div>

                {/* Status Matrix & Active Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap gap-4 bg-white/[0.02] p-2 rounded-[2.5rem] border border-white/5 w-fit">
                        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => {
                                    setFilterStatus(status);
                                    setSelectedDateFilter(null);
                                }}
                                className={`px-8 py-4 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] italic transition-all ${filterStatus === status && !selectedDateFilter ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                            >
                                {status === 'all' ? 'Tous les flux' : getStatusConfig(status).label}
                            </button>
                        ))}
                    </div>

                    {selectedDateFilter && (
                        <div className="bg-yellow-400/10 border border-yellow-400/20 px-6 py-3 rounded-2xl flex items-center gap-4">
                            <Calendar size={14} className="text-yellow-400" />
                            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest italic">Filtré par date: {selectedDateFilter}</span>
                            <button
                                onClick={() => setSelectedDateFilter(null)}
                                className="text-yellow-400/50 hover:text-yellow-400"
                            >
                                <XCircle size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Render */}
                {viewMode === 'calendar' ? (
                    <AdminCalendarView
                        reservations={reservations}
                        onDateSelect={(date) => {
                            setSelectedDateFilter(date);
                        }}
                        onReservationSelect={(res) => {
                            setSelectedReservation(res);
                        }}
                    />
                ) : viewMode === 'list' ? (
                    <AdminListView
                        reservations={reservations}
                        onReservationSelect={setSelectedReservation}
                    />
                ) : viewMode === 'day' ? (
                    <AdminDayView
                        reservations={reservations}
                        selectedDate={selectedDateFilter}
                        onDateSelect={setSelectedDateFilter}
                        onReservationSelect={setSelectedReservation}
                    />
                ) : (
                    <>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-60 space-y-8">
                                <Loader2 className="w-16 h-16 text-yellow-400 animate-spin" />
                                <p className="text-gray-700 font-[1000] uppercase text-xs tracking-[1em] animate-pulse italic">Decoding Booking Data...</p>
                            </div>
                        ) : reservations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-60 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed space-y-8">
                                <Calendar size={64} className="text-gray-800" />
                                <h3 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">Pas de Data</h3>
                            </div>
                        ) : reservations.filter(res => !selectedDateFilter || res.reservation_date.startsWith(selectedDateFilter)).length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-60 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed space-y-8">
                                <AlertCircle size={64} className="text-gray-800 animate-pulse" />
                                <div className="text-center space-y-4">
                                    <h3 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">Secteur Calme</h3>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">Aucune mission pour le {selectedDateFilter}</p>
                                    <button
                                        onClick={() => setSelectedDateFilter(null)}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-yellow-400/20 mt-6 mt-10 italic"
                                    >
                                        Afficher Tous les Flux <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                                {reservations
                                    .filter(res => !selectedDateFilter || res.reservation_date.startsWith(selectedDateFilter))
                                    .map(res => {
                                        const config = getStatusConfig(res.status);
                                        return (
                                            <div
                                                key={res.id}
                                                onClick={() => setSelectedReservation(res)}
                                                className="group bg-white/[0.01] rounded-[3.5rem] p-10 border border-white/5 hover:border-yellow-400/50 transition-all duration-700 relative overflow-hidden cursor-pointer hover:scale-[1.02]"
                                            >
                                                <div className="relative z-10 space-y-8">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <Hash size={10} className="text-yellow-400" />
                                                                <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">{res.id}</p>
                                                            </div>
                                                            <h3 className="text-3xl font-[1000] text-white uppercase tracking-tighter italic group-hover:text-yellow-400 transition-colors uppercase">{res.customer_name}</h3>
                                                        </div>
                                                        <div className={`w-12 h-12 rounded-xl ${config.bg} ${config.border} border flex items-center justify-center ${config.color}`}>
                                                            <config.icon size={20} />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] italic mb-1">Time Vector</p>
                                                            <p className="text-white font-[1000] italic text-xs tracking-widest">
                                                                {new Date(res.reservation_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} @ {new Date(res.reservation_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] italic mb-1">Party</p>
                                                            <p className="text-white font-[1000] italic text-xs tracking-widest">{res.party_size} PERS.</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-2 text-yellow-400/50">
                                                                <Phone size={12} />
                                                                <span className="text-[10px] font-bold tracking-widest">{res.customer_phone}</span>
                                                            </div>
                                                        </div>
                                                        {res.table_number && (
                                                            <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 font-black text-[10px] tracking-widest">
                                                                TABLE #{res.table_number}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="absolute right-8 bottom-10 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0 duration-700">
                                                    <ChevronRight size={24} className="text-yellow-400 animate-pulse" />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
