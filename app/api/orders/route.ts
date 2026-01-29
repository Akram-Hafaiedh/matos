// app/api/orders/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { cart, deliveryInfo, paymentMethod, totalPrice, deliveryFee, finalTotal } = body;

        // Generate unique order number
        const orderNumber = `MAT${Date.now().toString().slice(-6)}`;

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
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId,
                customerName: deliveryInfo.fullName,
                customerPhone: deliveryInfo.phone,
                customerEmail: deliveryInfo.email || null,
                deliveryAddress: deliveryInfo.address,
                city: deliveryInfo.city,
                notes: deliveryInfo.notes || null,
                deliveryTime: deliveryInfo.deliveryTime,
                scheduledTime: deliveryInfo.scheduledTime ? new Date(deliveryInfo.scheduledTime) : null,
                paymentMethod,
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

        // TODO: Send SMS notification to restaurant
        // await sendSMSToRestaurant(order);

        // TODO: Send SMS confirmation to customer
        // await sendSMSToCustomer(order);

        return NextResponse.json({
            success: true,
            order,
            message: 'Commande créée avec succès'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la création de la commande'
        }, { status: 500 });
    }
}


// GET - Fetch all orders (with optional filtering)
export async function GET(request: NextRequest) {
    try {

        const session = await getServerSession(authOptions);

        // Check if user is admin
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = searchParams.get('limit');

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }

        const orders = await prisma.order.findMany({
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
            take: limit ? parseInt(limit) : undefined
        });


        // Transform orders to match frontend expectations
        const transformedOrders = orders.map(order => ({
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
            deliveryTime: order.deliveryTime,
            scheduledTime: order.scheduledTime,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            user: order.user
        }));

        return NextResponse.json({
            success: true,
            orders: transformedOrders,
            count: transformedOrders.length
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération des commandes'
        }, { status: 500 });
    }
}