'use client';

import { useState, useEffect } from 'react';
import { FileText, ChevronRight, ArrowLeft, Plus, Trash2, Save, Loader2, Users, Shield, Lock, Eye, CreditCard, Truck, Gavel, ShieldAlert, Zap } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';

export default function ContentSettingsPage() {
    const { toast } = useToast();
    const [contentPages, setContentPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingPage, setEditingPage] = useState<any>(null);

    useEffect(() => {
        fetchContentPages();
    }, []);

    const fetchContentPages = async () => {
        try {
            const res = await fetch('/api/admin/content-pages');
            const data = await res.json();
            if (res.ok) setContentPages(data.pages);
        } catch (error) {
            console.error('Error fetching content pages:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6">
                <div className="w-14 h-1 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Static Content Manager</h2>
            </div>

            {!editingPage ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
                    {contentPages.map(page => (
                        <button
                            key={page.slug}
                            onClick={() => setEditingPage(JSON.parse(JSON.stringify(page)))}
                            className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl hover:border-yellow-400/30 transition-all duration-700 text-left group relative overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-4">
                                    <div className="text-yellow-400 font-[1000] uppercase text-[10px] tracking-[0.4em] italic mb-2">PAGE PROTOCOL</div>
                                    <h3 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">{page.title}</h3>
                                    <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest">SLUG: {page.slug}</p>
                                </div>
                                <ChevronRight className="text-gray-800 group-hover:text-yellow-400 group-hover:translate-x-4 transition-all duration-700 w-12 h-12 opacity-20 group-hover:opacity-100" />
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-700 pb-20">
                    <button
                        onClick={() => setEditingPage(null)}
                        className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] italic group"
                    >
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-yellow-400 group-hover:text-yellow-400 transition-all">
                            <ArrowLeft size={12} />
                        </div>
                        Retour à la liste
                    </button>

                    <div className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl space-y-12">
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Titre de la Page</label>
                                <input
                                    type="text"
                                    value={editingPage.title}
                                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Sous-titre / Intro</label>
                                <input
                                    type="text"
                                    value={editingPage.subtitle}
                                    onChange={(e) => setEditingPage({ ...editingPage, subtitle: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-4">
                                <h3 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter">Sections Matrix</h3>
                                <button
                                    onClick={() => {
                                        const newSections = [...editingPage.content, { icon: 'Users', title: 'Nouvelle Section', content: 'Contenu...' }];
                                        setEditingPage({ ...editingPage, content: newSections });
                                    }}
                                    className="px-6 py-3 bg-white/5 hover:bg-yellow-400 hover:text-black rounded-xl transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                                >
                                    <Plus size={14} /> Add Block
                                </button>
                            </div>

                            <div className="space-y-8">
                                {(editingPage.content as any[]).map((section, sIndex) => (
                                    <div key={sIndex} className="p-10 rounded-[3rem] bg-black/40 border border-white/5 space-y-8 group/sec relative hover:border-white/10 transition-all">
                                        <button
                                            onClick={() => {
                                                const newSections = editingPage.content.filter((_: any, i: number) => i !== sIndex);
                                                setEditingPage({ ...editingPage, content: newSections });
                                            }}
                                            className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 rounded-xl opacity-0 group-hover/sec:opacity-100 transition-all hover:scale-110 flex items-center justify-center shadow-2xl z-10"
                                        >
                                            <Trash2 size={14} className="text-white" />
                                        </button>

                                        <div className="grid md:grid-cols-4 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic ml-4">Icon Logic</label>
                                                <select
                                                    value={section.icon}
                                                    onChange={(e) => {
                                                        const newContent = [...editingPage.content];
                                                        newContent[sIndex].icon = e.target.value;
                                                        setEditingPage({ ...editingPage, content: newContent });
                                                    }}
                                                    className="w-full bg-gray-950 border border-white/5 text-white px-6 py-4 rounded-2xl font-bold text-[10px] focus:outline-none focus:border-yellow-400/50 appearance-none italic"
                                                >
                                                    {['Users', 'CreditCard', 'Truck', 'Gavel', 'Shield', 'Lock', 'Eye', 'FileText', 'ShieldAlert', 'Zap'].map(icon => (
                                                        <option key={icon} value={icon}>{icon}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="md:col-span-3 space-y-3">
                                                <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic ml-4">Section Title</label>
                                                <input
                                                    type="text"
                                                    value={section.title}
                                                    onChange={(e) => {
                                                        const newContent = [...editingPage.content];
                                                        newContent[sIndex].title = e.target.value;
                                                        setEditingPage({ ...editingPage, content: newContent });
                                                    }}
                                                    className="w-full bg-gray-950 border border-white/5 text-white px-8 py-4 rounded-2xl font-bold text-xs focus:outline-none focus:border-yellow-400/50 uppercase italic"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic ml-4">Section Content Body</label>
                                            <textarea
                                                value={section.content}
                                                onChange={(e) => {
                                                    const newContent = [...editingPage.content];
                                                    newContent[sIndex].content = e.target.value;
                                                    setEditingPage({ ...editingPage, content: newContent });
                                                }}
                                                className="w-full bg-gray-950 border border-white/5 text-white px-8 py-6 rounded-[2rem] font-bold text-xs focus:outline-none focus:border-yellow-400/50 min-h-[150px] leading-relaxed"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={async () => {
                                setSaving(true);
                                try {
                                    const res = await fetch('/api/admin/content-pages', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(editingPage)
                                    });
                                    if (res.ok) {
                                        toast.success('Contenu synchronisé');
                                        fetchContentPages();
                                        setEditingPage(null);
                                    }
                                } finally {
                                    setSaving(false);
                                }
                            }}
                            disabled={saving}
                            className="w-full bg-yellow-400 hover:bg-white text-black px-12 py-8 rounded-[2.5rem] font-[1000] text-xs uppercase tracking-[0.4em] italic transition-all duration-700 shadow-[0_20px_50px_rgba(250,204,21,0.15)] flex items-center justify-center gap-6 active:scale-95 group"
                        >
                            {saving ? <Loader2 className="animate-spin w-5 h-5 text-black" /> : <Save className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                            Sync Page Protocol
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
