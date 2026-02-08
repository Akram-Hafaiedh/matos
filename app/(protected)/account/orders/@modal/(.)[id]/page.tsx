'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ShoppingBag, X } from 'lucide-react';
import OrderDetailsView from '@/components/OrderDetailsView';

export default function InterceptedOrderDetails() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const handleClose = () => {
        router.back();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 blur-[100px] rounded-full -mr-48 -mt-48" />

                {/* Header Overlay */}
                <div className="absolute top-8 right-8 z-[110]">
                    <button
                        onClick={handleClose}
                        className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-md"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-10 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <OrderDetailsView
                        id={id}
                        isModal
                        onClose={handleClose}
                    />
                </div>
            </motion.div>
        </div>
    );
}
