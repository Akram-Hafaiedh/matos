'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';

export default function HeroSettingsPage() {
    const { toast } = useToast();
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchHeroSlides();
    }, []);

    const fetchHeroSlides = async () => {
        try {
            const res = await fetch('/api/admin/hero-slides');
            const data = await res.json();
            if (res.ok) setHeroSlides(data.slides);
        } catch (error) {
            console.error('Error fetching hero slides:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-20">
                {heroSlides.map((slide, index) => (
                    <div key={slide.id} className="bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl space-y-10 relative group hover:border-yellow-400/20 transition-all duration-700">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4 text-white">
                                <span className="text-4xl font-[1000] italic text-yellow-400 opacity-20">#{index + 1}</span>
                                <div>
                                    <h3 className="text-xl font-[1000] uppercase italic tracking-tight leading-none">{slide.title || 'Sans Titre'}</h3>
                                    <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em] mt-2 italic">Priority Level: {slide.order}</p>
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
                                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-4 italic">Titre de Transmission</label>
                                <input
                                    type="text"
                                    value={slide.title}
                                    onChange={(e) => {
                                        const newSlides = [...heroSlides];
                                        newSlides[index].title = e.target.value;
                                        setHeroSlides(newSlides);
                                    }}
                                    className="w-full bg-black/40 border border-white/5 text-white px-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic"
                                    placeholder="TITRE..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-4 italic">Badge Signal</label>
                                <input
                                    type="text"
                                    value={slide.subtitle}
                                    onChange={(e) => {
                                        const newSlides = [...heroSlides];
                                        newSlides[index].subtitle = e.target.value;
                                        setHeroSlides(newSlides);
                                    }}
                                    className="w-full bg-black/40 border border-white/5 text-white px-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                    placeholder="SUBTITLE..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-4 italic">Manifest Data (Tagline)</label>
                            <textarea
                                value={slide.tagline}
                                onChange={(e) => {
                                    const newSlides = [...heroSlides];
                                    newSlides[index].tagline = e.target.value;
                                    setHeroSlides(newSlides);
                                }}
                                className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs min-h-[100px]"
                                placeholder="DESCRIPTION EFFECT..."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-4 italic">Image Visual Node</label>
                                <input
                                    type="text"
                                    value={slide.image_url}
                                    onChange={(e) => {
                                        const newSlides = [...heroSlides];
                                        newSlides[index].image_url = e.target.value;
                                        setHeroSlides(newSlides);
                                    }}
                                    className="w-full bg-black/40 border border-white/5 text-white px-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                    placeholder="/path/to/image.png"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-4 italic">Accent Chroma (Tailwind)</label>
                                <input
                                    type="text"
                                    value={slide.accent}
                                    onChange={(e) => {
                                        const newSlides = [...heroSlides];
                                        newSlides[index].accent = e.target.value;
                                        setHeroSlides(newSlides);
                                    }}
                                    className="w-full bg-black/40 border border-white/5 text-white px-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                    placeholder="from-yellow-400 to-orange-600"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-4 cursor-pointer group/check">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={slide.is_active}
                                            onChange={(e) => {
                                                const newSlides = [...heroSlides];
                                                newSlides[index].is_active = e.target.checked;
                                                setHeroSlides(newSlides);
                                            }}
                                            className="peer hidden"
                                        />
                                        <div className="w-10 h-6 bg-white/5 rounded-full border border-white/10 peer-checked:bg-yellow-400 transition-all duration-500"></div>
                                        <div className="absolute top-1 left-1 w-4 h-4 bg-white/20 rounded-full peer-checked:left-5 peer-checked:bg-black transition-all duration-500"></div>
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest group-hover/check:text-yellow-400 transition-colors">Visual State: Active</span>
                                </label>
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
                                className="bg-white/5 hover:bg-yellow-400 hover:text-black text-white px-10 py-4 rounded-xl font-[1000] text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 italic border border-white/10"
                            >
                                {saving ? 'Syncing...' : 'Commit Node'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
