'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Skull } from 'lucide-react';
import { motion } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    exiting?: boolean;
}

interface ToastContextType {
    toast: {
        success: (message: string) => void;
        error: (message: string) => void;
        info: (message: string) => void;
        warning: (message: string) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.map(t => t.id === id ? { ...t, exiting: true } : t));

        // Wait for animation to finish before removing from state
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 500);
    }, []);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds (increased for better cross-page visibility)
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);

    const toast = {
        success: (message: string) => addToast(message, 'success'),
        error: (message: string) => addToast(message, 'error'),
        info: (message: string) => addToast(message, 'info'),
        warning: (message: string) => addToast(message, 'warning'),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-8 right-8 z-[10000] flex flex-col gap-6 pointer-events-none w-full max-w-sm">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
                            pointer-events-auto relative overflow-hidden
                            flex flex-col gap-3 p-6 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-2 backdrop-blur-3xl
                            transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                            ${t.exiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
                            ${t.type === 'success'
                                ? 'bg-zinc-950/80 border-yellow-400/30'
                                : t.type === 'error'
                                    ? 'bg-zinc-950/90 border-yellow-400/40 shadow-yellow-400/5'
                                    : t.type === 'warning'
                                        ? 'bg-zinc-950/80 border-yellow-400/20 shadow-yellow-400/5'
                                        : 'bg-zinc-950/80 border-white/10'
                            }
                        `}
                    >
                        {/* Status Label - Tactical Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl border-2 ${t.type === 'success' ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' :
                                    t.type === 'error' ? 'bg-yellow-400/10 border-yellow-400/60 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]' :
                                        t.type === 'warning' ? 'bg-yellow-400/5 border-yellow-400/30 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]' :
                                            'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                    }`}>
                                    {t.type === 'success' && <CheckCircle size={18} />}
                                    {t.type === 'error' && <Skull size={18} />}
                                    {t.type === 'warning' && <AlertTriangle size={18} />}
                                    {t.type === 'info' && <Info size={18} />}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] font-mono text-gray-400">
                                    {t.type === 'success' ? 'SYNDICATE-SUCCESS_ACK' :
                                        t.type === 'error' ? 'LOGISTIC-ERROR_TRAPPED' :
                                            t.type === 'warning' ? 'SYN-INTEL_WARNING' :
                                                'SYSTEM-NOTICE'}
                                </span>
                            </div>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Message Content */}
                        <div className="pl-1">
                            <p className="font-black text-sm md:text-base italic tracking-tight text-white leading-snug drop-shadow-md">
                                {t.message}
                            </p>
                        </div>

                        {/* Tactical Footer / Progress Bar Illusion */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className={`h-1 flex-1 rounded-full bg-white/5 overflow-hidden`}>
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: 0 }}
                                    transition={{ duration: 5, ease: "linear" }}
                                    className={`h-full ${t.type === 'success' ? 'bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.8)]' :
                                        t.type === 'error' ? 'bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]' :
                                            t.type === 'warning' ? 'bg-yellow-400 opacity-50 shadow-[0_0_10px_rgba(234,179,8,0.4)]' :
                                                'bg-white'
                                        }`}
                                />
                            </div>
                            <span className="text-[8px] font-mono text-gray-700 font-bold uppercase tracking-widest">
                                {t.type === 'error' ? 'RE-SYNC_REQ' : 'AUTO-PURGE'}
                            </span>
                        </div>

                        {/* Background Noise/Scanline */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
