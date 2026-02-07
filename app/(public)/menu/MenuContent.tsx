'use client';

import {
    Flame,
    Minus,
    Plus,
    Search,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    Heart,
    Star,
    Sparkles
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

import { MenuItem } from '@/types/menu';
import { useCart } from '../../cart/CartContext';
import SelectionModal from '@/components/SelectionModal';

interface MenuContentProps {
    initialCategories: any[];
    initialItems: MenuItem[];
    initialTotal: number;
}

export default function MenuContent({ initialCategories, initialItems, initialTotal }: MenuContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { addToCart } = useCart();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Initial State from URL
    const initialCategory = searchParams.get('category') || 'all';
    const initialSearch = searchParams.get('search') || '';
    const initialPage = Number(searchParams.get('page')) || 1;

    // Local State
    const [dbCategories] = useState<any[]>(initialCategories);
    const [dbItems, setDbItems] = useState<MenuItem[]>(initialItems);
    const [isLoading, setIsLoading] = useState(false);

    // UI State
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalItems, setTotalItems] = useState(initialTotal);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Parallax Effects
    const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -30]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

    // Filter Updates
    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newParams = new URLSearchParams(searchParams.toString());
            Object.entries(params).forEach(([name, value]) => {
                if (value === null || value === 'all' || value === '' || (name === 'page' && value === 1)) {
                    newParams.delete(name);
                } else {
                    newParams.set(name, String(value));
                }
            });
            return newParams.toString();
        },
        [searchParams]
    );

    const updateUrl = useCallback((params: Record<string, string | number | null>) => {
        const query = createQueryString(params);
        router.push(pathname + (query ? `?${query}` : ''), { scroll: false });
    }, [createQueryString, pathname, router]);

    // Sync State with URL
    useEffect(() => {
        const cat = searchParams.get('category') || 'all';
        const search = searchParams.get('search') || '';
        const page = Number(searchParams.get('page')) || 1;

        if (cat !== selectedCategory) setSelectedCategory(cat);
        if (search !== searchQuery) setSearchQuery(search);
        if (page !== currentPage) setCurrentPage(page);
    }, [searchParams]);

    // Fetch Items when filters change (skip initial mount as we have initialItems)
    const isFirstMount = useRef(true);
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        const fetchItems = async () => {
            setIsLoading(true);
            try {
                let items: MenuItem[] = [];
                let total = 0;
                const itemsPerPage = 8;

                const isPromoFilter = selectedCategory === 'promos' || selectedCategory === 'promotions';

                if (isPromoFilter) {
                    const res = await fetch(`/api/promotions?active=true&search=${searchQuery}&page=${currentPage}&limit=${itemsPerPage}`);
                    const data = await res.json();
                    if (data.success) {
                        items = data.promotions.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            originalPrice: p.originalPrice,
                            savings: p.originalPrice && p.price ? p.originalPrice - p.price : 0,
                            ingredients: p.description,
                            image: p.imageUrl || p.emoji || '🎁',
                            category: 'promotions',
                            isActive: p.isActive,
                            discount: p.discount,
                            displayOrder: 0
                        }));
                        total = data.pagination.totalItems;
                    }
                } else {
                    let categoryId = null;
                    if (selectedCategory !== 'all') {
                        const dbCat = dbCategories.find(c =>
                            c.name.toLowerCase() === selectedCategory.toLowerCase() ||
                            c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === selectedCategory.toLowerCase()
                        );
                        categoryId = dbCat?.id;
                    }

                    const query = new URLSearchParams({
                        page: String(currentPage),
                        limit: String(itemsPerPage),
                        status: 'active',
                        search: searchQuery
                    });
                    if (categoryId) query.set('categoryId', String(categoryId));

                    const res = await fetch(`/api/menu-items?${query.toString()}`);
                    const data = await res.json();

                    if (data.success) {
                        items = data.menuItems.map((item: any) => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            ingredients: item.ingredients?.join(', '),
                            popular: item.popular,
                            bestseller: item.bestseller,
                            hot: item.hot,
                            image: item.imageUrl || item.emoji || '🍽️',
                            category: item.category?.name || 'Général',
                            discount: item.discount,
                            displayOrder: item.displayOrder,
                            likeCount: item.likeCount,
                            rating: item.rating,
                            reviewCount: item.reviewCount
                        }));
                        total = data.pagination.totalItems;
                    }
                }

                setDbItems(items);
                setTotalItems(total);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchItems();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [selectedCategory, searchQuery, currentPage, dbCategories]);

    // Handle Body Scroll Lock
    useEffect(() => {
        if (selectedItem) {
            document.body.classList.add('selection-modal-open');
        } else {
            document.body.classList.remove('selection-modal-open');
        }
        return () => document.body.classList.remove('selection-modal-open');
    }, [selectedItem]);

    const handleConfirmSelection = (item: any, selectedSize?: string, choices?: any) => {
        const isPromotion = item.category === 'promotions' || (item.discount !== undefined && item.discount > 0);
        addToCart(item, isPromotion ? 'promotion' : 'menuItem', selectedSize, choices);
        setSelectedItem(null);
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-transparent text-white selection:bg-yellow-400 selection:text-black pb-40 relative">

            {/* Ambient Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-yellow-400/5 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-orange-500/5 blur-[150px] rounded-full"></div>
            </div>

            {/* Header Section with Parallax */}
            <motion.div
                style={{ y: headerY, opacity: headerOpacity }}
                className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center gap-12 text-center"
            >
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.4em] italic">Visions Collective</span>
                    </motion.div>

                    <div className="relative group">
                        <div className="absolute -inset-16 bg-yellow-400/15 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        {/* THE PILL TITLE */}
                        <div className="relative bg-yellow-400 py-8 px-12 md:px-20 -rotate-1 hover:rotate-0 transition-all duration-700 shadow-[20px_20px_0_rgba(0,0,0,1)] border-4 border-black overflow-hidden group">
                            <h1 className="text-5xl md:text-[9rem] font-[1000] italic uppercase tracking-tighter text-black leading-none inline-block relative z-10 pr-[0.4em]">
                                La Carte
                            </h1>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Kinetic Sticky Control Bar */}
            <div className="sticky top-28 z-[100] px-6 md:px-12 py-8 flex justify-center">
                <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-6 p-3 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] shadow-2xl">

                    {/* Categories Nav - NO SCROLLBAR */}
                    <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-mask-h max-w-full px-4">
                        <button
                            onClick={() => updateUrl({ category: 'all', page: 1 })}
                            className={`relative px-8 py-4 rounded-[2.5rem] font-[1000] text-[10px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${selectedCategory === 'all' ? 'text-black' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            {selectedCategory === 'all' && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.3)]"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">Tout Voir</span>
                        </button>
                        {dbCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => updateUrl({ category: cat.name.toLowerCase(), page: 1 })}
                                className={`relative px-8 py-4 rounded-[2.5rem] font-[1000] text-[10px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${selectedCategory === cat.name.toLowerCase() ? 'text-black' : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {selectedCategory === cat.name.toLowerCase() && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.3)]"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{cat.name}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Kinetic Search Bar */}
                    <div className="relative group/search w-full md:w-auto px-4 md:px-0">
                        <div className="absolute inset-y-0 left-10 md:left-6 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-500 group-focus-within/search:text-yellow-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-[2.5rem] py-4 pl-14 pr-8 text-[10px] uppercase font-[1000] tracking-widest text-white focus:outline-none focus:border-yellow-400/40 focus:ring-4 focus:ring-yellow-400/5 transition-all w-full md:w-72 placeholder:text-gray-700"
                        />
                    </div>
                </div>
            </div>

            {/* Boutique Grid (max-w-7xl) */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 mt-32">
                {isLoading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                        {dbItems.map((item, idx) => {
                            const isFeatured = idx === 0 && currentPage === 1 && !searchQuery;
                            return (
                                <ProductCard
                                    key={item.id}
                                    item={item}
                                    idx={idx}
                                    onSelect={(it) => setSelectedItem(it)}
                                    className={isFeatured ? "md:col-span-2" : ""}
                                    isFeatured={isFeatured}
                                />
                            );
                        })}

                        {dbItems.length === 0 && (
                            <div className="md:col-span-2 py-40 text-center space-y-8 opacity-40">
                                <div className="text-[10rem] animate-float">🍽️</div>
                                <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter">Aucun délice trouvé</h2>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Ajustez votre recherche pour explorer d'autres saveurs</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Pagination Controls */}
            {!isLoading && totalItems > dbItems.length && (
                <div className="mt-40 flex justify-center items-center gap-12">
                    <button
                        onClick={() => updateUrl({ page: Math.max(1, currentPage - 1) })}
                        disabled={currentPage === 1}
                        className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 disabled:opacity-0 transition-all group"
                    >
                        <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-yellow-400 font-[1000] text-lg uppercase italic tracking-[0.6em]">
                            {currentPage < 10 ? `0${currentPage}` : currentPage}
                        </span>
                        <div className="w-12 h-0.5 bg-white/10 relative overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                                className="absolute inset-y-0 w-1/2 bg-yellow-400"
                            />
                        </div>
                        <span className="text-white/20 font-[1000] text-[10px] uppercase tracking-widest leading-none">Page</span>
                    </div>
                    <button
                        onClick={() => updateUrl({ page: currentPage + 1 })}
                        disabled={currentPage >= Math.ceil(totalItems / 8)}
                        className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 disabled:opacity-0 transition-all group"
                    >
                        <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {/* Selection Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <SelectionModal
                        isOpen={!!selectedItem}
                        onClose={() => setSelectedItem(null)}
                        item={selectedItem}
                        onConfirm={handleConfirmSelection}
                    />
                )}
            </AnimatePresence>
            {/* FOOTER CTA */}
            <section className="relative mt-40">
                <div
                    className="absolute inset-0 z-0 bg-yellow-400"
                    style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)' }}
                >
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(black 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                </div>

                <div className="relative z-10 pt-48 pb-24 flex flex-col items-center text-center text-black px-6">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="space-y-12">
                        <h2 className="text-5xl md:text-[7rem] font-[1000] uppercase italic tracking-tighter leading-[0.7]">
                            PRÊT POUR <br />
                            <span className="relative text-black">L'ÉXPÉRIENCE ?</span>
                        </h2>

                        <div className="pt-6">
                            <Link href="/register" className="relative group overflow-hidden px-12 py-5 bg-black text-white font-[1000] uppercase italic tracking-widest rounded-full text-xs hover:scale-105 transition-all shadow-2xl inline-block">
                                <span className="relative z-10">Rejoindre le Syndicat</span>
                                <div className="absolute inset-0 flex items-center justify-center bg-white text-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 font-black uppercase text-xs">Accès Immédiat</div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

function ProductCard({ item, idx, onSelect, className = "", isFeatured = false }: { item: MenuItem, idx: number, onSelect: (it: MenuItem) => void, className?: string, isFeatured?: boolean }) {
    const isMultiSize = typeof item.price === 'object' && item.price !== null;
    const displayPrice = isMultiSize ? (item.price as any).xl || Object.values(item.price as object)[0] : item.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx % 4 * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className={`group relative flex flex-col ${className}`}
        >
            <div className={`relative overflow-hidden rounded-[3.5rem] bg-[#0a0a0a] border border-white/[0.04] group-hover:border-yellow-400/20 transition-all duration-1000 flex flex-col ${isFeatured ? "md:flex-row min-h-[500px]" : ""}`}>

                {/* Image Section */}
                <div className={`relative bg-[#050505] overflow-hidden flex items-center justify-center p-12 ${isFeatured ? "md:w-3/5" : "aspect-square"}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    <motion.div
                        whileHover={{ scale: 1.05, rotate: isFeatured ? 1 : 2 }}
                        transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
                    >
                        {item.image && (item.image.startsWith('/') || item.image.startsWith('http')) ? (
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={800}
                                height={800}
                                className="object-contain filter drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
                            />
                        ) : (
                            <span className="text-9xl md:text-[12rem] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">{item.image || '🍽️'}</span>
                        )}
                    </motion.div>

                    {/* Status Badges */}
                    <div className="absolute top-10 left-10 flex flex-col gap-4 z-20">
                        {item.bestseller && (
                            <div className="bg-yellow-400 text-black px-6 py-2.5 rounded-2xl text-[10px] font-[1000] uppercase tracking-[0.2em] shadow-2xl italic flex items-center gap-3">
                                <Flame className="w-4 h-4" />
                                Highlight
                            </div>
                        )}
                        <div className="flex gap-2">
                            {item.rating && (
                                <div className="bg-black/60 backdrop-blur-xl text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {item.rating.toFixed(1)}
                                </div>
                            )}
                            {(item.likeCount ?? 0) > 0 && (
                                <div className="bg-black/60 backdrop-blur-xl text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                                    <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {item.likeCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className={`p-10 md:p-14 flex flex-col justify-center gap-8 bg-black/40 backdrop-blur-sm z-10 ${isFeatured ? "md:w-2/5 border-l border-white/5" : "pt-0"}`}>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="bg-yellow-400/10 text-yellow-400 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic border border-yellow-400/20">
                                {item.category}
                            </span>
                        </div>
                        <h3 className={`font-[1000] uppercase italic tracking-tighter text-white group-hover:text-yellow-400 transition-colors leading-[0.85] ${isFeatured ? "text-6xl md:text-8xl" : "text-5xl"}`}>
                            {item.name.split(' ').map((word: string, i: number) => (
                                <span key={i} className="block pr-[0.4em] overflow-visible">{word}</span>
                            ))}
                        </h3>
                        <p className="text-gray-500 font-bold text-[11px] uppercase tracking-[0.3em] leading-relaxed line-clamp-3">
                            {item.ingredients}
                        </p>
                    </div>

                    <div className="pt-8 flex items-center justify-between border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-gray-700 tracking-widest mb-1 italic">Prix Edition</span>
                            <div className="text-4xl md:text-5xl font-[1000] italic tracking-tighter text-white">
                                {isMultiSize ? `dès ${displayPrice}` : Number(displayPrice).toFixed(1)} <span className="text-xs not-italic font-black text-gray-600">DT</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onSelect(item)}
                            className="bg-yellow-400 text-black w-20 h-20 rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-[0_0_30px_rgba(250,204,21,0.3)] relative"
                        >
                            <ShoppingBag className="w-7 h-7" />
                            <motion.div
                                className="absolute inset-[-4px] border border-yellow-400/40 rounded-full"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
