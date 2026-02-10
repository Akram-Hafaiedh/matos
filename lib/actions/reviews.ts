'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReview(formData: {
    menuItemId: number;
    userId: string;
    rating: number;
    comment: string;
}) {
    try {
        const review = await prisma.reviews.create({
            data: {
                menu_item_id: formData.menuItemId,
                user_id: formData.userId,
                rating: formData.rating,
                comment: formData.comment,
            },
            include: {
                users: true
            }
        });

        const rank = await prisma.user.count({
            where: {
                loyalty_points: {
                    gt: review.users.loyalty_points || 0
                }
            }
        }) + 1;

        const normalizedReview = {
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            user: {
                name: review.users.name,
                image: review.users.image,
                role: review.users.role,
                rank,
                selectedBg: review.users.selected_bg,
                selectedFrame: review.users.selected_frame
            }
        };

        revalidatePath(`/menu/${formData.menuItemId}`);
        return { success: true, review: normalizedReview };
    } catch (error) {
        console.error('Error submitting review:', error);
        return { success: false, error: 'Failed to submit review' };
    }
}
