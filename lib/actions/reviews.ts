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

        revalidatePath(`/menu/${formData.menuItemId}`);
        return { success: true, review };
    } catch (error) {
        console.error('Error submitting review:', error);
        return { success: false, error: 'Failed to submit review' };
    }
}
