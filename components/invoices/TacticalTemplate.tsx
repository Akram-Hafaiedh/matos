import React from 'react';

interface InvoiceProps {
    order: any;
    settings: any;
}

export default function TacticalTemplate({ order, settings }: InvoiceProps) {
    const vatAmount = order.subtotal * (settings.vat_rate || 0.19);

    return (
        <div
            className="bg-[#050505] text-zinc-100 p-8 w-[21cm] min-h-[29.7cm] mx-auto shadow-2xl font-mono uppercase text-[11px] border border-white/10 relative overflow-hidden flex flex-col"
            style={{
                printColorAdjust: 'exact',
                WebkitPrintColorAdjust: 'exact',
                colorScheme: 'dark'
            } as any}
        >
            {/* Tactical Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('/grid.png')] bg-repeat"></div>

            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-zinc-900"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-zinc-900"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-zinc-900"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-zinc-900"></div>

            {/* Tactical Watermark */}
            <div className="absolute top-10 right-10 opacity-[0.03] scale-110 pointer-events-none">
                <p className="font-black text-6xl -rotate-12 border-[8px] border-white p-4 tracking-tighter">INVOICE: VALID</p>
            </div>

            {/* Header Area */}
            <div className="border-b-2 border-white/10 pb-4 mb-5 flex justify-between items-end relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                        <img src="/logo.svg" alt="Matos" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="font-black text-[8px] tracking-[0.4em] text-yellow-400 opacity-80 uppercase leading-none">FACTURE TACTIQUE // V2.0</p>
                        <h1 className="text-3xl font-black italic tracking-tighter leading-none">
                            MATO'S <span className="text-zinc-500 not-italic">FACTURE</span>
                        </h1>
                    </div>
                </div>
                <div className="text-right space-y-0.5 text-zinc-500">
                    <div className="bg-zinc-900 border border-white/5 px-2 py-1 rounded mb-1">
                        <p className="font-black text-white italic text-[12px] tracking-widest text-nowrap">NO: {order.order_number.toUpperCase()}</p>
                    </div>
                    <p className="font-black text-[7px] tracking-[0.2em]">SEQ: {new Date(order.created_at).getTime().toString().slice(-10)}</p>
                </div>
            </div>

            {/* Intel Section */}
            <div className="grid grid-cols-2 gap-6 mb-5 relative z-10">
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-10 h-1 bg-yellow-400"></div>
                    <h2 className="text-zinc-500 font-extrabold text-[8px] tracking-[0.4em] mb-2 uppercase">CHAMP DE LIVRAISON</h2>
                    <div className="space-y-0.5">
                        <p className="font-black text-sm text-white uppercase leading-tight">{order.customer_name}</p>
                        <p className="font-bold text-zinc-400 italic text-[10px]">PH: {order.customer_phone}</p>
                        <p className="text-zinc-500 pt-2 border-t border-white/5 mt-2 text-[9px] uppercase leading-normal line-clamp-2">{order.delivery_address}</p>
                    </div>
                </div>

                <div className="space-y-3 pt-1 pl-4 border-l border-white/5 font-mono uppercase">
                    <h2 className="text-zinc-500 font-extrabold text-[8px] tracking-[0.4em]">LOGS // PARAMS</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="text-zinc-600 font-bold text-[9px]">DATE</span>
                            <span className="font-black text-white italic text-[10px]">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="text-zinc-600 font-bold text-[9px]">METHODE</span>
                            <span className="font-black text-white italic text-[10px]">{order.payment_method}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="text-zinc-600 font-bold text-[9px]">PROTOCOLE</span>
                            <span className="font-black text-yellow-400 italic text-[9px] tracking-tighter">
                                {order.order_type === 'delivery' ? 'MOBILE_DEPLOY' : 'STATION_PICKUP'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Manifest */}
            <div className="mb-5 relative z-10 flex-1 min-h-0">
                <div className="flex items-center gap-3 mb-3 uppercase">
                    <h2 className="font-black text-[10px] tracking-[0.4em] text-zinc-400">MANIFESTE DE CARGAISON</h2>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>

                <div className="overflow-hidden border border-white/5 rounded-lg bg-white/[0.01]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-zinc-900 border-b border-white/10">
                                <th className="text-left py-2 px-3 font-black text-zinc-500 tracking-widest text-[8px] uppercase">ARTICLE</th>
                                <th className="text-center py-2 px-3 font-black text-zinc-500 tracking-widest text-[8px] w-12 uppercase">QTÉ</th>
                                <th className="text-right py-2 px-3 font-black text-zinc-500 tracking-widest text-[8px] w-24 uppercase">PRIX U.</th>
                                <th className="text-right py-2 px-3 font-black text-zinc-500 tracking-widest text-[8px] w-24 uppercase">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {order.order_items.map((item: any, idx: number) => (
                                <tr key={idx} className="hover:bg-white/[0.02] break-inside-avoid">
                                    <td className="py-2 px-3">
                                        <p className="font-black text-[13px] text-white uppercase leading-none">{item.item_name}</p>
                                        {(item.selected_size || item.choices) && (
                                            <div className="flex flex-wrap gap-2 mt-0.5">
                                                {item.selected_size && <span className="text-[8px] font-black bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded border border-white/5 italic">TAIL: {item.selected_size}</span>}
                                                {item.choices && <span className="text-[8px] font-black bg-zinc-800 text-zinc-500 px-1 py-0.5 rounded italic">CONF: {Object.values(item.choices).join('/')}</span>}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 px-3 text-center font-black text-zinc-300 text-[12px]">{item.quantity}</td>
                                    <td className="py-2 px-3 text-right font-medium text-zinc-500 font-mono text-[11px] italic">{item.item_price.toFixed(3)}</td>
                                    <td className="py-2 px-3 text-right font-black text-white font-mono text-[12px]">{(item.item_price * item.quantity).toFixed(3)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tactical Filler / Decoration */}
            <div className="flex-1 flex flex-col justify-center opacity-[0.03] space-y-4 pointer-events-none select-none py-10">
                <div className="h-px bg-white/20 w-1/3 mx-auto"></div>
                <div className="text-center space-y-2">
                    <p className="text-[8px] tracking-[1em] font-black">COMM_LINK_SECURE // DATA_PHASE_FINAL</p>
                    <p className="text-[6px] tracking-[0.5em]">SYSTEM_STABLE // NO_BREACH_DETECTED // CARTHAGE_CORE_ALPHA</p>
                    <p className="text-[6px] tracking-[0.5em]">PACKET_ID: {(String(order.id || order.order_number)).slice(0, 16).toUpperCase()}</p>
                </div>
                <div className="h-px bg-white/20 w-1/3 mx-auto"></div>
            </div>

            {/* Summary & Auth */}
            <div className="grid grid-cols-2 gap-6 mb-4 relative z-10 break-inside-avoid">
                <div className="flex flex-col justify-end">
                    <div className="inline-flex items-center gap-3 p-3 bg-white/[0.01] border border-white/5 rounded group max-w-[200px]">
                        <div className="w-8 h-8 rounded bg-yellow-400 flex items-center justify-center">
                            <img src="/logo.svg" alt="M" className="w-5 h-5 object-contain" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white tracking-widest leading-none">MATO'S</p>
                            <p className="text-[8px] font-bold text-zinc-600 tracking-tighter uppercase leading-tight mt-1 truncate">Facture Certifiée</p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                        <span className="text-zinc-500">SOUS-TOTAL</span>
                        <span className="text-zinc-300 font-mono">{(order.subtotal || order.total_amount).toFixed(3)} DT</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                        <span className="text-zinc-500">TVA ({((settings.vat_rate || 0.19) * 100).toFixed(0)}%)</span>
                        <span className="text-zinc-300 font-mono">{(vatAmount || 0).toFixed(3)} DT</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                        <span className="text-zinc-500">TIMBRE + LIVR.</span>
                        <span className="text-zinc-300 font-mono">{((settings.stamp_duty || 1.0) + (order.delivery_fee || 0)).toFixed(3)} DT</span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex justify-between items-center italic">
                        <p className="text-[10px] font-black text-yellow-400 tracking-widest uppercase mb-0 leading-none">TOTAL</p>
                        <span className="text-2xl font-[1000] text-yellow-400 tracking-tighter font-mono italic leading-none">
                            {order.total_amount.toFixed(3)}<span className="text-xs ml-1 font-normal not-italic uppercase tracking-widest">dt</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Master Footer */}
            <div className="border-t border-white/10 pt-3 relative z-10 flex justify-between items-center break-inside-avoid">
                <div className="space-y-0.5 font-mono uppercase">
                    <p className="text-[8px] font-black text-zinc-700 tracking-[0.4em]">SYSTEM SOURCE: MATOS_MISSION_HUB</p>
                    <p className="text-[9px] font-black text-zinc-500 italic tracking-tighter">© 2026 MATO'S CARTHAGE</p>
                </div>
                <div className="text-right">
                    <p className="text-[7px] text-zinc-600 font-bold tracking-widest uppercase italic opacity-30">Document fiscal officiel - Diffusion restreinte</p>
                </div>
            </div>
        </div>
    );
}
