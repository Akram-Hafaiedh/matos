import { Locate, Crosshair } from "lucide-react";
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-gray-900/50 rounded-[3rem] border border-gray-800 animate-pulse flex items-center justify-center">
            <div className="text-gray-700 font-black uppercase tracking-widest italic">Chargement de la Map...</div>
        </div>
    )
});

interface LocalisationProps {
    mapVisible: boolean;
    settings: any;
}

export default function Localisation({ mapVisible, settings }: LocalisationProps) {
    return (
        <section id="localisation-section" className="py-20 px-4 bg-black relative overflow-hidden">
            {/* Massive Pulsing Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-yellow-400/5 blur-[150px] pointer-events-none animate-pulse"></div>
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                <div className={`text-center space-y-8 transition-all duration-1000 ${mapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent to-yellow-400 rounded-full"></div>
                        <span className="text-yellow-400 font-black uppercase text-xs tracking-[0.4em] flex items-center gap-2">
                            <Locate className="w-4 h-4 animate-pulse" />
                            Localisation
                        </span>
                        <div className="w-12 h-1 bg-gradient-to-l from-transparent to-yellow-400 rounded-full"></div>
                    </div>
                    <h2 className="text-6xl md:text-9xl font-[1000] text-white italic tracking-tighter uppercase leading-none">
                        Venez <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-600">Nous Voir</span>
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-gray-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                        <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl shadow-2xl">
                            <Crosshair className="w-3 h-3 text-yellow-400" />
                            {settings?.lat ? `${settings.lat.toFixed(4)}° N, ${settings.lng.toFixed(4)}° E` : "36.8391° N, 10.3200° E"}
                        </span>
                        <div className="hidden md:block w-20 h-px bg-white/10"></div>
                        <span className="bg-yellow-400/5 px-6 py-3 rounded-2xl border border-yellow-400/10 italic text-yellow-400/80 tracking-[0.2em]">
                            {settings?.address ? `Retrouvez-nous à ${settings.address}` : "Retrouvez-nous au cœur de Carthage."}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`w-full max-w-7xl mx-auto px-4 md:px-12 transition-all duration-1000 delay-300 relative z-10 mt-24 ${mapVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="relative group">
                    {/* Technical Decorative Elements */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-yellow-400/20 rounded-tl-[3.5rem] pointer-events-none group-hover:border-yellow-400/40 transition-colors"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-yellow-400/20 rounded-br-[3.5rem] pointer-events-none group-hover:border-yellow-400/40 transition-colors"></div>

                    {/* Map Container with Glow */}
                    <div className="relative rounded-[3.5rem] overflow-hidden border-2 border-white/5 bg-gray-900 shadow-[0_0_80px_rgba(0,0,0,0.8)] group-hover:border-yellow-400/20 transition-all duration-500 group-hover:shadow-yellow-400/5 p-1 bg-gradient-to-br from-white/10 to-transparent">
                        <div className="w-full relative z-10 transition-transform duration-700 group-hover:scale-[1.01] rounded-[3.4rem] overflow-hidden">
                            <InteractiveMap />
                        </div>
                    </div>

                    {/* Visual Pulse for Map */}
                    <div className="absolute -inset-4 bg-yellow-400/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                </div>
            </div>
        </section>
    );
}
