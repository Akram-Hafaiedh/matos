'use client';

import { useState, useEffect } from 'react';
import {
    Trophy, ShoppingBag, Plus, Search, Filter,
    MoreVertical, Edit2, Trash2, CheckCircle2, XCircle,
    Loader2, Zap, Shield, Sparkles, Wand2, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/app/context/ToastContext';
import TacticalAura from '@/components/TacticalAura';

export default function AdminLoyaltyPage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'quests' | 'shop'>('quests');
    const [quests, setQuests] = useState<any[]>([]);
    const [shopItems, setShopItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [questsRes, shopRes] = await Promise.all([
                fetch('/api/admin/loyalty/quests'),
                fetch('/api/admin/loyalty/shop')
            ]);

            const questsData = await questsRes.json();
            const shopData = await shopRes.json();

            if (questsData.success) setQuests(questsData.quests);
            if (shopData.success) setShopItems(shopData.items);
        } catch (error) {
            toast.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({ ...item });
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setFormData(activeTab === 'quests' ? { type: 'ONE_OFF', reward_type: 'TOKEN', reward_amount: 50, min_act: 1 } : { type: 'Auras', price: 1000, rarity: 'Common', act: 1, level: 1 });
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        const endpoint = activeTab === 'quests'
            ? (editingItem ? `/api/admin/loyalty/quests/${editingItem.id}` : '/api/admin/loyalty/quests')
            : (editingItem ? `/api/admin/loyalty/shop/${editingItem.id}` : '/api/admin/loyalty/shop');

        try {
            const res = await fetch(endpoint, {
                method: editingItem ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(editingItem ? 'Mis à jour avec succès' : 'Créé avec succès');
                setShowModal(false);
                fetchData();
            } else {
                toast.error(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            toast.error('Erreur technique');
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (type: 'quest' | 'shop', id: string, currentStatus: boolean) => {
        const endpoint = type === 'quest' ? `/api/admin/loyalty/quests/${id}` : `/api/admin/loyalty/shop/${id}`;
        try {
            const res = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Statut mis à jour');
                fetchData();
            }
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const deleteItem = async (type: 'quest' | 'shop', id: string) => {
        if (!confirm('Voulez-vous vraiment supprimer cet élément ?')) return;

        const endpoint = type === 'quest' ? `/api/admin/loyalty/quests/${id}` : `/api/admin/loyalty/shop/${id}`;
        try {
            const res = await fetch(endpoint, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Supprimé avec succès');
                fetchData();
            }
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    if (!isMounted) return null;

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20 p-4 md:p-8 relative">
            <TacticalAura opacity={0.2} />

            {/* Header section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Star size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Loyalty Protocol Management</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Matos <span className="text-yellow-400">Elite</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Configuration des récompenses, quêtes et loot</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group w-64 md:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="RECHERCHER..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-4 rounded-2xl font-black focus:outline-none focus:border-yellow-400/50 transition-all text-[10px] uppercase italic tracking-widest placeholder:text-gray-800"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-[0_15px_30px_rgba(250,204,21,0.2)]"
                    >
                        <Plus size={14} strokeWidth={3} />
                        Nouveau
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 relative z-10">
                <button
                    onClick={() => setActiveTab('quests')}
                    className={`px-10 py-5 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] italic transition-all border ${activeTab === 'quests' ? 'bg-white text-black border-white' : 'bg-black/40 text-gray-500 border-white/5 hover:border-white/10'}`}
                >
                    <div className="flex items-center gap-4">
                        <Trophy size={16} />
                        Quêtes Tactiques
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('shop')}
                    className={`px-10 py-5 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] italic transition-all border ${activeTab === 'shop' ? 'bg-white text-black border-white' : 'bg-black/40 text-gray-500 border-white/5 hover:border-white/10'}`}
                >
                    <div className="flex items-center gap-4">
                        <ShoppingBag size={16} />
                        Loot & Shop
                    </div>
                </button>
            </div>

            {/* Content Table */}
            <div className="bg-white/[0.01] rounded-[4rem] border border-white/5 backdrop-blur-3xl overflow-hidden shadow-3xl relative z-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-12 py-8 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] italic">Détails</th>
                                <th className="px-12 py-8 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] italic">Statistiques</th>
                                <th className="px-12 py-8 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] italic">Récompense / Prix</th>
                                <th className="px-12 py-8 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] italic">Statut</th>
                                <th className="px-12 py-8 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] italic text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-12 py-10 h-32 bg-white/[0.005]"></td>
                                    </tr>
                                ))
                            ) : activeTab === 'quests' ? (
                                quests.filter(q => q.title.toLowerCase().includes(search.toLowerCase())).map((quest) => (
                                    <tr key={quest.id} className="group hover:bg-white/[0.01] transition-all duration-500">
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-black rounded-3xl border border-white/10 flex items-center justify-center text-3xl transition-transform group-hover:scale-110">
                                                    {quest.emoji || (quest.type === 'COLLECTION' ? '🎯' : quest.type === 'SPEND' ? '💰' : quest.type === 'TIME' ? '⏳' : '⚡')}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-white font-[1000] text-xl italic uppercase tracking-tighter truncate max-w-xs">{quest.title}</div>
                                                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-none line-clamp-1">{quest.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="space-y-2">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">TYPE: {quest.type}</div>
                                                <div className="text-[10px] font-black text-yellow-500/60 uppercase tracking-widest italic">ACTE MIN: {quest.min_act}</div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="px-6 py-3 bg-yellow-400/5 border border-yellow-400/10 rounded-2xl w-fit">
                                                <span className="text-yellow-400 font-black italic text-sm">{quest.reward_amount} {quest.reward_type}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <button
                                                onClick={() => toggleStatus('quest', quest.id, quest.is_active)}
                                                className={`flex items-center gap-2 px-6 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] italic transition-all ${quest.is_active ? 'border-green-500/20 bg-green-500/5 text-green-500' : 'border-red-500/20 bg-red-500/5 text-red-500'}`}
                                            >
                                                {quest.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {quest.is_active ? 'ACTIF' : 'INACTIF'}
                                            </button>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => handleEdit(quest)}
                                                    className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white hover:border-yellow-400 transition-all hover:scale-110"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteItem('quest', quest.id)}
                                                    className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500 transition-all hover:text-white hover:scale-110"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                shopItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map((item) => (
                                    <tr key={item.id} className="group hover:bg-white/[0.01] transition-all duration-500">
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-black rounded-3xl border border-white/10 flex items-center justify-center text-3xl transition-transform group-hover:scale-110">
                                                    {item.emoji || '💎'}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-white font-[1000] text-xl italic uppercase tracking-tighter">{item.name}</div>
                                                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.type}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="space-y-2">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">RARETÉ: {item.rarity}</div>
                                                <div className="text-[10px] font-black text-yellow-500/60 uppercase tracking-widest italic">REQUIS: ACTE {item.act} • NV. {item.level}</div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="px-6 py-3 bg-yellow-400/5 border border-yellow-400/10 rounded-2xl w-fit">
                                                <span className="text-yellow-400 font-black italic text-sm">{item.price} JTN</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <button
                                                onClick={() => toggleStatus('shop', item.id, item.is_active)}
                                                className={`flex items-center gap-2 px-6 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] italic transition-all ${item.is_active ? 'border-green-500/20 bg-green-500/5 text-green-500' : 'border-red-500/20 bg-red-500/5 text-red-500'}`}
                                            >
                                                {item.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {item.is_active ? 'DISPONIBLE' : 'ARCHIVÉ'}
                                            </button>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white hover:border-yellow-400 transition-all hover:scale-110"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteItem('shop', item.id)}
                                                    className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500 transition-all hover:text-white hover:scale-110"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modals for Create/Edit */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 overflow-hidden shadow-2xl"
                        >
                            <TacticalAura opacity={0.1} />

                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-2">
                                            {editingItem ? 'Modifier' : 'Nouveau'} <span className="text-yellow-400">{activeTab === 'quests' ? 'Protocole' : 'Loot'}</span>
                                        </h3>
                                        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em] italic">Configuration de l'entrée Matrix</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-all text-gray-500 hover:text-white">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block ml-2">Appellation</label>
                                        <input
                                            type="text"
                                            value={formData.name || formData.title || ''}
                                            onChange={(e) => setFormData({ ...formData, [activeTab === 'quests' ? 'title' : 'name']: e.target.value })}
                                            className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-yellow-400/50 transition-all outline-none italic placeholder:text-gray-800"
                                            placeholder="NOM DE L'ENTITÉ"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block ml-2">Icone / Emoji</label>
                                        <input
                                            type="text"
                                            value={formData.emoji || ''}
                                            onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                                            className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-yellow-400/50 transition-all outline-none italic placeholder:text-gray-800"
                                            placeholder="EMOJI"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block ml-2">Description Tactique</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-yellow-400/50 transition-all outline-none italic min-h-[100px] placeholder:text-gray-800"
                                            placeholder="DÉTAILS DES OBJECTIFS..."
                                        />
                                    </div>

                                    {activeTab === 'quests' ? (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block ml-2">Type</label>
                                                <select
                                                    value={formData.type || 'ONE_OFF'}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                    className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:border-yellow-400/50 transition-all outline-none italic"
                                                >
                                                    <option value="TIME">TIME</option>
                                                    <option value="STREAK">STREAK</option>
                                                    <option value="COLLECTION">COLLECTION</option>
                                                    <option value="SOCIAL">SOCIAL</option>
                                                    <option value="ONE_OFF">ONE_OFF</option>
                                                    <option value="SPEND">SPEND</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block ml-2">Récompense (XP/TOKEN)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        value={formData.reward_amount || ''}
                                                        onChange={(e) => setFormData({ ...formData, reward_amount: e.target.value })}
                                                        className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-yellow-400/50 transition-all outline-none italic"
                                                    />
                                                    <select
                                                        value={formData.reward_type || 'TOKEN'}
                                                        onChange={(e) => setFormData({ ...formData, reward_type: e.target.value })}
                                                        className="w-32 bg-black border border-white/5 rounded-2xl px-4 py-4 text-[10px] font-black text-yellow-400 focus:border-yellow-400/50 transition-all outline-none"
                                                    >
                                                        <option value="TOKEN">JTN</option>
                                                        <option value="XP">XP</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block ml-2">Prix (Tokens)</label>
                                                <input
                                                    type="number"
                                                    value={formData.price || ''}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-yellow-400/50 transition-all outline-none italic"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block ml-2">Catégorie</label>
                                                <input
                                                    type="text"
                                                    value={formData.type || ''}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                    className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-yellow-400/50 transition-all outline-none italic placeholder:text-gray-800"
                                                    placeholder="Auras, Frames, etc."
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 bg-yellow-400 text-black py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] italic hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(250,204,21,0.2)] disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                        {editingItem ? 'METTRE À JOUR' : 'GÉNÉRER PROTOCOLE'}
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-10 bg-white/5 border border-white/5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        ANNULER
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
