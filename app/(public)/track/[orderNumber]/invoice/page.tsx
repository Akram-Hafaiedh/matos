'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Printer } from 'lucide-react';
import InvoiceRenderer from '@/components/invoices/InvoiceRenderer';

export default function InvoicePrintPage({ params }: { params: Promise<{ orderNumber: string }> }) {
    const { orderNumber } = React.use(params);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                const res = await fetch(`/api/tracking/${orderNumber}/invoice`);
                const json = await res.json();
                if (res.ok && json.success) {
                    setData(json);
                } else {
                    setError(json.error || 'Erreur lors du chargement de la facture');
                }
            } catch (err) {
                setError('Erreur de connexion serveur');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoiceData();
    }, [orderNumber]);

    const isTactical = data?.settings?.invoice_template === 'tactical';

    if (loading) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center ${isTactical ? 'bg-[#050505]' : 'bg-white'}`}>
                <Loader2 className={`w-8 h-8 ${isTactical ? 'text-yellow-400' : 'text-black'} animate-spin`} />
                <p className={`mt-4 text-[10px] font-black uppercase tracking-[0.5em] ${isTactical ? 'text-zinc-500' : 'text-black'}`}>
                    Synchronisation des données fiscales...
                </p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isTactical ? 'bg-[#050505]' : 'bg-white'} p-8`}>
                <div className={`max-w-md w-full border-2 ${isTactical ? 'border-yellow-400/20 bg-yellow-400/5' : 'border-red-500'} p-8 text-center uppercase italic`}>
                    <p className={`font-black ${isTactical ? 'text-yellow-400' : 'text-red-500'} text-sm`}>{error || 'Accès Refusé'}</p>
                    <p className="text-[10px] text-zinc-400 mt-2">Veuillez contacter le support Matos HQ</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${isTactical ? 'bg-[#0a0a0a]' : 'bg-zinc-100'} min-h-screen py-12 px-4 print:p-0 flex flex-col items-center transition-colors duration-1000 uppercase`}>
            {/* Control Bar (hidden during print) */}
            <div className={`print:hidden mb-8 max-w-[850px] w-full ${isTactical ? 'bg-zinc-900/50 border-white/5 backdrop-blur-xl' : 'bg-white border-zinc-200 shadow-sm'} p-6 rounded-2xl border flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-700`}>
                <div>
                    <h1 className={`text-xl font-black italic ${isTactical ? 'text-white' : 'text-black'}`}>
                        PRÉVISUALISATION <span className={isTactical ? 'text-yellow-400' : 'text-zinc-400'}>FACTURE</span>
                    </h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isTactical ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {isTactical ? 'PROTOCOLE ALPHA-9 // SORTIE PHYSIQUE' : 'Prêt pour impression thermique ou laser'}
                    </p>
                </div>
                <button
                    onClick={() => window.print()}
                    className={`${isTactical ? 'bg-yellow-400 text-black shadow-yellow-400/20' : 'bg-black text-white shadow-lg'} px-8 py-3 rounded-full font-[1000] uppercase text-[10px] tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl`}
                >
                    <Printer size={16} />
                    {isTactical ? 'INITIALISER L\'IMPRESSION' : 'IMPRIMER MAINTENANT'}
                </button>
            </div>

            {/* Invoice Content */}
            <div className="print:m-0 print:p-0">
                <InvoiceRenderer order={data.order} settings={data.settings} />
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        background-color: ${isTactical ? '#050505' : 'white'} !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        margin: 0;
                        padding: 0;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
