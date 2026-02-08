'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, LifeBuoy } from 'lucide-react';
import SupportTicketForm from './SupportTicketForm';
import { useSupportModal } from '@/hooks/useSupportModal';

export default function SupportTicketModal() {
    const { isOpen, closeSupportModal, modalContext } = useSupportModal();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSupportModal}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[80px] rounded-full -mr-32 -mt-32" />

                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center border border-yellow-400/20 text-yellow-400">
                                    <LifeBuoy size={20} />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Assistance Directe</h2>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1 italic">Intervention Mato's</p>
                                </div>
                            </div>
                            <button
                                onClick={closeSupportModal}
                                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="p-8 relative z-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <SupportTicketForm
                                isModal
                                initialSubject={modalContext.subject}
                                initialDescription={modalContext.description}
                                initialOrderId={modalContext.orderId}
                                initialPriority={modalContext.priority}
                                initialModule={modalContext.module}
                                onSuccess={() => {
                                    // Could show a success toast here
                                    closeSupportModal();
                                }}
                                onCancel={closeSupportModal}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
