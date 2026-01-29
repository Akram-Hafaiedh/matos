// app/admin/settings/page.tsx
'use client';

import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-5xl font-black text-white mb-2">
                    <span className="text-yellow-400">Paramètres</span>
                </h1>
                <p className="text-gray-400">Configurez votre restaurant</p>
            </div>

            <div className="bg-gray-800 rounded-2xl p-12 border-2 border-gray-700 text-center">
                <Settings className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white mb-2">Bientôt disponible</h2>
                <p className="text-gray-400">
                    Les paramètres seront disponibles prochainement
                </p>
            </div>
        </div>
    );
}