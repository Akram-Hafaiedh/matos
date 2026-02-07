import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import PromosContent from './PromosContent';

export const revalidate = 60; // Regenerate at most once per minute

export default async function PromosPage() {
    // Fetch active promotions on the server
    const rawPromotions = await prisma.promotions.findMany({
        where: {
            is_active: true,
            OR: [
                { end_date: null },
                { end_date: { gte: new Date() } }
            ]
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    // Map API data to UI requirements (Sync with PromosContent expectations)
    const initialPromos = rawPromotions.map((p) => ({
        id: p.id.toString(),
        title: p.name,
        badge: p.badge_text || 'SPECIAL',
        desc: p.description,
        price: p.price ? `${p.price.toFixed(1)} DT` : 'Varies',
        oldPrice: p.original_price ? `${p.original_price.toFixed(1)} DT` : null,
        image: p.image_url,
        tag: p.tag,
        isHot: p.is_hot,
        selectionRules: p.selection_rules ? (typeof p.selection_rules === 'string' ? JSON.parse(p.selection_rules) : p.selection_rules) : null,
        rawItem: {
            ...p,
            imageUrl: p.image_url,
            originalPrice: p.original_price,
            selectionRules: p.selection_rules,
            isHot: p.is_hot,
            badgeText: p.badge_text,
            badgeColor: p.badge_color
        }
    }));

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-400 rounded-full animate-spin"></div>
                    <p className="text-yellow-400 font-black uppercase text-xs tracking-[0.5em] animate-pulse">Extraction des Protocoles</p>
                </div>
            </div>
        }>
            <PromosContent initialPromos={initialPromos} />
        </Suspense>
    );
}
