// app/api/orders/[id]/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

import { LoyaltyService } from '@/lib/services/LoyaltyService';

// GET - Fetch single order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: identifier } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        // Try lookup by ID if numeric, otherwise try order_number
        const isNumeric = /^\d+$/.test(identifier);
        let order = null;

        if (isNumeric) {
            order = await prisma.orders.findUnique({
                where: { id: parseInt(identifier) },
                include: {
                    order_items: {
                        include: {
                            menu_items: true
                        }
                    },
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });
        }

        // If not found by ID or not numeric, try looking up by order_number
        if (!order) {
            order = await prisma.orders.findUnique({
                where: { order_number: identifier },
                include: {
                    order_items: {
                        include: {
                            menu_items: true
                        }
                    },
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });
        }

        if (!order) {
            return NextResponse.json({
                success: false,
                error: 'Commande introuvable'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order: {
                ...order,
                id: order.id.toString(),
                // Grouping delivery info for frontend ease, but using snake_case keys
                delivery_info: {
                    full_name: order.customer_name,
                    phone: order.customer_phone,
                    email: order.customer_email,
                    address: order.delivery_address,
                    city: order.city,
                    notes: order.notes
                },
                cart: order.order_items.map((oi: any) => ({
                    ...oi,
                    item_name: oi.item_name,
                    item_price: oi.item_price,
                    selected_size: oi.selected_size,
                    menu_item: oi.menu_items
                })),
                user: order.users
            }
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération de la commande'
        }, { status: 500 });
    }
}

// PATCH - Update order status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: orderIdStr } = await params;
        const session = await getServerSession(authOptions);

        // Check if user is admin
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const body = await request.json();
        const { status, cancelMessage } = body;

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({
                success: false,
                error: 'Statut invalide'
            }, { status: 400 });
        }

        // Update order
        const updateData: any = {
            status,
            updated_at: new Date()
        };

        if (cancelMessage) {
            updateData.cancel_message = cancelMessage;
        }

        // Set status-specific timestamps
        if (status === 'confirmed') updateData.confirmed_at = new Date();
        else if (status === 'preparing') updateData.preparing_at = new Date();
        else if (status === 'ready') updateData.ready_at = new Date();
        else if (status === 'out_for_delivery') updateData.out_for_delivery_at = new Date();
        else if (status === 'delivered') updateData.delivered_at = new Date();
        else if (status === 'cancelled') {
            updateData.cancelled_at = new Date();
        }


        const orderId = parseInt(orderIdStr);

        // Get current order to check previous status
        const currentOrder = await prisma.orders.findUnique({
            where: { id: orderId }
        });

        if (!currentOrder) {
            return NextResponse.json({ success: false, error: 'Commande introuvable' }, { status: 404 });
        }

        const order = await prisma.orders.update({
            where: { id: orderId },
            data: updateData,
            include: {
                users: true
            }
        });

        // Award loyalty points if newly delivered
        if (status === 'delivered' && !currentOrder.points_awarded && order.user_id) {

            // Calculate Multipliers from Database
            const { xpMultiplier, tokenMultiplier } = await LoyaltyService.getLoyaltyBoosts(order.user_id);
            const baseAmount = Math.floor(order.total_amount);

            // 1. Calculate XP (Loyalty Points)
            const finalXP = Math.floor(baseAmount * xpMultiplier);

            // 2. Calculate Tokens (Jetons) - For purchases, we award tokens if tokenMultiplier > 1
            // e.g. Token Magnet (3.0) adds 2 bonus tokens per TND.
            const tokenRate = Math.max(0, tokenMultiplier - 1);
            const finalTokens = Math.floor(baseAmount * tokenRate);

            await prisma.$transaction([
                prisma.user.update({
                    where: { id: order.user_id },
                    data: {
                        loyalty_points: { increment: finalXP },
                        tokens: { increment: finalTokens }
                    }
                }),
                prisma.orders.update({
                    where: { id: orderId },
                    data: { points_awarded: true }
                })
            ]);
        }

        // Create notification for the user
        if (order.user_id) {
            const statusLabels: { [key: string]: string } = {
                'pending': 'en attente',
                'confirmed': 'confirmée',
                'preparing': 'en préparation',
                'ready': 'prête pour retrait',
                'out_for_delivery': 'en livraison',
                'delivered': 'livrée',
                'cancelled': 'annulée'
            };

            const isPickup = order.order_type === 'pickup';
            const statusLabel = status === 'delivered'
                ? (isPickup ? 'retirée' : 'livrée')
                : (statusLabels[status] || status);

            await prisma.notifications.create({
                data: {
                    user_id: order.user_id,
                    title: status === 'delivered'
                        ? (isPickup ? 'Signal Terminé - Commande Retirée' : 'Signal Terminé - Commande Livrée')
                        : `Commande ${statusLabel}`,
                    message: `Le statut de votre commande #${order.order_number} est passé à: ${statusLabel}`,
                    type: 'order_update',
                    link: `/account/orders/${order.id}`,
                }
            });
        }

        return NextResponse.json({
            success: true,
            order: {
                ...order,
                id: order.id.toString(),
                delivery_info: {
                    full_name: order.customer_name,
                    phone: order.customer_phone,
                    email: order.customer_email,
                    address: order.delivery_address,
                    city: order.city,
                    notes: order.notes
                },
                cart: (order as any).order_items?.map((oi: any) => ({
                    ...oi,
                    item_name: oi.item_name,
                    item_price: oi.item_price,
                    selected_size: oi.selected_size
                })),
                user: order.users
            },
            message: 'Statut mis à jour avec succès'
        });

    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la mise à jour'
        }, { status: 500 });
    }
}

// DELETE - Cancel/delete order
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        // Check if user is admin
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        await prisma.orders.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({
            success: true,
            message: 'Commande supprimée avec succès'
        });

    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la suppression'
        }, { status: 500 });
    }
}