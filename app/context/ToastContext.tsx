'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

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
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              pointer-events-auto
              flex items-center gap-4 px-6 py-5 rounded-[2rem] shadow-3xl border backdrop-blur-xl
              transform transition-all duration-500 ease-out
              ${t.exiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
              w-full max-w-sm md:min-w-[350px]
                ${t.type === 'success'
                                ? 'bg-gray-950/90 border-yellow-400/20 text-white shadow-yellow-400/10'
                                : t.type === 'error'
                                    ? 'bg-gray-950/90 border-red-500/20 text-white shadow-red-500/10'
                                    : t.type === 'warning'
                                        ? 'bg-gray-950/90 border-orange-500/20 text-white shadow-orange-500/10'
                                        : 'bg-gray-950/90 border-gray-800 text-white'
                            }
            `}
                    >
                        <div className={`p-3 rounded-2xl border
              ${t.type === 'success' ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400' :
                                t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                    t.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                        'bg-gray-800/50 border-gray-700 text-gray-400'
                            }
            `}>
                            {t.type === 'success' && <CheckCircle className="w-6 h-6" />}
                            {t.type === 'error' && <AlertCircle className="w-6 h-6" />}
                            {t.type === 'warning' && <AlertTriangle className="w-6 h-6" />}
                            {t.type === 'info' && <Info className="w-6 h-6" />}
                        </div>

                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Attention Mato's</p>
                            <p className="font-black text-sm italic tracking-tight">{t.message}</p>
                        </div>

                        <button
                            onClick={() => removeToast(t.id)}
                            className="bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all group"
                        >
                            <X className="w-4 h-4 text-gray-500 group-hover:text-white" />
                        </button>
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
