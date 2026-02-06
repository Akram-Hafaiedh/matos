'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Minus, Plus, ShoppingBag, Star, Sparkles, Heart, Share2, MessageSquare, User as UserIcon } from 'lucide-react';
import { useCart } from '../../../cart/CartContext';
import { MenuItem } from '@/types/menu';
import { useSession } from 'next-auth/react';
import UserAvatar from '@/components/UserAvatar';

export default function SingleItemPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { data: session } = useSession();
    const id = params?.id;

    const [item, setItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<'normal' | 'xl'>('normal');
    const [reviews, setReviews] = useState<any[]>([]);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch(`/api/menu-items?id=${id}`);
                const data = await res.json();
                if (data.success && data.menuItem) {
                    const menuItem = data.menuItem;
                    // Safe mapping
                    setItem({
                        ...menuItem,
                        image: menuItem.imageUrl || '',
                        ingredients: menuItem.description,
                        category: menuItem.category?.name || 'Général' // Safe fallback
                    });
                    setIsLiked(menuItem.isLiked || false);
                    setLikeCount(menuItem.likeCount || 0);

                    // Fetch reviews
                    try {
                        const revRes = await fetch(`/api/reviews?menuItemId=${id}`);
                        const revData = await revRes.json();
                        if (revData.success) setReviews(revData.reviews);
                    } catch (e) {
                        console.error("Reviews fetch error", e);
                    }
                }
            } catch (error) {
                console.error("Error fetching item:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchItem();
    }, [id]);

    const getPrice = () => {
        if (!item?.price) return 0;
        if (typeof item.price === 'number') return item.price;
        // @ts-ignore
        return item.price[selectedSize] || item.price.xl || item.price.normal || 0;
    };

    const handleAddToCart = () => {
        if (!item) return;
        addToCart(item, 'menuItem', selectedSize, [], quantity);
        // Optional: show toast or feedback
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user || !item) return;

        setIsSubmittingReview(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    menuItemId: item.id,
                    userId: (session.user as any).id,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });

            if (res.ok) {
                const addedReview = await res.json();
                // Optimistic update
                setReviews([addedReview, ...reviews]);
                setNewReview({ rating: 5, comment: '' });
            }
        } catch (error) {
            console.error("Failed to submit review", error);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleLikeToggle = async () => {
        if (!session?.user || !item || isLiking) return;

        // Optimistic UI
        const previousLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!previousLiked);
        setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);
        setIsLiking(true);

        try {
            const res = await fetch('/api/menu-items/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ menuItemId: item.id })
            });
            const data = await res.json();

            if (!data.success) {
                // Rollback
                setIsLiked(previousLiked);
                setLikeCount(previousCount);
            } else {
                setIsLiked(data.liked);
            }
        } catch (error) {
            console.error("Like toggle failed", error);
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
        } finally {
            setIsLiking(false);
        }
    };

    // Calculate rating stats
    const displayRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : (item?.rating || 5);

    const displayReviewCount = reviews.length > 0
        ? reviews.length
        : (item?.reviewCount || 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center space-y-4">
                    <div className="text-4xl">😕</div>
                    <p>Produit introuvable</p>
                    <Link href="/menu" className="text-yellow-400 underline">Retour au menu</Link>
                </div>
            </div>
        );
    }

    // Split name safely for the specific visual style
    const nameParts = item.name ? item.name.split(' ') : ['Produit'];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 selection:bg-yellow-400 selection:text-gray-900">

            {/* Standard Back Link & Social Actions */}
            <div className="max-w-7xl mx-auto mb-16 flex items-center justify-between">
                <Link href="/menu" className="inline-flex items-center gap-2 text-white/50 hover:text-yellow-400 transition-colors font-bold uppercase tracking-widest text-xs group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Retour au Menu
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLikeToggle}
                        disabled={!session || isLiking}
                        className={`w-14 h-10 px-4 rounded-full border flex items-center justify-center gap-2 transition-all group ${isLiked
                            ? 'bg-red-500/10 border-red-500/30 text-red-500'
                            : 'border-white/10 text-white/50 hover:bg-white/5 hover:text-red-400 hover:border-red-400/30'
                            } ${!session && 'opacity-30 cursor-not-allowed'}`}
                    >
                        <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                        {likeCount > 0 && <span className="text-xs font-black">{likeCount}</span>}
                    </button>
                    <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/5 hover:text-yellow-400 hover:border-yellow-400/30 transition-all group">
                        <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Main Content Split - Based on FeaturedHighlights Mockup */}
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">

                    {/* Left: Visual Area */}
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="absolute -inset-4 bg-yellow-400/5 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative aspect-square bg-gray-900/10 rounded-[4rem] overflow-hidden border border-white/5 flex items-center justify-center p-12 md:p-20 backdrop-blur-3xl">
                            {item.image && (item.image.startsWith('/') || item.image.startsWith('http')) ? (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-contain filter drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-float p-8 transition-transform duration-700 group-hover:scale-110"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-9xl animate-float filter drop-shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                                        {item.image || '✨'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Content Area */}
                    <div className="w-full lg:w-1/2 space-y-10 text-center lg:text-left">
                        <div className="space-y-6">
                            <div className="flex items-center justify-center lg:justify-start gap-4">
                                <div className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.5em] italic">
                                    {typeof item.category === 'string' ? item.category : 'Signature'}
                                </div>
                                <div className="h-px w-8 bg-white/10"></div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs font-bold text-white">{displayRating.toFixed(1)}</span>
                                    <span className="text-[10px] text-gray-500 font-bold">({displayReviewCount})</span>
                                </div>
                            </div>

                            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-[1000] tracking-tighter uppercase italic leading-[0.8] text-white">
                                {firstName} <br />
                                <span className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                                    {lastName}
                                </span>
                            </h1>
                        </div>

                        <p className="text-xl text-gray-500 font-bold leading-relaxed italic border-l-4 lg:border-l-0 lg:border-r-4 border-yellow-400/20 px-8 lg:px-0 lg:pr-8">
                            {item.ingredients || "Une création signature Mato's, préparée avec passion et les meilleurs ingrédients locaux."}
                        </p>

                        {/* Controls & Cart */}
                        <div className="space-y-8 pt-4">

                            {/* Size Selector if complex price */}
                            {typeof item.price === 'object' && item.price !== null && (
                                <div className="flex justify-center lg:justify-start gap-4">
                                    {(Object.keys(item.price) as Array<'normal' | 'xl'>).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest border transition-all ${selectedSize === size
                                                ? 'bg-white text-black border-white'
                                                : 'bg-transparent text-gray-500 border-white/10 hover:border-white hover:text-white'
                                                }`}
                                        >
                                            {size === 'xl' ? 'Grande (XL)' : 'Standard'}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Price & Add */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
                                <div className="text-5xl font-[1000] italic text-white tracking-tighter">
                                    {getPrice() * quantity} DT
                                </div>

                                <div className="flex items-center gap-2 bg-white/5 rounded-[2rem] p-2 border border-white/5">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-black text-xl">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="bg-yellow-400 text-gray-900 px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-yellow-400/20 flex items-center gap-4"
                                >
                                    <span>Ajouter</span>
                                    <ShoppingBag className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section - Integrated Grid Layout */}
                <div className="mt-32 border-t border-white/5 pt-16 space-y-12">
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter text-white flex items-center gap-4">
                            <MessageSquare className="w-6 h-6 text-yellow-400" />
                            Avis Clients <span className="opacity-40">({reviews.length})</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Review Form (Left) */}
                        <div className="lg:col-span-5">
                            {session ? (
                                <form onSubmit={handleReviewSubmit} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6 sticky top-8">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-white/60 uppercase tracking-widest">Votre avis</span>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setNewReview({ ...newReview, rating: s })}
                                                    className="transition-transform active:scale-95"
                                                >
                                                    <Star className={`w-5 h-5 ${s <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        placeholder="Partagez votre expérience..."
                                        value={newReview.comment}
                                        onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 text-white p-6 rounded-2xl font-bold focus:border-yellow-400/30 outline-none transition-all resize-none text-sm min-h-[120px]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReview}
                                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-yellow-400/10"
                                    >
                                        {isSubmittingReview ? 'Publication...' : "Publier l'avis"}
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 text-center space-y-4">
                                    <p className="text-sm font-bold text-gray-400">Connectez-vous pour partager votre avis.</p>
                                    <Link href="/login" className="inline-block text-yellow-400 font-black uppercase text-xs tracking-widest border-b border-yellow-400/20 pb-1 hover:border-yellow-400 transition-colors">
                                        Se connecter
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Reviews List (Right) */}
                        <div className="lg:col-span-7 space-y-6">
                            {reviews.length > 0 ? reviews.map((review: any) => (
                                <div key={review.id} className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 flex gap-6 hover:bg-white/[0.04] transition-colors">
                                    <div className="flex-shrink-0">
                                        <UserAvatar
                                            image={review.user?.image}
                                            name={review.user?.name}
                                            size="lg"
                                            rank={review.user?.rank}
                                            backgroundColor={review.user?.selectedBg}
                                            className={`rounded-2xl border-2 transition-all duration-300 ${review.user?.selectedFrame || 'border-white/5'}`}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-black text-white text-sm">{review.user?.name || 'Client'}</div>
                                                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Client Vérifié</div>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm italic leading-relaxed">"{review.comment}"</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 opacity-50">
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Aucun avis pour le moment</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
