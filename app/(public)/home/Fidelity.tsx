import { ArrowRight, Gift, Trophy } from "lucide-react";
import Link from "next/link";

export default function Fidelity() {
    return (
        <section className="py-20 px-4 bg-black relative overflow-hidden">
            {/* Background Signature Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-yellow-400/5 blur-[150px] pointer-events-none animate-pulse"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="bg-gradient-to-br from-gray-950 to-black rounded-[4rem] border border-white/5 p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 group shadow-3xl">
                    <div className="flex flex-col lg:flex-row items-center gap-10 text-center lg:text-left">
                        <div className="w-20 h-40 bg-yellow-400 rounded-full flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(250,204,21,0.3)] animate-float relative overflow-hidden group-hover:scale-105 transition-transform duration-700 flex-shrink-0">
                            <Trophy className="w-12 h-12 text-gray-900 fill-gray-900/10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-yellow-400 font-black text-[10px] uppercase tracking-[0.3em] italic">
                                <Gift className="w-3.5 h-3.5" />
                                Mato's Privilege Club
                            </div>
                            <h2 className="text-4xl md:text-6xl font-[1000] text-white italic uppercase tracking-tighter leading-none">
                                Gagnez plus qu'un <br />
                                <span className="text-yellow-400">Simple Repas</span>
                            </h2>
                            <p className="text-gray-500 font-bold text-base md:text-lg italic uppercase tracking-wider leading-relaxed">
                                Cumulez des points à chaque commande et débloquez des avantages exclusifs. <span className="text-yellow-400">10 points offerts à l'inscription.</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <Link
                            href="/fidelity"
                            className="relative group/btn bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-12 py-6 rounded-[2rem] font-black text-xl transition-all shadow-3xl active:scale-95 flex items-center justify-center gap-4 overflow-hidden"
                        >
                            <span className="relative z-10 uppercase tracking-tighter">Découvrir les Paliers</span>
                            <ArrowRight className="relative z-10 w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
