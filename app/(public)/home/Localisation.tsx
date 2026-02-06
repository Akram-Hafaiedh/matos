'use client';

import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-900 animate-pulse flex items-center justify-center font-black text-gray-800 uppercase tracking-widest">Initialisation Satellite...</div>
});

interface LocalisationProps {
    settings?: any;
}

export default function Localisation({ settings }: LocalisationProps) {
    return (
        <section className="py-16 relative overflow-hidden bg-transparent">

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col gap-10">
                    <SectionHeader
                        badge="Visit Mato's"
                        title={<>Notre <span className="text-yellow-400">Localisation</span></>}
                        rightContent={
                            <div className="flex flex-col items-center md:items-end gap-2">
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 backdrop-blur-3xl shadow-2xl flex items-center gap-4 group hover:border-yellow-400/30 transition-all duration-500">
                                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/10 group-hover:scale-110 transition-transform">
                                        <MapPin className="w-5 h-5 text-gray-900" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-[1000] text-xs uppercase italic tracking-tighter">Carthage, Tunis</p>
                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Ouvert 7j/7 • 11h-00h</p>
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    {/* Map Container - Tighter Shadow & Border */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative h-[450px] w-full bg-gray-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl">
                            <Map />

                            {/* Info Overlay - Subtle */}
                            <div className="absolute bottom-6 left-6 right-6 md:right-auto z-[20] pointer-events-none">
                                <div className="bg-gray-950/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl max-w-sm pointer-events-auto group-hover:border-yellow-400/30 transition-all duration-500">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/20 italic font-black text-gray-900">
                                            M
                                        </div>
                                        <div>
                                            <h4 className="text-white font-[1000] uppercase italic tracking-tighter">MATO'S PIZZA</h4>
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Carthage • Tunis</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 font-bold text-xs leading-relaxed mb-4">
                                        Situé au cœur de Carthage, nous vous accueillons dans une ambiance premium et moderne.
                                    </p>
                                    <a
                                        href={settings?.googleMapsUrl || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center bg-white text-gray-900 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-yellow-400 hover:text-gray-900 transition-all duration-500 active:scale-95"
                                    >
                                        Itinéraire
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
