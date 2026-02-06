'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'success' | 'info';
    isLoading?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    type = 'warning',
    isLoading = false,
    disabled = false,
    children
}) => {
    const getTypeStyles = () => {
        // Base premium styles (Yellow/Gold) applied to all types for consistency
        const premiumStyle = {
            bg: 'bg-yellow-400/10',
            border: 'border-yellow-400/30',
            text: 'text-yellow-400',
            button: 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-yellow-400/20',
            glow: 'bg-yellow-400/5'
        };

        switch (type) {
            case 'danger':
                return {
                    ...premiumStyle,
                    icon: <AlertCircle className="w-8 h-8" />
                };
            case 'success':
                return {
                    ...premiumStyle,
                    icon: <CheckCircle className="w-8 h-8" />
                };
            case 'info':
                return {
                    ...premiumStyle,
                    icon: <Info className="w-8 h-8" />
                };
            default: // warning
                return {
                    ...premiumStyle,
                    icon: <AlertTriangle className="w-8 h-8" />
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className={`bg-[#0a0a0a] border w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-500 ${styles.border}`}
                    >
                        {/* Decorative Background */}
                        <div className={`absolute top-0 right-0 w-64 h-64 ${styles.glow} rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none`}></div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-center gap-5 mb-8">
                                <div className={`w-14 h-14 ${styles.bg} ${styles.text} rounded-2xl flex items-center justify-center border ${styles.border}`}>
                                    {styles.icon}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter leading-none text-white">{title}</h2>
                                    <p className={`text-[10px] font-black ${styles.text} uppercase italic tracking-[0.3em] mt-1`}>Validation Mato's</p>
                                </div>
                            </div>

                            {/* Message */}
                            <p className="text-gray-400 font-bold text-sm mb-10 leading-relaxed">
                                {message}
                            </p>

                            {/* Custom Content Slot */}
                            {children && (
                                <div className="mb-10 animate-in fade-in slide-in-from-top-2 duration-500">
                                    {children}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onClose}
                                    type="button"
                                    className="flex-1 order-2 sm:order-1 px-8 py-5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-black uppercase text-[10px] tracking-widest transition-all"
                                    disabled={isLoading}
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    type="button"
                                    className={`flex-[2] order-1 sm:order-2 px-8 py-5 rounded-2xl ${styles.button} font-black uppercase text-[10px] tracking-widest transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                                    disabled={isLoading || disabled}
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {confirmText}
                                </button>
                            </div>
                        </div>

                        {/* Close Button UI */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
