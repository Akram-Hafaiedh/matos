// app/admin/customers/page.tsx
'use client';

import { Users } from 'lucide-react';

export default function AdminCustomersPage() {
    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter">
                    Gestion <span className="text-yellow-400">Clients</span>
                </h1>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest text-sm">Gérez votre base de clients et fidélité</p>
            </div>

            {/* Placeholder Card */}
            <div className="bg-gray-900/40 p-20 rounded-[3rem] border border-gray-800 backdrop-blur-3xl shadow-3xl text-center flex flex-col items-center justify-center gap-8">
                <div className="bg-gray-950 p-12 rounded-full border border-gray-800 shadow-inner">
                    <Users className="w-20 h-20 text-gray-700" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-widest mb-4">Bientôt disponible</h2>
                    <p className="text-gray-500 font-bold max-w-md mx-auto">
                        Le module de gestion des clients et du programme de fidélité est en cours de développement. Restez à l'écoute !
                    </p>
                </div>

                <div className="w-24 h-1 bg-yellow-400/20 rounded-full"></div>
            </div>
        </div>
    );
}