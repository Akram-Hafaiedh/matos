// app/(private)/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Globe, Facebook, Instagram, Video, MessageCircle, Settings, Star, Signal, Activity, Zap, ShieldAlert, Cpu, Loader2, FileText, Plus, Trash2, ChevronRight, Gavel, Users, Shield, Lock, Eye, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/context/ToastContext';

export default function AdminSettingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'social' | 'hero' | 'content' | 'maintenance'>('general');

    // Form state
    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        lat: 36.8391,
        lng: 10.3200,
        facebook: '',
        instagram: '',
        tiktok: '',
        whatsapp: '',
        googleMapsUrl: ''
    });

    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [contentPages, setContentPages] = useState<any[]>([]);
    const [editingPage, setEditingPage] = useState<any>(null);

    useEffect(() => {
        fetchSettings();
        fetchHeroSlides();
        fetchContentPages();
    }, []);

    const fetchHeroSlides = async () => {
        try {
            const res = await fetch('/api/admin/hero-slides');
            const data = await res.json();
            if (res.ok) setHeroSlides(data.slides);
        } catch (error) {
            console.error('Error fetching hero slides:', error);
        }
    };

    const fetchContentPages = async () => {
        try {
            const res = await fetch('/api/admin/content-pages');
            const data = await res.json();
            if (res.ok) setContentPages(data.pages);
        } catch (error) {
            console.error('Error fetching content pages:', error);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();

            if (res.ok) {
                setFormData({
                    address: data.address || '',
                    phone: data.phone || '',
                    lat: data.lat || 36.8391,
                    lng: data.lng || 10.3200,
                    facebook: data.facebook || '',
                    instagram: data.instagram || '',
                    tiktok: data.tiktok || '',
                    whatsapp: data.whatsapp || '',
                    googleMapsUrl: data.googleMapsUrl || ''
                });
            } else {
                toast.error('Erreur lors du chargement des paramètres');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (activeTab === 'general') {
            if (!formData.address.trim() || !formData.phone.trim()) {
                toast.error('L\'adresse et le téléphone sont obligatoires');
                return;
            }
        }

        setSaving(true);

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Paramètres synchronisés avec succès');
                router.refresh();
            } else {
                toast.error(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur de connexion');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
                <p className="text-gray-500 font-[1000] uppercase text-[10px] tracking-[0.5em] italic">Accessing System Core...</p>
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'Général', icon: MapPin },
        { id: 'social', label: 'Réseaux Sociaux', icon: MessageCircle },
        { id: 'hero', label: 'Hero Slides', icon: Star },
        { id: 'content', label: 'Contenu Pages', icon: FileText },
        { id: 'maintenance', label: 'Maintenance', icon: Cpu }
    ] as const;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Settings size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">System Configuration Matrix</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Paramètres <span className="text-yellow-400">Système</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Gestion de l'infrastructure et des protocoles MATO'S</p>
                </div>
            </div>

            {/* Tab Navigation Matrix */}
            <div className="flex flex-wrap gap-3 bg-white/[0.02] p-3 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-inner w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] transition-all duration-700 italic border ${activeTab === tab.id
                            ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_10px_40px_rgba(250,204,21,0.15)]'
                            : 'text-gray-600 border-transparent hover:text-white'
                            }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-gray-800 group-hover:text-yellow-400'}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                {activeTab === 'hero' && (
                    <div className="space-y-10">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                                <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Carousel Hero Matrix</h2>
                            </div>
                            <button
                                onClick={() => {
                                    const newSlide = { id: Date.now(), title: 'Nouveau Slide', subtitle: 'Subtitle', tagline: 'Tagline', image_url: '', accent: 'from-yellow-400 to-orange-600', order: heroSlides.length + 1, is_active: true, isNew: true };
                                    setHeroSlides([...heroSlides, newSlide]);
                                }}
                                className="bg-white/5 hover:bg-yellow-400 hover:text-black text-white px-6 py-3 rounded-2xl font-[1000] text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 border border-white/10"
                            >
                                <Plus size={14} /> Nouveau Slide
                            </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                            {heroSlides.map((slide, index) => (
                                <div key={slide.id} className="bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl space-y-8 relative group">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400 font-black italic">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-[1000] uppercase italic tracking-tight">{slide.title || 'Sans Titre'}</h3>
                                                <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Priority Node: {slide.order}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (slide.isNew) {
                                                    setHeroSlides(heroSlides.filter(s => s.id !== slide.id));
                                                    return;
                                                }
                                                if (confirm('Supprimer ce slide ?')) {
                                                    const res = await fetch(`/api/admin/hero-slides?id=${slide.id}`, { method: 'DELETE' });
                                                    if (res.ok) {
                                                        toast.success('Slide supprimé');
                                                        fetchHeroSlides();
                                                    }
                                                }
                                            }}
                                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-2">Titre Principal</label>
                                            <input
                                                type="text"
                                                value={slide.title}
                                                onChange={(e) => {
                                                    const newSlides = [...heroSlides];
                                                    newSlides[index].title = e.target.value;
                                                    setHeroSlides(newSlides);
                                                }}
                                                className="w-full bg-black/40 border border-white/5 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs placeholder:text-gray-900"
                                                placeholder="TITRE..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-2">Sous-titre (Badge)</label>
                                            <input
                                                type="text"
                                                value={slide.subtitle}
                                                onChange={(e) => {
                                                    const newSlides = [...heroSlides];
                                                    newSlides[index].subtitle = e.target.value;
                                                    setHeroSlides(newSlides);
                                                }}
                                                className="w-full bg-black/40 border border-white/5 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs placeholder:text-gray-900"
                                                placeholder="SUBTITLE..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-2">Tagline (Description)</label>
                                        <textarea
                                            value={slide.tagline}
                                            onChange={(e) => {
                                                const newSlides = [...heroSlides];
                                                newSlides[index].tagline = e.target.value;
                                                setHeroSlides(newSlides);
                                            }}
                                            className="w-full bg-black/40 border border-white/5 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs min-h-[80px] placeholder:text-gray-900"
                                            placeholder="TAGLINE..."
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-2">Image URL</label>
                                            <input
                                                type="text"
                                                value={slide.image_url}
                                                onChange={(e) => {
                                                    const newSlides = [...heroSlides];
                                                    newSlides[index].image_url = e.target.value;
                                                    setHeroSlides(newSlides);
                                                }}
                                                className="w-full bg-black/40 border border-white/5 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs placeholder:text-gray-900"
                                                placeholder="/path/to/image.png"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-2">Accent Gradient</label>
                                            <input
                                                type="text"
                                                value={slide.accent}
                                                onChange={(e) => {
                                                    const newSlides = [...heroSlides];
                                                    newSlides[index].accent = e.target.value;
                                                    setHeroSlides(newSlides);
                                                }}
                                                className="w-full bg-black/40 border border-white/5 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                                placeholder="from-yellow-400 to-orange-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex-1 flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={slide.is_active}
                                                onChange={(e) => {
                                                    const newSlides = [...heroSlides];
                                                    newSlides[index].is_active = e.target.checked;
                                                    setHeroSlides(newSlides);
                                                }}
                                                className="accent-yellow-400"
                                            />
                                            <span className="text-[10px] text-gray-500 font-bold uppercase italic tracking-widest">Actif</span>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                setSaving(true);
                                                try {
                                                    const method = slide.isNew ? 'POST' : 'PUT';
                                                    const res = await fetch('/api/admin/hero-slides', {
                                                        method,
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(slide)
                                                    });
                                                    if (res.ok) {
                                                        toast.success('Slide synchronisé');
                                                        fetchHeroSlides();
                                                    }
                                                } finally {
                                                    setSaving(false);
                                                }
                                            }}
                                            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-[1000] text-[10px] uppercase tracking-widest hover:bg-white transition-all active:scale-95"
                                        >
                                            {saving ? '...' : 'Commit'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="space-y-10">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-1 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                            <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Static Content Manager</h2>
                        </div>

                        {!editingPage ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                            <ChevronRight className="text-gray-800 group-hover:text-yellow-400 group-hover:translate-x-4 transition-all duration-700 w-12 h-12" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-700">
                                <button
                                    onClick={() => setEditingPage(null)}
                                    className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] italic"
                                >
                                    <ArrowLeft size={12} /> Retour à la liste
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
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-[1000] text-white uppercase italic tracking-tighter">Sections Matrix</h3>
                                            <button
                                                onClick={() => {
                                                    const newSections = [...editingPage.content, { icon: 'Users', title: 'Nouvelle Section', content: 'Contenu...' }];
                                                    setEditingPage({ ...editingPage, content: newSections });
                                                }}
                                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                                            >
                                                <Plus size={16} className="text-yellow-400" />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {(editingPage.content as any[]).map((section, sIndex) => (
                                                <div key={sIndex} className="p-8 rounded-[2rem] bg-black/40 border border-white/5 space-y-6 group/sec relative">
                                                    <button
                                                        onClick={() => {
                                                            const newSections = editingPage.content.filter((_: any, i: number) => i !== sIndex);
                                                            setEditingPage({ ...editingPage, content: newSections });
                                                        }}
                                                        className="absolute -top-3 -right-3 p-3 bg-red-500 rounded-xl opacity-0 group-hover/sec:opacity-100 transition-all hover:scale-110"
                                                    >
                                                        <Trash2 size={12} className="text-white" />
                                                    </button>

                                                    <div className="grid md:grid-cols-4 gap-6">
                                                        <div className="space-y-3">
                                                            <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic ml-2">Icon Logic</label>
                                                            <select
                                                                value={section.icon}
                                                                onChange={(e) => {
                                                                    const newContent = [...editingPage.content];
                                                                    newContent[sIndex].icon = e.target.value;
                                                                    setEditingPage({ ...editingPage, content: newContent });
                                                                }}
                                                                className="w-full bg-gray-950 border border-white/5 text-white px-4 py-3 rounded-xl font-bold text-[10px] focus:outline-none focus:border-yellow-400/50"
                                                            >
                                                                {['Users', 'CreditCard', 'Truck', 'Gavel', 'Shield', 'Lock', 'Eye', 'FileText', 'ShieldAlert', 'Zap'].map(icon => (
                                                                    <option key={icon} value={icon}>{icon}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-3 space-y-3">
                                                            <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic ml-2">Section Title</label>
                                                            <input
                                                                type="text"
                                                                value={section.title}
                                                                onChange={(e) => {
                                                                    const newContent = [...editingPage.content];
                                                                    newContent[sIndex].title = e.target.value;
                                                                    setEditingPage({ ...editingPage, content: newContent });
                                                                }}
                                                                className="w-full bg-gray-950 border border-white/5 text-white px-6 py-3 rounded-xl font-bold text-xs focus:outline-none focus:border-yellow-400/50"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic ml-2">Section Content Body</label>
                                                        <textarea
                                                            value={section.content}
                                                            onChange={(e) => {
                                                                const newContent = [...editingPage.content];
                                                                newContent[sIndex].content = e.target.value;
                                                                setEditingPage({ ...editingPage, content: newContent });
                                                            }}
                                                            className="w-full bg-gray-950 border border-white/5 text-white px-6 py-4 rounded-xl font-bold text-xs focus:outline-none focus:border-yellow-400/50 min-h-[100px]"
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
                                        {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                                        Update Page Content
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'social' && (
                    <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                            <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Présence Sociale Matrix</h2>
                        </div>
                        <div className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl space-y-8 shadow-3xl">
                            {[
                                { name: 'facebook', icon: Facebook, label: 'Facebook', color: 'blue-500', placeholder: 'https://facebook.com/matos' },
                                { name: 'instagram', icon: Instagram, label: 'Instagram', color: 'pink-500', placeholder: 'https://instagram.com/matos' },
                                { name: 'tiktok', icon: Video, label: 'TikTok', color: 'white', placeholder: 'https://tiktok.com/@matos' },
                                { name: 'whatsapp', icon: MessageCircle, label: 'WhatsApp Number', color: 'green-500', placeholder: '21620123456' }
                            ].map((social) => (
                                <div key={social.name} className="space-y-4">
                                    <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">{social.label}</label>
                                    <div className="relative group">
                                        <social.icon className={`absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-800 transition-colors group-focus-within:text-yellow-400`} />
                                        <input
                                            type="text"
                                            name={social.name}
                                            value={(formData as any)[social.name]}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/5 text-white pl-18 pr-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-900"
                                            placeholder={`${social.label.toUpperCase()} LINK...`}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="submit" disabled={saving}
                                className="w-full bg-yellow-400 hover:bg-white text-black px-10 py-6 rounded-[2.5rem] font-[1000] text-xs uppercase tracking-[0.4em] italic transition-all duration-700 shadow-[0_20px_50px_rgba(250,204,21,0.15)] flex items-center justify-center gap-6 active:scale-95 group mt-6"
                            >
                                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                                Sync Social Nodes
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'maintenance' && (
                    <div className="space-y-10 max-w-4xl">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-1 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)]"></div>
                            <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Maintenance & System Integrity</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-10">
                            <div className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl group hover:border-yellow-400/20 transition-all duration-700 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5">
                                    <Activity size={120} />
                                </div>
                                <div className="flex flex-col xl:flex-row items-center justify-between gap-12 relative z-10">
                                    <div className="flex items-center gap-10">
                                        <div className="w-24 h-24 bg-yellow-400/5 rounded-[2.5rem] border border-yellow-400/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 group-hover:bg-yellow-400/10 transition-all duration-700">
                                            <Star className="w-12 h-12 fill-current" />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-white font-[1000] uppercase text-2xl italic tracking-tighter">Synchronisation Fidélité</h3>
                                            <p className="text-gray-700 font-bold text-[10px] uppercase tracking-[0.2em] italic max-w-sm leading-relaxed">
                                                Attribution des points pour les commandes livrées et activation du bonus de bienvenue rétrospectif.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!confirm('Voulez-vous vraiment lancer la synchronisation globale des points de fidélité ?')) return;
                                            try {
                                                const res = await fetch('/api/admin/loyalty/retroactive', { method: 'POST' });
                                                const data = await res.json();
                                                if (data.success) {
                                                    toast.success(data.message);
                                                } else {
                                                    toast.error(data.error);
                                                }
                                            } catch (error) {
                                                toast.error('Erreur lors de la synchronisation');
                                            }
                                        }}
                                        className="bg-black/40 hover:bg-yellow-400 hover:text-black text-yellow-400 px-12 py-6 rounded-[2rem] font-[1000] text-[10px] uppercase tracking-[0.3em] transition-all duration-700 border border-yellow-400/20 hover:border-transparent flex items-center gap-6 shadow-2xl active:scale-95"
                                    >
                                        <Activity className="w-5 h-5" />
                                        Execute Sync
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl opacity-20 grayscale pointer-events-none">
                                <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
                                    <div className="flex items-center gap-10">
                                        <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-gray-700">
                                            <Cpu className="w-12 h-12" />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-white font-[1000] uppercase text-2xl italic tracking-tighter">Nettoyage Cache</h3>
                                            <p className="text-gray-700 font-bold text-[10px] uppercase tracking-[0.2em] italic max-w-sm leading-relaxed">
                                                Optimisation automatique de la base de données et purge des logs système.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-10 py-5 bg-black border border-white/5 rounded-[1.5rem] text-[10px] font-[1000] uppercase tracking-[0.4em] text-gray-800 italic">
                                        Soon Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

