// app/api/orders/route.ts - Reload trigger
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { cart, deliveryInfo, paymentMethod, totalPrice, deliveryFee, finalTotal, orderType } = body;

        // Generate unique order number
        // Generate unique order number - More robust than just slice(-6)
        const orderNumber = `MAT${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        const session = await getServerSession(authOptions);
        const userId = session?.user ? (session.user as any).id : null;

        // Prepare order items from cart
        const orderItems = Object.entries(cart).map(([key, cartItem]: [string, any]) => {
            const { item, quantity, selectedSize, type, choices } = cartItem;
            let itemPrice = 0;

            if (type === 'promotion') {
                itemPrice = item.price || 0;
            } else {
                if (typeof item.price === 'number') {
                    itemPrice = item.price;
                } else if (item.price && selectedSize) {
                    itemPrice = item.price[selectedSize] || 0;
                }
            }

            return {
                menu_item_id: type === 'menuItem' ? item.id : null,
                promotion_id: type === 'promotion' ? item.id : null,
                item_name: item.name,
                item_price: itemPrice,
                quantity,
                selected_size: selectedSize || null,
                choices: choices || null,
                notes: null
            };
        });

        // Create order in database
        const order = await prisma.orders.create({
            data: {
                order_number: orderNumber,
                ...(userId ? { users: { connect: { id: userId } } } : {}),
                customer_name: deliveryInfo.fullName,
                customer_phone: deliveryInfo.phone,
                customer_email: deliveryInfo.email || null,
                delivery_address: deliveryInfo.address,
                city: deliveryInfo.city,
                notes: deliveryInfo.notes || null,
                delivery_time: deliveryInfo.deliveryTime,
                scheduled_time: deliveryInfo.scheduledTime && deliveryInfo.deliveryTime === 'scheduled' ? (() => {
                    const [hours, minutes] = deliveryInfo.scheduledTime.split(':').map(Number);
                    if (isNaN(hours) || isNaN(minutes)) return null;
                    const d = new Date();
                    d.setHours(hours, minutes, 0, 0);
                    return d;
                })() : null,
                payment_method: paymentMethod,
                order_type: orderType || 'delivery',
                subtotal: totalPrice,
                delivery_fee: deliveryFee,
                total_amount: finalTotal,
                status: 'pending',
                updated_at: new Date(),
                order_items: {
                    create: orderItems
                }
            },
            include: {
                order_items: {
                    include: {
                        menu_items: true,
                        promotions: true
                    }
                }
            }
        });

        // Create notification for all admins
        const admins = await prisma.user.findMany({
            where: { role: 'admin' },
            select: { id: true }
        });

        for (const admin of admins) {
            await prisma.notifications.create({
                data: {
                    user_id: admin.id,
                    title: 'Nouvelle commande',
                    message: `La commande #${orderNumber} a été passée par ${deliveryInfo.fullName}`,
                    type: 'order_update',
                    link: `/dashboard/orders`,
                }
            });
        }

        // TODO: Send SMS notification to restaurant
        // await sendSMSToRestaurant(order);

        // TODO: Send SMS confirmation to customer
        // await sendSMSToCustomer(order);

        // Process Quests and Loyalty
        let completedQuests: any[] = [];
        if (userId) {
            try {
                // We run this asynchronously but await it here to return instant feedback
                // In a high-scale app, this might be a background job
                const { QuestService } = await import('@/lib/services/QuestService');
                completedQuests = await QuestService.processOrderQuests(userId, order);
            } catch (err) {
                console.error('Quest processing error:', err);
                // Don't fail the order if quest fails
            }
        }

        return NextResponse.json({
            success: true,
            order,
            completedQuests,
            message: 'Commande créée avec succès'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Erreur lors de la création de la commande'
        }, { status: 500 });
    }
}


// GET - Fetch all orders (with optional filtering)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const isAdmin = (session.user as any)?.role === 'admin';
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limitParam = searchParams.get('limit');
        const limit = parseInt(limitParam || '10');
        const skip = (page - 1) * limit;
        const userId = searchParams.get('userId');

        const where: any = {};

        if (!isAdmin) {
            where.user_id = (session.user as any).id;
        } else if (userId) {
            where.user_id = userId;
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        if (search) {
            where.order_number = { contains: search, mode: 'insensitive' };
        }

        const [totalItems, orders] = await Promise.all([
            prisma.orders.count({ where }),
            prisma.orders.findMany({
                where,
                include: {
                    order_items: {
                        include: {
                            menu_items: true,
                            promotions: true
                        }
                    },
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                },
                skip,
                take: limit
            })
        ]);


        return NextResponse.json({
            success: true,
            orders: orders.map(order => ({
                ...order,
                id: order.id.toString(),
                // Keep the 'cart' alias if it helps, but use snake_case for items
                cart: order.order_items.map((oi: any) => ({
                    ...oi,
                    item_name: oi.item_name,
                    item_price: oi.item_price,
                    selected_size: oi.selected_size,
                    menu_item: oi.menu_items,
                    promotion: oi.promotions
                })),
                user: order.users
            })),
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération des commandes'
        }, { status: 500 });
    }
}