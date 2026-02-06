'use client';

import {
    Shield, Palette, Sparkles, Wand2, CheckCircle2, Loader2, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIERS, SHOP_ITEMS } from '@/lib/loyalty';
import TacticalAura from '@/components/TacticalAura';
import { useState, useEffect } from 'react';
import { useToast } from '@/app/context/ToastContext';

export default function WorkshopPage() {
    const { toast } = useToast();
    const [userData, setUserData] = useState<any>(null);
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('🛡️');
    const [selectedFrame, setSelectedFrame] = useState('border-yellow-400');
    const [selectedAura, setSelectedAura] = useState('rgba(250, 204, 21, 0.05)');
    const [selectedTitle, setSelectedTitle] = useState('');

    useEffect(() => {
        Promise.all([
            fetch('/api/user/profile').then(res => res.json()),
            fetch('/api/user/inventory').then(res => res.json())
        ]).then(([profileData, invData]) => {
            if (profileData.success) {
                setUserData(profileData.user);
                setSelectedIcon(profileData.user.image || '🛡️');
                setSelectedFrame(profileData.user.selectedFrame || 'border-yellow-400');
                setSelectedAura(profileData.user.selectedBg || 'rgba(250, 204, 21, 0.05)');
                setSelectedTitle(profileData.user.selectedTitle || '');
            }
            if (invData.success) {
                setInventory(invData.inventory);
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: selectedIcon,
                    selectedFrame: selectedFrame,
                    selectedBg: selectedAura,
                    selectedTitle: selectedTitle
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Identité mise à jour avec succès');
                // Sync header
                window.dispatchEvent(new Event('profile-updated'));
            } else {
                toast.error(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            toast.error('Erreur technique lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">OUVERTURE DE L'ATELIER...</p>
            </div>
        );
    }

    const styleMap: Record<string, { color?: string, borderColor?: string }> = {
        'Neon Pulse': { color: 'rgba(34, 211, 238, 0.1)' },
        'Acid Rain': { color: 'rgba(132, 204, 22, 0.1)' },
        'Digital Ghost': { color: 'rgba(168, 85, 247, 0.1)' },
        'Solar Flare': { color: 'rgba(249, 115, 22, 0.1)' },
        'Void Matter': { color: 'rgba(0, 0, 0, 0.4)' },
        'Steel Wire': { borderColor: 'border-gray-400' },
        'Carbon Fiber': { borderColor: 'border-zinc-800' },
        'Gold Trim': { borderColor: 'border-yellow-600' },
        'Plasma Glow': { borderColor: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' },
        'Reality Glitch': { borderColor: 'border-cyan-400 animate-pulse' }
    };

    const baseAuras = [
        { name: 'Yellow Pulsar', color: 'rgba(250, 204, 21, 0.05)' },
        { name: 'Cyan Ghost', color: 'rgba(34, 211, 238, 0.05)' },
        { name: 'Void Matter', color: 'rgba(168, 85, 247, 0.05)' },
        { name: 'Crimson Data', color: 'rgba(239, 68, 68, 0.05)' },
    ];

    const unlockedAuras = inventory
        .filter(item => item.type === 'Auras')
        .map(item => ({
            name: item.name,
            color: styleMap[item.name]?.color || 'rgba(255,255,255,0.05)'
        }));

    const allAuras = [...baseAuras, ...unlockedAuras];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full grid lg:grid-cols-12 gap-12 relative z-10"
        >
            <TacticalAura color={selectedAura} opacity={0.5} />

            {/* Left Column: PREVIEW */}
            <div className="lg:col-span-5 space-y-12">
                <div className="sticky top-12 space-y-12">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[5rem] p-16 space-y-12 relative overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.6)] text-center">
                        <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>

                        <div className="relative">
                            <div className={`w-56 h-56 rounded-[4rem] bg-gradient-to-br from-white/[0.05] to-white/[0.01] border-8 ${selectedFrame} mx-auto flex items-center justify-center text-8xl shadow-2xl relative transition-all duration-700`}>
                                {selectedIcon}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-black border border-white/10 rounded-full shadow-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
                                        <span className="text-[8px] font-black uppercase text-white tracking-widest italic">Signal Actif</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5">
                                <Wand2 size={12} className="text-yellow-400" />
                                <span className="text-[9px] text-yellow-500 font-black uppercase tracking-[0.4em] italic">Aperçu du Dossier</span>
                            </div>
                            <div className="space-y-1">
                                {selectedTitle && (
                                    <div className="text-[10px] text-yellow-500 font-extrabold uppercase tracking-[0.5em] italic drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                                        {selectedTitle}
                                    </div>
                                )}
                                <h4 className="text-4xl font-[1000] italic uppercase text-white tracking-tighter leading-none">
                                    {userData?.name || 'AGENT'} <span className="text-yellow-400">#742</span>
                                </h4>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-8 bg-yellow-400 text-black rounded-[2.5rem] font-[1000] uppercase text-sm tracking-[0.4em] hover:scale-[1.03] active:scale-95 transition-all shadow-[0_20px_50px_rgba(250,204,21,0.2)] italic flex items-center justify-center gap-6 disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                ENREGISTRER L'IDENTITÉ
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Right Column: CONFIGURATION */}
            <div className="lg:col-span-7 space-y-12">
                <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[4rem] space-y-12 backdrop-blur-xl">
                    {/* ICONOGRAPHY */}
                    <div className="space-y-8">
                        <h5 className="text-xl font-[1000] italic uppercase tracking-tighter flex items-center gap-4 text-white">
                            <Palette size={20} className="text-yellow-400" /> Iconographie
                        </h5>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                            {['🛡️', '🏆', '👑', '💎', '🔥', '⚡', '🤖', '💀', '👽', '🚀', '🎯', '🎰'].map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => setSelectedIcon(emoji)}
                                    className={`w-full aspect-square bg-[#0a0a0a] border rounded-3xl flex items-center justify-center text-3xl transition-all duration-500 hover:scale-110 ${selectedIcon === emoji ? 'border-yellow-400 bg-yellow-400/10 shadow-lg' : 'border-white/5 hover:border-white/20 hover:bg-white/[0.02]'}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ORNAMENTS (Borders) */}
                    <div className="space-y-8">
                        <h5 className="text-xl font-[1000] italic uppercase tracking-tighter flex items-center gap-4 text-white">
                            <Shield size={20} className="text-yellow-400" /> Ornements
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {TIERS.map((tier, index) => {
                                // Determine lock status
                                // Logic: Locked if points too low AND not currently selected (Grandfathered)
                                const isLocked = (userData?.loyaltyPoints || 0) < (tier.min || 0) && selectedFrame !== tier.borderColor;

                                return (
                                    <button
                                        key={tier.name}
                                        onClick={() => !isLocked && setSelectedFrame(tier.borderColor)}
                                        disabled={isLocked}
                                        className={`flex flex-col items-center gap-6 group transition-all duration-500 p-6 rounded-3xl border relative overflow-hidden ${selectedFrame === tier.borderColor
                                            ? 'border-yellow-400 bg-yellow-400/5'
                                            : isLocked
                                                ? 'border-white/5 bg-white/[0.01] opacity-60 cursor-not-allowed'
                                                : 'border-transparent hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-16 h-16 rounded-2xl border-4 ${isLocked ? 'border-gray-800 bg-gray-900' : tier.borderColor} ${!isLocked && `bg-gradient-to-br ${tier.color}`} opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-2xl flex items-center justify-center`}>
                                            {isLocked && <div className="text-gray-600"><Shield size={20} /></div>}
                                        </div>

                                        <div className="flex flex-col items-center gap-1 z-10">
                                            <span className={`text-[9px] font-black uppercase tracking-widest italic transition-colors ${selectedFrame === tier.borderColor ? 'text-white' : isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
                                                {tier.name}
                                            </span>
                                            {isLocked && (
                                                <span className="text-[8px] font-bold uppercase text-red-500 bg-red-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                                                    LOCKED
                                                </span>
                                            )}
                                        </div>

                                        {/* Striped overlay for locked */}
                                        {isLocked && (
                                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                                                backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent 100%)',
                                                backgroundSize: '10px 10px'
                                            }}></div>
                                        )}
                                    </button>
                                );
                            })}

                            {/* Inventory Frames */}
                            {inventory.filter(i => i.type === 'Frames').map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedFrame(styleMap[item.name]?.borderColor || 'border-white')}
                                    className={`flex flex-col items-center gap-6 group transition-all duration-500 p-6 rounded-3xl border relative overflow-hidden ${selectedFrame.includes(styleMap[item.name]?.borderColor?.split(' ')[0] || 'never')
                                        ? 'border-yellow-400 bg-yellow-400/5'
                                        : 'border-transparent hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl border-4 ${styleMap[item.name]?.borderColor || 'border-white'} bg-white/5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-2xl flex items-center justify-center text-xl`}>
                                        ✨
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest italic text-center text-white truncate w-full px-2">
                                        {item.name}
                                    </span >
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* AURAS (Backgrounds) */}
                    <div className="space-y-8 pt-8 border-t border-white/5">
                        <h5 className="text-xl font-[1000] italic uppercase tracking-tighter flex items-center gap-4 text-white">
                            <Sparkles size={20} className="text-yellow-400" /> Atmosphères
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                            {allAuras.map((aura: any) => (
                                <button
                                    key={aura.name}
                                    onClick={() => setSelectedAura(aura.color)}
                                    className={`p-6 rounded-3xl border flex items-center justify-between transition-all duration-500 group ${selectedAura === aura.color ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/5 hover:bg-white/[0.02]'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full blur-md" style={{ backgroundColor: aura.color, opacity: 0.8 }}></div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest italic transition-colors ${selectedAura === aura.color ? 'text-white' : 'text-gray-600'}`}>{aura.name}</span>
                                    </div>
                                    {selectedAura === aura.color && <CheckCircle2 size={16} className="text-yellow-400" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TITLES */}
                    <div className="space-y-8 pt-8 border-t border-white/5">
                        <h5 className="text-xl font-[1000] italic uppercase tracking-tighter flex items-center gap-4 text-white">
                            <Sparkles size={20} className="text-yellow-400" /> Titres Honorifiques
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Default Title */}
                            <button
                                onClick={() => setSelectedTitle('')}
                                className={`p-6 rounded-3xl border flex items-center justify-between transition-all duration-500 group ${selectedTitle === '' ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/5 hover:bg-white/[0.02]'}`}
                            >
                                <span className={`text-[10px] font-black uppercase tracking-widest italic transition-colors ${selectedTitle === '' ? 'text-white' : 'text-gray-600'}`}>SANS TITRE</span>
                                {selectedTitle === '' && <CheckCircle2 size={16} className="text-yellow-400" />}
                            </button>

                            {/* Inventory Titles */}
                            {inventory.filter(i => i.type === 'Titles').map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedTitle(item.name)}
                                    className={`p-6 rounded-3xl border flex items-center justify-between transition-all duration-500 group ${selectedTitle === item.name ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/5 hover:bg-white/[0.02]'}`}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-widest italic transition-colors ${selectedTitle === item.name ? 'text-white' : 'text-gray-600'}`}>{item.name}</span>
                                    {selectedTitle === item.name && <CheckCircle2 size={16} className="text-yellow-400" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
