import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HQ_LAT, HQ_LNG } from '@/lib/delivery-estimation';

// Basic Haversine for distance only
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const toRad = (d: number) => d * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

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
                    city: order.city,
                    lat: order.lat,
                    lng: order.lng
                },
                cart: order.order_items.map(item => ({
                    quantity: item.quantity,
                    selectedSize: item.selected_size,
                    item: {
                        name: item.item_name,
                        price: item.item_price
                    }
                })),
                estimates: {
                    confidence: order.estimated_delivery_confidence,
                    totalTime: order.estimated_total_time,
                    travelTime: order.estimated_travel_time,
                    prepTime: order.estimated_prep_time,
                    actualDeliveryTime: order.actual_delivery_time,
                    distanceKm: order.lat && order.lng ? Number(calculateDistance(HQ_LAT, HQ_LNG, order.lat, order.lng).toFixed(2)) : 0,
                    range: (() => {
                        const total = order.estimated_total_time || 0;
                        const conf = order.estimated_delivery_confidence || 'medium';
                        const variance = conf === 'high' ? 0.1 : conf === 'medium' ? 0.15 : 0.2;
                        return {
                            min: Math.round(total * (1 - variance)),
                            max: Math.round(total * (1 + variance))
                        };
                    })()
                }
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
