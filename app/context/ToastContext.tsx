'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
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

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

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
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              pointer-events-auto
              flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md
              transform transition-all duration-500 ease-out
              animate-slide-in-right
              w-full max-w-sm md:min-w-[320px]
              ${t.type === 'success'
                                ? 'bg-gray-900/90 border-green-500/30 text-white'
                                : t.type === 'error'
                                    ? 'bg-gray-900/90 border-red-500/30 text-white'
                                    : t.type === 'warning'
                                        ? 'bg-gray-900/90 border-yellow-500/30 text-white'
                                        : 'bg-gray-900/90 border-blue-500/30 text-white'
                            }
            `}
                    >
                        <div className={`p-2 rounded-full 
              ${t.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                t.type === 'error' ? 'bg-red-500/10 text-red-500' :
                                    t.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-blue-500/10 text-blue-500'
                            }
            `}>
                            {t.type === 'success' && <CheckCircle className="w-5 h-5" />}
                            {t.type === 'error' && <AlertCircle className="w-5 h-5" />}
                            {t.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                            {t.type === 'info' && <Info className="w-5 h-5" />}
                        </div>

                        <p className="flex-1 font-bold text-sm">{t.message}</p>

                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-gray-500 hover:text-white transition-colors p-1"
                        >
                            <X className="w-4 h-4" />
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
