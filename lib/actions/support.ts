'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createSupportTicket(data: {
    userId?: string;
    subject: string;
    description: string;
    priority: string;
    orderNumber?: string;
}) {
    try {
        let orderId = undefined;
        if (data.orderNumber) {
            const orderBuf = await prisma.orders.findUnique({
                where: { order_number: data.orderNumber }
            });
            if (orderBuf) orderId = orderBuf.id;
        }

        const ticket = await prisma.support_tickets.create({
            data: {
                user_id: data.userId || null,
                subject: data.subject,
                description: data.description,
                priority: data.priority,
                order_id: orderId,
                updated_at: new Date()
            }
        });

        revalidatePath('/support');
        return { success: true, ticketId: ticket.id };
    } catch (error) {
        console.error('Error creating support ticket:', error);
        return { success: false, error: 'Failed to create support ticket' };
    }
}
