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
                menuItemId: type === 'menuItem' ? item.id : null,
                promotionId: type === 'promotion' ? item.id : null,
                itemName: item.name,
                itemPrice,
                quantity,
                selectedSize: selectedSize || null,
                choices: choices || null,
                notes: null
            };
        });

        // Create order in database
        // Create order in database
        const order = await prisma.order.create({
            data: {
                orderNumber,
                ...(userId ? { user: { connect: { id: userId } } } : {}),
                customerName: deliveryInfo.fullName,
                customerPhone: deliveryInfo.phone,
                customerEmail: deliveryInfo.email || null,
                deliveryAddress: deliveryInfo.address,
                city: deliveryInfo.city,
                notes: deliveryInfo.notes || null,
                deliveryTime: deliveryInfo.deliveryTime,
                scheduledTime: deliveryInfo.scheduledTime && deliveryInfo.deliveryTime === 'scheduled' ? (() => {
                    const [hours, minutes] = deliveryInfo.scheduledTime.split(':').map(Number);
                    if (isNaN(hours) || isNaN(minutes)) return null;
                    const d = new Date();
                    d.setHours(hours, minutes, 0, 0);
                    return d;
                })() : null,
                paymentMethod,
                orderType: orderType || 'delivery',
                subtotal: totalPrice,
                deliveryFee,
                totalAmount: finalTotal,
                status: 'pending',
                orderItems: {
                    create: orderItems
                }
            },
            include: {
                orderItems: true
            }
        });

        // Create notification for all admins
        const admins = await prisma.user.findMany({
            where: { role: 'admin' },
            select: { id: true }
        });

        for (const admin of admins) {
            await prisma.notification.create({
                data: {
                    userId: admin.id,
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

        return NextResponse.json({
            success: true,
            order,
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
            where.userId = (session.user as any).id;
        } else if (userId) {
            where.userId = userId;
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        if (search) {
            where.orderNumber = { contains: search, mode: 'insensitive' };
        }

        const [totalItems, orders] = await Promise.all([
            prisma.order.count({ where }),
            prisma.order.findMany({
                where,
                include: {
                    orderItems: {
                        include: {
                            menuItem: true,
                            promotion: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            })
        ]);


        // Transform orders to match frontend expectations
        const transformedOrders = (orders as any[]).map(order => ({
            id: order.id.toString(),
            orderNumber: order.orderNumber,
            deliveryInfo: {
                fullName: order.customerName,
                phone: order.customerPhone,
                email: order.customerEmail,
                address: order.deliveryAddress,
                city: order.city,
                notes: order.notes
            },
            cart: order.orderItems,
            paymentMethod: order.paymentMethod,
            totalPrice: order.subtotal,
            deliveryFee: order.deliveryFee,
            finalTotal: order.totalAmount,
            status: order.status,
            orderType: (order as any).orderType,
            deliveryTime: order.deliveryTime,
            scheduledTime: order.scheduledTime,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            confirmedAt: order.confirmedAt,
            preparingAt: order.preparingAt,
            readyAt: order.readyAt,
            outForDeliveryAt: order.outForDeliveryAt,
            deliveredAt: order.deliveredAt,
            cancelledAt: order.cancelledAt,
            cancelMessage: order.cancelMessage,
            user: order.user
        }));

        return NextResponse.json({
            success: true,
            orders: transformedOrders,
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