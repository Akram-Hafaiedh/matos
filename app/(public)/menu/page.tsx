'use client';

// import { categories, menuItems } from '@/lib/data/menu';
import { Flame, Minus, Plus, Star, Percent, ChevronRight, Search, ArrowRight, LayoutGrid, Grid3X3, Grid2X2, ChevronLeft, X, MessageSquare, Utensils, User } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { MenuItem } from '@/types/menu';
import { useCart } from '../../cart/CartContext';

export default function MenuPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white font-black uppercase text-xs tracking-widest">Chargement du menu...</p>
                </div>
            </div>
        }>
            <MenuContent />
        </Suspense>
    );
}

function MenuContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Mapping between URL slugs and DB category names/ids
    const DB_URL_MAP: Record<string, string> = {
        'pizza': 'Pizzas',
        'tacos': 'Tacos',
        'makloub': 'Makloub',
        'sandwich': 'Sandwichs',
        'burger': 'Burgers',
        'plat': 'Plats',
        'salade': 'Salades',
        'sides': 'Sides',
        'tunisian': 'Tunisien',
        'kids': 'Enfants',
        'drinks': 'Boissons',
        'dessert': 'Desserts',
        'supplements': 'Suppléments',
        'promotions': 'Promos' // Map both to the same logic
    };

    // Read from URL or use defaults
    const initialCategory = searchParams.get('category') || 'all';
    const initialSauce = (searchParams.get('sauce') as 'all' | 'rouge' | 'blanche') || 'all';
    const initialSearch = searchParams.get('search') || '';
    const initialPage = Number(searchParams.get('page')) || 1;

    const [dbCategories, setDbCategories] = useState<any[]>([]);
    const [dbItems, setDbItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedSauce, setSelectedSauce] = useState<'all' | 'rouge' | 'blanche'>(initialSauce);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewStats, setReviewStats] = useState({ average: 0, total: 0 });
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const { data: session } = useSession();
    const { addToCart } = useCart();

    // URL Update Logic
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

    // Handle initial state and URL sync
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || 'all');
        setSelectedSauce((searchParams.get('sauce') as 'all' | 'rouge' | 'blanche') || 'all');
        setSearchQuery(searchParams.get('search') || '');
        setCurrentPage(Number(searchParams.get('page')) || 1);
    }, [searchParams]);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories?limit=100');
                const data = await res.json();
                if (data.success) {
                    setDbCategories(data.categories);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Menu Items & Promotions
    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let items: MenuItem[] = [];
                let total = 0;

                const itemsPerPage = gridCols === 2 ? 6 : gridCols === 3 ? 9 : 12;
                const isPromoFilter = selectedCategory === 'promos' || selectedCategory === 'promotions';

                if (isPromoFilter) {
                    // Fetch from both sources for Promotions
                    const [promosRes, menuRes] = await Promise.all([
                        fetch(`/api/promotions?active=true&search=${searchQuery}&page=${currentPage}&limit=${itemsPerPage}`),
                        fetch(`/api/menu-items?categoryId=14&status=active&search=${searchQuery}&page=${currentPage}&limit=${itemsPerPage}`)
                    ]);

                    const [promosData, menuData] = await Promise.all([promosRes.json(), menuRes.json()]);

                    if (promosData.success) {
                        const promoModels = promosData.promotions.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            originalPrice: p.originalPrice,
                            discount: p.discount,
                            savings: p.originalPrice && p.price ? p.originalPrice - p.price : 0,
                            ingredients: p.description,
                            image: p.imageUrl || p.emoji || '🎁',
                            category: 'promotions',
                            isActive: p.isActive
                        }));
                        items = [...items, ...promoModels];
                        total += promosData.pagination.totalItems;
                    }

                    if (menuData.success) {
                        const promoItems = menuData.menuItems.map((item: any) => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            ingredients: item.ingredients?.join(', '),
                            popular: item.popular,
                            bestseller: item.bestseller,
                            hot: item.hot,
                            image: item.imageUrl || item.emoji || '🍽️',
                            category: 'promotions',
                            sauce: item.sauce,
                            discount: item.discount
                        }));
                        items = [...items, ...promoItems];
                        total += menuData.pagination.totalItems;
                    }
                } else {
                    // Find the DB category ID if a specific category is selected
                    let categoryId = null;
                    if (selectedCategory !== 'all') {
                        const dbCat = dbCategories.find(c =>
                            c.name.toLowerCase() === DB_URL_MAP[selectedCategory]?.toLowerCase() ||
                            c.name.toLowerCase() === selectedCategory.toLowerCase()
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
                            category: Object.keys(DB_URL_MAP).find(key => DB_URL_MAP[key].toLowerCase() === item.category?.name.toLowerCase()) || item.category?.name.toLowerCase() || 'all',
                            sauce: item.sauce,
                            discount: item.discount
                        }));

                        // Client-side sauce filtering for Pizzas if needed
                        if (selectedCategory === 'pizza' && selectedSauce !== 'all') {
                            items = items.filter(item => item.sauce === selectedSauce);
                        }

                        total = data.pagination.totalItems;
                    }
                }

                setDbItems(items);
                setTotalItems(total);
            } catch (err) {
                console.error('Failed to fetch menu items:', err);
                setError('Impossible de charger le menu. Veuillez réessayer plus tard.');
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch items when categories are available or if we're fetching everything
        if (dbCategories.length > 0 || selectedCategory === 'all' || selectedCategory === 'promos' || selectedCategory === 'promotions') {
            fetchItems();
        }
    }, [selectedCategory, selectedSauce, searchQuery, currentPage, gridCols, dbCategories]);

    // Pagination logic
    const itemsPerPage = gridCols === 2 ? 6 : gridCols === 3 ? 9 : 12;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedItems = dbItems; // Already paginated from server

    const getPaginationRange = () => {
        const delta = 1;
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) range.unshift('...');
        if (currentPage + delta < totalPages - 1) range.push('...');

        range.unshift(1);
        if (totalPages > 1) range.push(totalPages);

        return range;
    };

    // Reset page when filters change and update URL
    useEffect(() => {
        // Only trigger update if values actually changed to avoid infinite loops
        const currentCat = searchParams.get('category') || 'all';
        const currentSauce = searchParams.get('sauce') || 'all';
        const currentSearch = searchParams.get('search') || '';

        if (selectedCategory !== currentCat || selectedSauce !== currentSauce || searchQuery !== currentSearch) {
            setCurrentPage(1);
            updateUrl({
                category: selectedCategory,
                sauce: selectedSauce,
                search: searchQuery,
                page: 1
            });
        }
    }, [selectedCategory, selectedSauce, searchQuery, updateUrl, searchParams]);

    // Sync page to URL
    useEffect(() => {
        const currentPageParam = Number(searchParams.get('page')) || 1;
        if (currentPage !== currentPageParam) {
            updateUrl({ page: currentPage });
        }
    }, [currentPage, updateUrl, searchParams]);

    const fetchReviews = async (itemId: string | number) => {
        try {
            const res = await fetch(`/api/menu/reviews?menuItemId=${itemId}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.reviews);
                setReviewStats({ average: data.averageRating, total: data.totalReviews });
            }
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        if (selectedItem) {
            fetchReviews(selectedItem.id);
        }
    }, [selectedItem]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem || isSubmittingReview) return;
        setIsSubmittingReview(true);
        try {
            const res = await fetch('/api/menu/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    menuItemId: String(selectedItem.id),
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });
            const data = await res.json();
            if (data.success) {
                setNewReview({ rating: 5, comment: '' });
                fetchReviews(selectedItem.id);
            }
        } catch (error) { console.error(error); } finally { setIsSubmittingReview(false); }
    };

    const renderPriceAndButton = (item: MenuItem) => {
        // Special rendering for promo items
        if (item.category === 'promos' && item.originalPrice && item.price && typeof item.price === 'number') {
            return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 uppercase tracking-widest shadow-lg">
                            <Percent className="w-3 h-3" />
                            -{item.discount}%
                        </div>
                        <span className="text-green-400 font-bold text-xs">
                            -{item.savings}DT
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white italic">
                            {item.price}
                            <span className="text-yellow-400 text-sm ml-1 not-italic font-bold">DT</span>
                        </span>
                        <span className="text-sm text-gray-500 line-through font-bold">
                            {item.originalPrice}DT
                        </span>
                    </div>

                    <button
                        onClick={() => addToCart(item, 'menuItem')}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-yellow-400/20 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        Profiter de l'offre
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            );
        }

        if (!item.price) {
            return (
                <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">Prix variable</span>
                    <button
                        onClick={() => addToCart(item, 'menuItem')}
                        className="bg-yellow-400 text-gray-900 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-yellow-300 transition shadow-lg group-active:scale-90"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            );
        }

        if (typeof item.price === 'number') {
            return (
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white italic">
                        {item.price}
                        <span className="text-yellow-400 text-sm ml-1 not-italic font-bold">DT</span>
                    </span>
                    <button
                        onClick={() => addToCart(item, 'menuItem')}
                        className="bg-yellow-400 text-gray-900 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-yellow-300 transition shadow-lg group-active:scale-90"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            );
        }

        if (typeof item.price === 'object') {
            if ('xl' in item.price && 'xxl' in item.price) {
                return (
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => addToCart(item, 'menuItem', 'xl')}
                            className="bg-gray-800/50 hover:bg-yellow-400 hover:text-gray-900 text-white p-2 rounded-xl font-black text-[10px] transition-all flex flex-col items-center justify-center gap-1 border border-gray-700 hover:border-yellow-400"
                        >
                            <span className="uppercase tracking-widest opacity-60">XL</span>
                            <span>{item.price.xl} DT</span>
                        </button>
                        <button
                            onClick={() => addToCart(item, 'menuItem', 'xxl')}
                            className="bg-gray-800/50 hover:bg-yellow-400 hover:text-gray-900 text-white p-2 rounded-xl font-black text-[10px] transition-all flex flex-col items-center justify-center gap-1 border border-gray-700 hover:border-yellow-400"
                        >
                            <span className="uppercase tracking-widest opacity-60">XXL</span>
                            <span>{item.price.xxl} DT</span>
                        </button>
                    </div>
                );
            }
            return (
                <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">Multi-tailles</span>
                    <button
                        onClick={() => addToCart(item, 'menuItem')}
                        className="bg-yellow-400 text-gray-900 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-yellow-300 transition shadow-lg group-active:scale-90"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-black pb-32 overflow-hidden relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-400/5 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Modern Header Section */}
                <div className="pt-32 pb-16 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-3 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em]">
                                Carte Gastronomique
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none uppercase">
                                Notre <br />
                                <span className="text-yellow-400">Menu.</span>
                            </h1>
                        </div>

                        {/* Grid & Search Controls */}
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                            {/* Grid Switcher */}
                            <div className="hidden lg:flex items-center gap-2 bg-gray-900/50 p-2 rounded-[1.5rem] border-2 border-gray-800/50 backdrop-blur-xl">
                                {[2, 3, 4].map((cols) => (
                                    <button
                                        key={cols}
                                        onClick={() => setGridCols(cols as any)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${gridCols === cols
                                            ? 'bg-yellow-400 text-gray-900 shadow-lg'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {cols === 2 ? <Grid2X2 className="w-5 h-5" /> : cols === 3 ? <Grid3X3 className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                                    </button>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <div className="relative group w-full md:w-80">
                                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
                                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-900/50 border-2 border-gray-800 text-white pl-14 pr-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-600 backdrop-blur-xl text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Navigation */}
                <div className="flex flex-col gap-8 mb-16">
                    <div className="flex flex-wrap gap-3">
                        {/* All Category */}
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSelectedSauce('all');
                            }}
                            className={`px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-3 active:scale-95 ${selectedCategory === 'all'
                                ? 'bg-yellow-400 text-gray-900 shadow-2xl shadow-yellow-400/20'
                                : 'bg-gray-900/40 text-gray-500 border-2 border-gray-800/50 hover:border-yellow-400/30 hover:text-white backdrop-blur-md'
                                }`}
                        >
                            <span className="text-xl">🍽️</span>
                            Tous
                        </button>

                        {/* DB Categories */}
                        {dbCategories.map(cat => {
                            const rawSlug = Object.keys(DB_URL_MAP).find(key => DB_URL_MAP[key].toLowerCase() === cat.name.toLowerCase()) || cat.name.toLowerCase();
                            const isPromoCategory = cat.name.toLowerCase() === 'promos' || cat.name.toLowerCase() === 'promotions';
                            const slug = isPromoCategory ? 'promotions' : rawSlug;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setSelectedCategory(slug);
                                        setSelectedSauce('all');
                                    }}
                                    className={`px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-3 active:scale-95 ${selectedCategory === slug
                                        ? 'bg-yellow-400 text-gray-900 shadow-2xl shadow-yellow-400/20'
                                        : isPromoCategory
                                            ? 'bg-yellow-400/10 text-yellow-500 border-2 border-yellow-400/20 hover:border-yellow-400/40 hover:text-yellow-400 backdrop-blur-md'
                                            : 'bg-gray-900/40 text-gray-500 border-2 border-gray-800/50 hover:border-yellow-400/30 hover:text-white backdrop-blur-md'
                                        }`}
                                >
                                    <span className="text-xl">{cat.emoji || '🍕'}</span>
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Sub-Filters for Pizza */}
                    {selectedCategory === 'pizza' && (
                        <div className="flex items-center gap-4 bg-gray-900/40 p-2 rounded-[2rem] border-2 border-gray-800/50 w-fit backdrop-blur-md animate-in fade-in slide-in-from-top-4">
                            <button
                                onClick={() => setSelectedSauce('all')}
                                className={`px-6 py-2.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition ${selectedSauce === 'all'
                                    ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                                    : 'text-gray-600 hover:text-white'
                                    }`}
                            >
                                Toutes
                            </button>
                            <button
                                onClick={() => setSelectedSauce('rouge')}
                                className={`px-6 py-2.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition flex items-center gap-2 ${selectedSauce === 'rouge'
                                    ? 'bg-red-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-white'
                                    }`}
                            >
                                🍅 Base Tomate
                            </button>
                            <button
                                onClick={() => setSelectedSauce('blanche')}
                                className={`px-6 py-2.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition flex items-center gap-2 ${selectedSauce === 'blanche'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-white'
                                    }`}
                            >
                                🥛 Base Blanche
                            </button>
                        </div>
                    )}
                </div>

                {/* Items Grid */}
                {isLoading ? (
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols === 2 ? 'lg:grid-cols-2' :
                        gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
                        } gap-8`}>
                        {[...Array(itemsPerPage)].map((_, i) => (
                            <div key={i} className="bg-gray-900/30 border-2 border-gray-800 rounded-[3rem] h-[500px] animate-pulse">
                                <div className="h-64 bg-gray-800/50 rounded-t-[3rem]"></div>
                                <div className="p-8 space-y-4">
                                    <div className="h-8 bg-gray-800/50 rounded-xl w-3/4"></div>
                                    <div className="h-4 bg-gray-800/50 rounded-lg w-1/2"></div>
                                    <div className="h-20 bg-gray-800/50 rounded-2xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-40 space-y-8">
                        <div className="w-32 h-32 bg-red-900/20 rounded-[3rem] border border-red-900/50 flex items-center justify-center mx-auto text-6xl">
                            ⚠️
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-white italic">Oups !</h3>
                            <p className="text-gray-500 font-bold">{error}</p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition"
                        >
                            Réessayer
                        </button>
                    </div>
                ) : paginatedItems.length > 0 ? (
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols === 2 ? 'lg:grid-cols-2' :
                        gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
                        } gap-8`}>
                        {paginatedItems.map((item: MenuItem) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className={`group relative bg-gray-900/30 border-2 border-gray-800 rounded-[3rem] overflow-hidden backdrop-blur-3xl hover:border-yellow-400/30 transition-all duration-500 flex flex-col h-full hover:shadow-3xl hover:shadow-yellow-400/5 cursor-pointer ${item.category === 'promos' ? 'border-yellow-400/50' : ''
                                    }`}
                            >
                                {/* Media Section */}
                                <div className="relative h-64 overflow-hidden border-b-2 border-gray-800/50">
                                    {item.image && (item.image.startsWith('/') || item.image.startsWith('http')) ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-900/50 group-hover:bg-gray-800/50 transition-colors">
                                            <span className="text-8xl filter drop-shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                                                {item.image || '🍽️'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Badges Overlays */}
                                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                                        <div className="flex flex-col gap-2">
                                            {item.bestseller && (
                                                <span className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl ring-2 ring-black/50">
                                                    TOP VENTE
                                                </span>
                                            )}
                                            {item.popular && (
                                                <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl ring-2 ring-black/50 flex items-center gap-1 w-fit">
                                                    <Flame className="w-3 h-3" /> POPULAIRE
                                                </span>
                                            )}
                                        </div>

                                        {/* Category Badge */}
                                        <span className="bg-black/40 backdrop-blur-md text-white/60 px-3 py-1.5 rounded-xl font-black text-[8px] uppercase tracking-widest border border-white/5">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex flex-col flex-1 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-2xl font-black text-white italic group-hover:text-yellow-400 transition-colors line-clamp-2 uppercase leading-none tracking-tight">
                                                {item.name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'}`} />
                                            ))}
                                            <span className="text-[10px] font-black text-gray-500 ml-2 uppercase tracking-widest">(12 avis)</span>
                                        </div>

                                        {item.ingredients && (
                                            <p className="text-gray-500 font-bold text-xs leading-relaxed line-clamp-3 italic opacity-70 group-hover:opacity-100 transition-opacity">
                                                {item.ingredients}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Section */}
                                    <div className="mt-auto pt-6 border-t border-gray-800/50" onClick={(e) => e.stopPropagation()}>
                                        {renderPriceAndButton(item)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="w-32 h-32 bg-gray-900/50 rounded-[3rem] border border-gray-800 flex items-center justify-center mx-auto text-6xl opacity-50">
                            🥡
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-white italic">Aucune pépite trouvée</h3>
                            <p className="text-gray-500 font-bold">Affinez votre recherche pour trouver votre bonheur.</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSearchQuery('');
                                setCurrentPage(1);
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition"
                        >
                            Réinitialiser
                        </button>
                    </div>
                )}

                {/* Compact Pagination */}
                {totalPages > 1 && (
                    <div className="mt-20 flex justify-center items-center gap-3">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-white disabled:opacity-20 disabled:cursor-not-allowed hover:border-yellow-400 transition-all active:scale-95 group"
                            title="Précédent"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="flex items-center gap-2 bg-gray-900/50 p-2 rounded-[1.5rem] border border-gray-800/50">
                            {getPaginationRange().map((page, idx) => (
                                page === '...' ? (
                                    <span key={`dots-${idx}`} className="px-3 text-gray-700 font-black">•••</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page as number)}
                                        className={`w-10 h-10 rounded-xl font-black text-xs transition-all duration-300 ${currentPage === page
                                            ? 'bg-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/20 scale-110'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-400/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Detail Modal */}
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedItem(null)}></div>

                        <div className="bg-gray-900 border border-gray-800 w-full max-w-5xl max-h-full overflow-y-auto rounded-[3.5rem] relative z-10 custom-scrollbar animate-in fade-in zoom-in duration-300">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-8 right-8 w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl flex items-center justify-center transition-all z-20"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Left: Media */}
                                <div className="relative h-80 lg:h-full min-h-[400px] border-b lg:border-b-0 lg:border-r border-gray-800 bg-gray-950">
                                    {selectedItem.image && (selectedItem.image.startsWith('/') || selectedItem.image.startsWith('http')) ? (
                                        <Image src={selectedItem.image} alt={selectedItem.name} fill className="object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-9xl">{selectedItem.image || '🍽️'}</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-12 left-12 right-12">
                                        <div className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest w-fit mb-4">
                                            {selectedItem.category}
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedItem.name}</h2>
                                    </div>
                                </div>

                                {/* Right: Details & Reviews */}
                                <div className="p-8 md:p-12 space-y-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviewStats.average) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'}`} />
                                                ))}
                                            </div>
                                            <span className="text-sm font-black text-white">{reviewStats.average.toFixed(1)} <span className="text-gray-600 font-bold ml-1">({reviewStats.total} avis)</span></span>
                                        </div>

                                        <p className="text-gray-400 font-bold italic leading-relaxed text-lg">
                                            {selectedItem.ingredients || "Une création artisanale signée Mato's."}
                                        </p>

                                        <div className="pt-6 border-t border-gray-800">
                                            {renderPriceAndButton(selectedItem)}
                                        </div>
                                    </div>

                                    {/* Reviews Section */}
                                    <div className="space-y-8">
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                                            <MessageSquare className="w-5 h-5 text-yellow-400" />
                                            Avis Clients
                                        </h3>

                                        {/* Leave a Review */}
                                        {session ? (
                                            <form onSubmit={handleReviewSubmit} className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-gray-500 uppercase">Laisser une note</span>
                                                    <div className="flex items-center gap-2">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => setNewReview({ ...newReview, rating: s })}
                                                                className="transition-transform active:scale-95"
                                                            >
                                                                <Star className={`w-5 h-5 ${s <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'}`} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea
                                                    placeholder="Votre avis nous intéresse..."
                                                    value={newReview.comment}
                                                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                                    className="w-full bg-gray-900 border border-gray-800 text-white p-4 rounded-2xl font-bold focus:border-yellow-400/30 outline-none transition-all resize-none text-sm"
                                                    rows={3}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={isSubmittingReview}
                                                    className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 text-gray-900 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition"
                                                >
                                                    Publier l'avis
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="bg-gray-950 p-6 rounded-3xl border border-gray-800 text-center">
                                                <p className="text-xs font-bold text-gray-500 mb-4">Connectez-vous pour laisser un avis sur ce délice.</p>
                                                <Link href="/login" className="text-yellow-400 font-black uppercase text-[10px] tracking-widest border-b border-yellow-400/20 pb-1">Se connecter</Link>
                                            </div>
                                        )}

                                        {/* Reviews List */}
                                        <div className="space-y-6">
                                            {reviews.length > 0 ? reviews.map(r => (
                                                <div key={r.id} className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-sm">{r.user.image || <User className="w-4 h-4" />}</div>
                                                            <span className="text-white font-black text-xs">{r.user.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <Star key={s} className={`w-2.5 h-2.5 ${s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-500 text-sm font-bold italic pl-11">{r.comment || "Pas de commentaire."}</p>
                                                </div>
                                            )) : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-600 font-bold italic text-sm">Soyez le premier à donner votre avis !</p>
                                                </div>
                                            )}
                                        </div>
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