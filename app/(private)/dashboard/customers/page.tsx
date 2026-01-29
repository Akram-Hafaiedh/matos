// app/admin/customers/page.tsx
'use client';

import { Users } from 'lucide-react';

export default function AdminCustomersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-5xl font-black text-white mb-2">
                    <span className="text-yellow-400">Clients</span>
                </h1>
                <p className="text-gray-400">Gérez votre base de clients</p>
            </div>

            <div className="bg-gray-800 rounded-2xl p-12 border-2 border-gray-700 text-center">
                <Users className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white mb-2">Bientôt disponible</h2>
                <p className="text-gray-400">
                    La gestion des clients sera disponible prochainement
                </p>
            </div>
        </div>
    );
}