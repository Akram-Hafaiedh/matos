'use client';

import { useEffect, useState } from 'react';
import {
    Mail,
    Save,
    Send,
    Shield,
    Server,
    Lock,
    ChevronRight,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import TacticalAura from '@/components/TacticalAura';
import { motion } from 'framer-motion';

export default function EmailSettingsPage() {
    const [config, setConfig] = useState<any>({
        host: '',
        port: 587,
        user: '',
        password: '',
        from_email: '',
        from_name: 'Mato\'s',
        encryption: 'TLS'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/email/config');
            const data = await res.json();
            if (data) setConfig(data);
        } catch (error) {
            console.error('Error fetching email config:', error);
            toast.error('Erreur lors du chargement de la configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/email/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                toast.success('Configuration enregistrée');
            } else {
                toast.error('Erreur d\'enregistrement');
            }
        } catch (error) {
            console.error('Error saving email config:', error);
            toast.error('Erreur de connexion');
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        if (!testEmail) {
            toast.error('Entrez un email pour le test');
            return;
        }
        setTesting(true);
        try {
            const res = await fetch('/api/admin/email/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: testEmail })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Email de test envoyé avec succès');
            } else {
                toast.error(data.error || 'Échec du test');
            }
        } catch (error) {
            console.error('Error testing email:', error);
            toast.error('Erreur de connexion lors du test');
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] italic">Synchronisation des protocoles SMTP...</p>
            </div>
        );
    }

    return (
        <div className="w-full pb-20 space-y-12 animate-in fade-in duration-700">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Main Config Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.02] rounded-[4rem] border border-white/10 p-12 space-y-10 relative overflow-hidden group shadow-3xl"
                >
                    <TacticalAura />
                    <form onSubmit={handleSave} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Serveur SMTP</label>
                                <div className="relative">
                                    <Server className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                    <input
                                        type="text"
                                        value={config.host}
                                        onChange={(e) => setConfig({ ...config, host: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 pl-14 pr-6 py-5 rounded-2xl text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                        placeholder="smtp.example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Port</label>
                                <input
                                    type="number"
                                    value={config.port}
                                    onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                                    className="w-full bg-black/40 border border-white/5 px-6 py-5 rounded-2xl text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    placeholder="587"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Utilisateur / Email</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                <input
                                    type="text"
                                    value={config.user}
                                    onChange={(e) => setConfig({ ...config, user: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 pl-14 pr-6 py-5 rounded-2xl text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    placeholder="user@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                <input
                                    type="password"
                                    value={config.password}
                                    onChange={(e) => setConfig({ ...config, password: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 pl-14 pr-6 py-5 rounded-2xl text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Email d'expédition</label>
                                <input
                                    type="email"
                                    value={config.from_email}
                                    onChange={(e) => setConfig({ ...config, from_email: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 px-6 py-5 rounded-2xl text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    placeholder="hello@matos.tn"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Nom d'expédition</label>
                                <input
                                    type="text"
                                    value={config.from_name}
                                    onChange={(e) => setConfig({ ...config, from_name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 px-6 py-5 rounded-2xl text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    placeholder="Mato's"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-yellow-400 hover:bg-white text-black py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                            Enregistrer la Configuration
                        </button>
                    </form>
                </motion.div>

                {/* Test Panel */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#0a0a0a] border border-white/5 p-12 rounded-[3.5rem] space-y-8"
                    >
                        <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-400 border border-yellow-400/20">
                            <Send className="w-8 h-8" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">Diagnostic SMTP</h3>
                            <p className="font-bold text-gray-500 uppercase tracking-wide text-[10px] leading-relaxed italic">
                                Envoyez un email de test pour valider l'intégrité de votre passerelle SMTP avant la mise en production.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4">
                            <input
                                type="email"
                                placeholder="Email de destination..."
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 px-8 py-6 rounded-2xl text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest"
                            />
                            <button
                                onClick={handleTest}
                                disabled={testing}
                                className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-4 hover:bg-yellow-400 group"
                            >
                                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                Exécuter le Diagnostic
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-yellow-400 p-10 rounded-[3rem] text-black shadow-3xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <AlertCircle size={24} />
                            <h4 className="text-xl font-[1000] uppercase italic tracking-tighter">Information Sécurité</h4>
                        </div>
                        <p className="font-bold uppercase tracking-wider text-[9px] leading-loose opacity-80">
                            Vos identifiants SMTP sont stockés de manière sécurisée dans la base de données.
                            Pour Gmail, utilisez un "Mot de passe d'application" plutôt que votre mot de passe principal.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
