import { ChevronRight, Gift, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PromotionsProps {
    promos: any[];
    promoSlide: number;
    setPromoSlide: (i: number) => void;
}

export default function Promotions({ promos, promoSlide, setPromoSlide }: PromotionsProps) {
    return (
        <section className="py-20 px-4 bg-gray-950 relative overflow-hidden">
            {/* Signature Accent Glows */}
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-yellow-400/5 blur-[150px] -translate-y-1/2 pointer-events-none animate-pulse"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
                        <span className="text-yellow-400 font-black tracking-[0.4em] uppercase text-xs italic">Offres Limitées</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-[1000] text-white tracking-tighter uppercase leading-none italic">
                        Le Goût <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Privilégié</span>
                    </h2>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black p-1 md:p-1.5 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 relative group">
                    {/* Corner Decoration */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 border-t-2 border-r-2 border-yellow-400/10 rounded-tr-[4rem] pointer-events-none group-hover:border-yellow-400/30 transition-all duration-700"></div>

                    <div className="bg-gradient-to-br from-gray-950 via-gray-900/50 to-black rounded-[3.8rem] overflow-hidden min-h-[450px] relative">
                        {/* Interactive Scanline */}
                        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-20">
                            <div className="w-full h-[200%] bg-gradient-to-b from-transparent via-yellow-400/[0.05] to-transparent animate-scanline"></div>
                        </div>

                        {/* Slider Content */}
                        {promos.length > 0 ? (
                            promos.map((promo, index) => (
                                <div
                                    key={promo.id}
                                    className={`grid lg:grid-cols-2 lg:items-center transition-all duration-1000 absolute inset-0 ${index === promoSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                >
                                    {/* Visual Side */}
                                    <div className="relative h-[400px] md:h-[500px] lg:h-full flex items-center justify-center p-20">
                                        {/* Aura Effect */}
                                        <div className="absolute w-[80%] h-[80%] bg-yellow-400/10 rounded-full blur-[80px] animate-pulse"></div>

                                        <div className="text-[12rem] md:text-[15rem] lg:text-[18rem] filter drop-shadow-[0_20px_50px_rgba(250,204,21,0.4)] animate-float transform group-hover:scale-110 transition-transform duration-1000 relative z-10">
                                            {promo.emoji || (promo.name.includes('Burger') ? '🍔' : '🍕')}
                                        </div>

                                        <div className="absolute top-20 right-20 bg-yellow-400 text-gray-900 px-8 py-4 rounded-[2rem] font-black text-2xl shadow-[0_20px_40px_rgba(250,204,21,0.3)] rotate-12 flex flex-col items-center">
                                            <span className="text-[10px] uppercase tracking-widest leading-none mb-1">Économisez</span>
                                            -{promo.discount || 20}%
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div className="p-10 md:p-16 lg:p-24 flex flex-col justify-center space-y-10 relative z-10">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-yellow-400/50">
                                                <Sparkles className="w-4 h-4" />
                                                <span className="font-black tracking-[0.3em] uppercase text-[10px]">Mato's Signature Series</span>
                                            </div>
                                            <h2 className="text-5xl md:text-7xl font-[1000] text-white tracking-tighter leading-[0.9] italic uppercase">
                                                {promo.name.split(' ').slice(0, -1).join(' ')} <br />
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 not-italic">
                                                    {promo.name.split(' ').slice(-1)}
                                                </span>
                                            </h2>
                                        </div>

                                        <p className="text-lg md:text-xl text-gray-500 font-bold leading-relaxed max-w-xl italic">
                                            {promo.description}
                                        </p>

                                        <div className="flex flex-col sm:flex-row items-center gap-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Offre Exclusive</span>
                                                <div className="text-5xl md:text-7xl font-black text-white tracking-tighter italic">
                                                    {promo.price || 68} <span className="text-2xl text-yellow-400 uppercase not-italic">DT</span>
                                                </div>
                                            </div>
                                            <div className="hidden sm:block h-20 w-px bg-white/10 rounded-full"></div>
                                            <Link
                                                href="/promos"
                                                className="relative group/btn bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-12 py-6 rounded-[2rem] font-black text-xl transition-all shadow-3xl shadow-yellow-400/20 active:scale-95 flex items-center gap-4 overflow-hidden w-full sm:w-auto text-center justify-center"
                                            >
                                                <span className="relative z-10 uppercase tracking-tighter">En profiter</span>
                                                <ChevronRight className="relative z-10 w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                            </Link>
                                        </div>

                                        {/* Technical Metadata */}
                                        <div className="pt-8 border-t border-white/5 flex gap-12 text-[10px] font-black text-gray-600 uppercase tracking-widest italic">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                Disponibilité Immédiate
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
                                                Temps Limité
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-gray-700 font-black uppercase tracking-widest italic animate-pulse">Initialisation du Scanner...</div>
                            </div>
                        )}

                        {/* Slide Indicators / Controller */}
                        {promos.length > 1 && (
                            <div className="absolute bottom-12 left-10 lg:left-24 flex items-center gap-6 z-30">
                                {promos.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPromoSlide(i)}
                                        className="group flex flex-col items-center gap-3"
                                    >
                                        <div className={`h-1.5 rounded-full transition-all duration-700 ${i === promoSlide ? 'bg-yellow-400 w-16 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-white/10 w-4 hover:bg-white/30'}`} />
                                        <span className={`text-[10px] font-black transition-all duration-500 ${i === promoSlide ? 'text-yellow-400 opacity-100' : 'text-gray-600 opacity-0'}`}>
                                            0{i + 1}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
