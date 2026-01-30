import { ArrowRight, ChevronRight, Star, Clock, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MenuItem } from "@/types/menu";

interface FavoritesProps {
    items: MenuItem[];
}

export default function Favorites({ items }: FavoritesProps) {
    return (
        <section className="py-20 px-4 bg-black relative overflow-hidden">
            {/* Background Signature Glows */}
            <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-yellow-400/5 blur-[150px] pointer-events-none animate-pulse"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}></div>

            <div className="max-w-7xl mx-auto space-y-24 relative z-10">
                {/* Header with Signature Effect */}
                <div className="text-center space-y-8">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent to-yellow-400 rounded-full"></div>
                        <span className="text-yellow-400 font-black uppercase text-xs tracking-[0.4em]">Le Savoir-Faire</span>
                        <div className="w-12 h-1 bg-gradient-to-l from-transparent to-yellow-400 rounded-full"></div>
                    </div>
                    <h2 className="text-6xl md:text-9xl font-[1000] text-white italic tracking-tighter uppercase leading-[0.85]">
                        Les <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-600">Favoris</span>
                    </h2>
                    <p className="text-gray-500 font-bold max-w-2xl mx-auto uppercase text-[10px] tracking-widest leading-relaxed">
                        Une sélection rigoureuse de nos créations les plus plébiscitées. <br />
                        L'équilibre parfait entre technique et gourmandise.
                    </p>
                </div>

                {/* Cool Favorites Grid */}
                <div className="grid lg:grid-cols-3 gap-12 pt-12">
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            className="group relative bg-gray-950/40 border-2 border-white/5 rounded-[4rem] overflow-hidden backdrop-blur-3xl hover:border-yellow-400/20 transition-all duration-700 shadow-3xl flex flex-col"
                        >
                            {/* Technical Scanline Effect */}
                            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="w-full h-[200%] bg-gradient-to-b from-transparent via-yellow-400/[0.03] to-transparent animate-scanline"></div>
                            </div>

                            {/* Badge */}
                            <div className="absolute top-8 left-8 z-30">
                                <div className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2">
                                    <Star className="w-3 h-3 fill-gray-900" />
                                    TOP VENTE
                                </div>
                            </div>

                            {/* Image Section with Cool Background */}
                            <div className="h-80 relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-transparent">
                                {/* Decorative Circles */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-64 h-64 border border-white/5 rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
                                    <div className="absolute w-48 h-48 border border-yellow-400/5 rounded-full group-hover:scale-150 transition-transform duration-1000 delay-100"></div>
                                </div>

                                {item.image.startsWith('/') ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover scale-110 group-hover:scale-125 group-hover:rotate-2 transition-all duration-1000 p-8"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                ) : (
                                    <span className="text-9xl transition-all duration-700 group-hover:scale-125 filter drop-shadow-2xl relative z-10">
                                        {item.image}
                                    </span>
                                )}
                            </div>

                            {/* Info Section */}
                            <div className="p-10 flex-1 flex flex-col space-y-8 relative">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-yellow-400 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                                        <Zap className="w-3 h-3" />
                                        Mato's Exclusive
                                    </div>
                                    <h3 className="text-4xl font-[1000] text-white italic group-hover:text-yellow-400 transition-all duration-500 leading-none">
                                        {item.name}
                                    </h3>
                                    {item.ingredients && (
                                        <p className="text-gray-500 font-bold text-xs line-clamp-2 leading-relaxed tracking-wide">
                                            {item.ingredients}
                                        </p>
                                    )}
                                </div>

                                {/* Technical Details */}
                                <div className="grid grid-cols-2 gap-4 pb-4">
                                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1 border border-white/5 group-hover:border-yellow-400/10 transition-colors">
                                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Temps de prép</span>
                                        <div className="text-white font-black text-sm flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-yellow-500" />
                                            15-20 MIN
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1 border border-white/5 group-hover:border-yellow-400/10 transition-colors">
                                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Popularité</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex justify-between items-center mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Prix Signature</span>
                                        <div className="text-4xl font-black text-white italic">
                                            {item.price && typeof item.price === 'object' ? item.price.xl : item.price}
                                            <span className="text-lg text-yellow-400 not-italic ml-1">DT</span>
                                        </div>
                                    </div>
                                    <Link
                                        href="/menu"
                                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all shadow-xl shadow-yellow-400/20 group-active:scale-90"
                                    >
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="text-center pt-12">
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-4 text-yellow-400 font-black uppercase text-xs tracking-[0.4em] hover:text-white transition-all group"
                    >
                        <span>Découvrir l'intégralité du menu</span>
                        <div className="w-12 h-px bg-yellow-400 group-hover:w-20 transition-all"></div>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
