'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Hash } from 'lucide-react';

interface SideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
    isOpen,
    onClose,
    title,
    subtitle = "Transmission Protocol",
    children,
    footer,
    width = "max-w-[700px]"
}) => {
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed inset-y-0 right-0 w-full ${width} bg-[#080808] border-l border-white/5 z-[110] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col`}
                    >
                        {/* Interactive Background Elements */}
                        <div className="absolute top-0 right-0 w-full h-full bg-yellow-400/[0.01] pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/[0.02] blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>

                        {/* Header */}
                        <div className="p-12 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl sticky top-0 z-20">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Hash size={12} className="text-yellow-400" />
                                    <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic leading-none">{subtitle}</span>
                                </div>
                                <h3 className="text-4xl font-[1000] text-white italic tracking-tighter uppercase leading-none">
                                    {title}
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-16 h-16 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-3xl text-gray-500 hover:text-white transition-all flex items-center justify-center group shrink-0"
                            >
                                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-16 pb-40 relative z-10">
                            {children}
                        </div>

                        {/* Footer (Tactical Controls) */}
                        {footer && (
                            <div className="p-12 bg-black/60 backdrop-blur-4xl border-t border-white/5 space-y-6 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] sticky bottom-0 z-20">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SideDrawer;
