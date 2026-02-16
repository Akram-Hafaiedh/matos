import React from 'react';
import Image from 'next/image';

interface InvoiceProps {
    order: any;
    settings: any;
}

export default function StandardTemplate({ order, settings }: InvoiceProps) {
    const vatAmount = order.subtotal * (settings.vat_rate || 0.19);

    return (
        <div
            className="bg-white text-zinc-900 p-[1.5cm] w-[21cm] min-h-[29.7cm] mx-auto shadow-sm font-sans flex flex-col"
            style={{
                printColorAdjust: 'exact',
                WebkitPrintColorAdjust: 'exact',
            } as any}
        >
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-zinc-100 pb-10 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter uppercase mb-4 text-black">FACTURE</h1>
                    <p className="text-sm font-medium text-zinc-500 uppercase">N° {order.order_number}</p>
                    <p className="text-sm text-zinc-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold uppercase tracking-tight mb-2">Mato's Carthage</h2>
                    <p className="text-xs text-zinc-500 leading-relaxed whitespace-pre-line">{settings.address}</p>
                    <p className="text-xs text-zinc-500 mt-2">Tél: {settings.phone}</p>
                </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-12 mb-16">
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Destinataire</h3>
                    <p className="text-base font-bold text-zinc-900 mb-1">{order.customer_name}</p>
                    <p className="text-sm text-zinc-600 mb-1">{order.customer_phone}</p>
                    <p className="text-xs text-zinc-500">{order.delivery_address}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Détails Mission</h3>
                    <p className="text-sm text-zinc-600 uppercase font-medium">Mode: {order.order_type}</p>
                    <p className="text-sm text-zinc-600 uppercase font-medium">Paiement: {order.payment_method}</p>
                </div>
            </div>

            {/* Items Table */}
            <div className="flex-1 min-h-0">
                <table className="w-full mb-8 border-collapse">
                    <thead>
                        <tr className="border-b-2 border-zinc-100">
                            <th className="text-left py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[.2em]">Désignation</th>
                            <th className="text-center py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[.2em] w-20">Qté</th>
                            <th className="text-right py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[.2em] w-32">P.U (DT)</th>
                            <th className="text-right py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[.2em] w-32">Total (DT)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {order.order_items.map((item: any, idx: number) => (
                            <tr key={idx}>
                                <td className="py-6">
                                    <p className="font-bold text-sm text-zinc-900 capitalize">{item.item_name}</p>
                                    {item.selected_size && <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">Taille: {item.selected_size}</p>}
                                    {item.choices && <p className="text-[10px] text-zinc-400 mt-1 italic tracking-widest leading-relaxed">{Object.values(item.choices).join(', ')}</p>}
                                </td>
                                <td className="py-6 text-center text-sm font-bold text-zinc-900">{item.quantity}</td>
                                <td className="py-6 text-right text-sm font-medium text-zinc-600">{item.item_price.toFixed(3)}</td>
                                <td className="py-6 text-right text-sm font-bold text-zinc-900">{(item.item_price * item.quantity).toFixed(3)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary & Branding Section */}
            <div className="grid grid-cols-2 gap-12 pt-8 border-t-2 border-zinc-100 mb-8 break-inside-avoid">
                {/* Brand / Auth Side */}
                <div className="flex flex-col justify-end">
                    <div className="flex items-center gap-4 p-4 border border-zinc-100 rounded-xl bg-zinc-50/30">
                        <div className="w-10 h-10 flex items-center justify-center opacity-40 grayscale">
                            <Image src="/logo.svg" alt="Mato's" width={32} height={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-black tracking-widest leading-none uppercase">Document Certifié</p>
                            <p className="text-[8px] font-bold text-zinc-400 tracking-tighter uppercase leading-tight mt-1">Mato's / Carthage HQ</p>
                        </div>
                    </div>
                    {/* Official Stamp */}
                    <div className="mt-4 self-start border-2 border-zinc-200/60 rounded-full px-5 py-1.5 rotate-[-2deg] opacity-40">
                        <p className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em]">CERTIFIED OFFICIAL DOCUMENT</p>
                    </div>
                </div>

                {/* Totals Side */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 font-medium">Sous-total HT</span>
                        <span className="text-zinc-900 font-bold">{order.subtotal.toFixed(3)} DT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 font-medium">TVA ({((settings.vat_rate || 0.19) * 100).toFixed(0)}%)</span>
                        <span className="text-zinc-900 font-bold">{vatAmount.toFixed(3)} DT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 font-medium">Timbre Fiscal</span>
                        <span className="text-zinc-900 font-bold">{(settings.stamp_duty || 1.0).toFixed(3)} DT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 font-medium">Frais Livraison</span>
                        <span className="text-zinc-900 font-bold">{(order.delivery_fee || 0).toFixed(3)} DT</span>
                    </div>
                    <div className="flex justify-between text-2xl border-t-2 border-zinc-900 pt-6">
                        <p className="font-black uppercase tracking-tighter leading-none mb-0 pt-1">Total TTC</p>
                        <span className="font-black tabular-nums leading-none">{order.total_amount.toFixed(3)} DT</span>
                    </div>
                </div>
            </div>

            {/* Master Footer */}
            <div className="mt-auto pt-6 border-t border-zinc-100 flex justify-between items-end break-inside-avoid opacity-40">
                <div className="space-y-1">
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Mato's System Protocol</p>
                    <p className="text-[7px] font-medium text-zinc-400 capitalize whitespace-pre-line leading-tight">Merci de votre confiance. Pour toute assistance, veuillez consulter notre portail de support technique.</p>
                </div>
                <div className="text-right">
                    <p className="text-[7px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-1">DIFFUSION RESTR_PROTOCOL</p>
                    <p className="text-[6px] text-zinc-300 font-bold">SYSTEM_HASH: {(String(order.id)).slice(0, 12).toUpperCase()}</p>
                </div>
            </div>
        </div>
    );
}
