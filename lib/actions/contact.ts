'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}) {
    try {
        const msg = await prisma.contact_messages.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                subject: data.subject,
                message: data.message,
                status: 'unread'
            }
        });

        revalidatePath('/dashboard/inbox'); // Admin view revalidation
        return { success: true, messageId: msg.id };
    } catch (error) {
        console.error('Error submitting contact message:', error);
        return { success: false, error: 'Failed to submit message' };
    }
}
