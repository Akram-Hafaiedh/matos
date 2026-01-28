import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');


// Ensure data directory exists
async function ensureDataDirectory() {
    const dataDir = path.join(process.cwd(), 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// Read orders from file
async function getOrders() {
    try {
        await ensureDataDirectory();
        const data = await fs.readFile(ORDERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        return [];
    }
}
async function saveOrders(orders: any[]) {
    await ensureDataDirectory();
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Generate unique order ID and number
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const orderNumber = `MAT${Date.now().toString().slice(-6)}`;

        // Create order object
        const order = {
            id: orderId,
            orderNumber,
            cart: body.cart,
            deliveryInfo: body.deliveryInfo,
            paymentMethod: body.paymentMethod,
            totalPrice: body.totalPrice,
            deliveryFee: body.deliveryFee,
            finalTotal: body.finalTotal,
            status: 'pending',
            orderDate: body.orderDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Read existing orders
        const orders = await getOrders();

        // Add new order
        orders.push(order);

        // Save to file
        await saveOrders(orders);

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
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = searchParams.get('limit');

        let orders = await getOrders();

        // Filter by status if provided
        if (status) {
            orders = orders.filter((order: any) => order.status === status);
        }

        // Sort by date (newest first)
        orders.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Limit results if specified
        if (limit) {
            orders = orders.slice(0, parseInt(limit));
        }

        return NextResponse.json({
            success: true,
            orders,
            count: orders.length
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération des commandes'
        }, { status: 500 });
    }
}