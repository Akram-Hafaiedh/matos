'use client';

import { useEffect, useState } from 'react';
import { Star, ShieldCheck, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface User {
    name: string | null;
    role: string;
    image: string | null;
}

interface MenuItem {
    name: string;
}

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    user: User;
    menuItem: MenuItem;
}

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeReviews = async () => {
            try {
                const res = await fetch('/api/reviews?home=true');
                const data = await res.json();
                setReviews(data);
            } catch (error) {
                console.error('Error fetching home reviews:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeReviews();
    }, []);

    const totalSlides = Math.ceil(reviews.length / 3);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

    if (loading) {
        return (
            <section className="py-20 px-4 bg-black flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            </section>
        );
    }

    if (reviews.length === 0) return null;

    return (
        <section className="py-20 px-4 bg-black relative overflow-hidden">
            {/* Background Signature Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-yellow-400/5 blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-px bg-yellow-400/30"></div>
                            <span className="text-yellow-400 font-black uppercase text-[10px] tracking-[0.4em]">Community Voice</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-[1000] text-white italic tracking-tighter uppercase leading-[0.85]">
                            Ce qu'ils en <span className="text-yellow-400">Disent</span>
                        </h2>
                    </div>

                    {/* Navigation Arrows */}
                    {totalSlides > 1 && (
                        <div className="flex gap-4">
                            <button
                                onClick={prevSlide}
                                className="w-14 h-14 rounded-2xl border-2 border-white/5 hover:border-yellow-400/30 flex items-center justify-center text-white hover:text-yellow-400 transition-all active:scale-95 bg-gray-950/50 backdrop-blur-xl"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-14 h-14 rounded-2xl border-2 border-white/5 hover:border-yellow-400/30 flex items-center justify-center text-white hover:text-yellow-400 transition-all active:scale-95 bg-gray-950/50 backdrop-blur-xl"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Reviews Slider */}
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-1000 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {[...Array(totalSlides)].map((_, slideIdx) => (
                            <div key={slideIdx} className="w-full flex-shrink-0 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {reviews.slice(slideIdx * 3, slideIdx * 3 + 3).map((review) => (
                                    <div
                                        key={review.id}
                                        className="group relative bg-gray-950/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col space-y-6 hover:bg-white/[0.02] transition-all duration-500 backdrop-blur-3xl h-full"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'}`} />
                                                ))}
                                            </div>
                                            <div className="bg-yellow-400/10 px-3 py-1 rounded-full text-[8px] font-black text-yellow-400 uppercase tracking-widest border border-yellow-400/20 italic">
                                                {review.menuItem.name}
                                            </div>
                                        </div>

                                        <p className="text-base text-gray-400 font-bold leading-relaxed italic group-hover:text-gray-300 transition-colors flex-1">
                                            "{review.comment}"
                                        </p>

                                        <div className="flex items-center gap-4 pt-6 border-t border-white/5 mt-auto">
                                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-2xl border border-white/5">
                                                {review.user.image || '👤'}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black text-lg italic uppercase">{review.user.name || 'Client Anonyme'}</h4>
                                                <div className="flex items-center gap-1.5 text-yellow-500/80 font-bold text-[8px] uppercase tracking-widest mt-0.5">
                                                    <ShieldCheck className="w-2.5 h-2.5" />
                                                    {review.user.role}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Navigation */}
                {totalSlides > 1 && (
                    <div className="flex justify-center gap-3">
                        {[...Array(totalSlides)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-yellow-400' : 'w-2 bg-white/10 hover:bg-white/20'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
