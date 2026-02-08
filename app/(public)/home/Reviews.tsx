'use client';

import { useEffect, useState } from 'react';
import { Star, ShieldCheck, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import SectionHeader from '@/components/SectionHeader';
import UserAvatar from '@/components/UserAvatar';

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

interface ReviewsProps {
    reviews?: Review[];
    currentSlide?: number;
    onSlideChange?: (index: number) => void;
}

export default function Reviews({ reviews: initialReviews = [], currentSlide: controlledSlide, onSlideChange }: ReviewsProps) {
    const [internalSlide, setInternalSlide] = useState(0);

    const isControlled = controlledSlide !== undefined;
    const activeSlideIndex = isControlled ? controlledSlide : internalSlide;

    const reviews = initialReviews;
    const totalSlides = Math.ceil(reviews.length / 3);

    const handleSlideChange = (index: number) => {
        if (onSlideChange) {
            onSlideChange(index);
        } else {
            setInternalSlide(index);
        }
    };

    const nextSlide = () => handleSlideChange((activeSlideIndex + 1) % totalSlides);
    const prevSlide = () => handleSlideChange((activeSlideIndex - 1 + totalSlides) % totalSlides);


    if (reviews.length === 0) return null;

    return (
        <section className="py-32 relative overflow-hidden bg-transparent">

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 relative z-10">
                {/* Section Header */}
                <SectionHeader
                    badge="Community Voice"
                    title={<>Ce qu'ils <br /><span className="text-yellow-400">en Disent</span></>}
                    description="Votre satisfaction est notre plus belle récompense. Découvrez les témoignages de notre communauté Mato's."
                    rightContent={totalSlides > 1 && (
                        <div className="flex gap-4">
                            <button
                                onClick={prevSlide}
                                className="w-14 h-14 rounded-2xl border border-white/10 hover:border-yellow-400/30 flex items-center justify-center text-white hover:text-yellow-400 transition-all active:scale-95 bg-white/5 backdrop-blur-3xl group shadow-xl"
                            >
                                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-14 h-14 rounded-2xl border border-white/10 hover:border-yellow-400/30 flex items-center justify-center text-white hover:text-yellow-400 transition-all active:scale-95 bg-white/5 backdrop-blur-3xl group shadow-xl"
                            >
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                />

                {/* Reviews Slider */}
                <div className="relative overflow-hidden px-2">
                    <div
                        className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
                    >
                        {[...Array(totalSlides)].map((_, slideIdx) => (
                            <div key={slideIdx} className="w-full flex-shrink-0 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {reviews.slice(slideIdx * 3, slideIdx * 3 + 3).map((review) => (
                                    <div
                                        key={review.id}
                                        className="group relative bg-gray-900/10 border border-white/5 rounded-[4rem] p-10 flex flex-col space-y-8 hover:bg-white/[0.03] hover:border-yellow-400/20 transition-all duration-700 backdrop-blur-3xl h-full shadow-3xl overflow-hidden"
                                    >
                                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-yellow-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex gap-1.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'}`} />
                                                ))}
                                            </div>
                                            <div className="bg-white/5 px-4 py-1.5 rounded-full text-[9px] font-black text-white/50 uppercase tracking-widest border border-white/5 italic">
                                                {review.menuItem.name}
                                            </div>
                                        </div>

                                        <p className="text-xl text-gray-400 font-bold leading-relaxed italic group-hover:text-white transition-colors flex-1 relative z-10">
                                            "{review.comment}"
                                        </p>

                                        <div className="flex items-center gap-5 pt-8 border-t border-white/5 mt-auto relative z-10">
                                            <div className="group-hover:scale-110 transition-transform duration-700">
                                                <UserAvatar
                                                    image={(review.user as any).image}
                                                    name={review.user.name}
                                                    size="lg"
                                                    rank={(review.user as any).rank}
                                                    backgroundColor={(review.user as any).selected_bg}
                                                    className={`w-14 h-14 rounded-2xl border-2 transition-all duration-300 ${(review.user as any).selected_frame || 'border-white/10'}`}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black text-xl italic uppercase tracking-tight">{review.user.name || 'Client Anonyme'}</h4>
                                                <div className="flex items-center gap-2 text-yellow-500 font-black text-[9px] uppercase tracking-[0.2em] mt-1 opacity-80">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    Membre {review.user.role === 'admin' ? 'Elite' : 'Privilège'}
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
                    <div className="flex justify-center gap-4">
                        {[...Array(totalSlides)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handleSlideChange(i)}
                                className={`h-1.5 rounded-full transition-all duration-700 ${i === activeSlideIndex ? 'w-12 bg-yellow-400' : 'w-3 bg-white/10 hover:bg-white/20'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
