import { Gift } from "lucide-react";

export default function Loyalty() {
    return (

        <div className="bg-gradient-to-r from-purple-900 via-pink-800 to-red-900 rounded-3xl p-12 text-center border-4 border-yellow-400 shadow-2xl relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10">
                <Gift className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-bounce" />
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                    Programme de Fidélité
                </h2>
                <p className="text-2xl text-white mb-8 max-w-3xl mx-auto">
                    Cumulez des points à chaque commande et débloquez des récompenses exclusives!
                </p>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20 hover:border-yellow-400 transition">
                        <div className="text-4xl mb-4">⭐</div>
                        <h3 className="text-xl font-black text-white mb-2">Bronze</h3>
                        <p className="text-white text-sm mb-3">0-500 points</p>
                        <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-black">
                            5% de réduction
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-400 scale-105 hover:scale-110 transition">
                        <div className="text-4xl mb-4">🌟</div>
                        <h3 className="text-xl font-black text-white mb-2">Argent</h3>
                        <p className="text-white text-sm mb-3">501-1000 points</p>
                        <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-black">
                            10% de réduction
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20 hover:border-yellow-400 transition">
                        <div className="text-4xl mb-4">💎</div>
                        <h3 className="text-xl font-black text-white mb-2">Or</h3>
                        <p className="text-white text-sm mb-3">1001+ points</p>
                        <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-black">
                            15% de réduction
                        </div>
                    </div>
                </div>

                <button className="mt-8 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-10 py-4 rounded-full font-black text-xl transition transform hover:scale-105">
                    Rejoindre le Programme
                </button>
            </div>
        </div>
    )
}