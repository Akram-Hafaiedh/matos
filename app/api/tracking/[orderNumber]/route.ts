import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const { orderNumber } = await params;

        // Find order by order number
        // We select minimal fields associated with public tracking to ensure privacy
        const order = await prisma.orders.findUnique({
            where: { order_number: orderNumber },
            include: {
                order_items: {
                    select: {
                        item_name: true,
                        item_price: true,
                        quantity: true,
                        selected_size: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({
                success: false,
                error: 'Commande introuvable'
            }, { status: 404 });
        }

        // Return order with public-safe data
        return NextResponse.json({
            success: true,
            order: {
                orderNumber: order.order_number,
                status: order.status,
                orderType: order.order_type,
                createdAt: order.created_at,
                confirmedAt: order.confirmed_at,
                preparingAt: order.preparing_at,
                readyAt: order.ready_at,
                outForDeliveryAt: order.out_for_delivery_at,
                deliveredAt: order.delivered_at,
                cancelledAt: order.cancelled_at,
                cancelMessage: order.cancel_message,
                deliveryFee: order.delivery_fee,
                totalAmount: order.total_amount,
                paymentMethod: order.payment_method,
                deliveryInfo: {
                    fullName: order.customer_name,
                    phone: order.customer_phone,
                    address: order.delivery_address,
                    city: order.city
                },
                cart: order.order_items.map(item => ({
                    quantity: item.quantity,
                    selectedSize: item.selected_size,
                    item: {
                        name: item.item_name,
                        price: item.item_price
                    }
                }))
            }
        });

    } catch (error) {
        console.error('Error fetching public order:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur serveur'
        }, { status: 500 });
    }
}
