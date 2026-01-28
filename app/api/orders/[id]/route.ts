// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

async function getOrders() {
    try {
        const data = await fs.readFile(ORDERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveOrders(orders: any[]) {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// GET - Fetch single order
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orders = await getOrders();
        const order = orders.find((o: any) => o.id === params.id);

        if (!order) {
            return NextResponse.json({
                success: false,
                error: 'Commande introuvable'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order
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
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status } = body;

        const orders = await getOrders();
        const orderIndex = orders.findIndex((o: any) => o.id === params.id);

        if (orderIndex === -1) {
            return NextResponse.json({
                success: false,
                error: 'Commande introuvable'
            }, { status: 404 });
        }

        // Update order
        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();

        // Add timestamps for specific statuses
        if (status === 'confirmed') {
            orders[orderIndex].confirmedAt = new Date().toISOString();
        } else if (status === 'delivered') {
            orders[orderIndex].deliveredAt = new Date().toISOString();
        }

        await saveOrders(orders);

        // TODO: Send SMS to customer about status update
        // await sendStatusUpdateSMS(orders[orderIndex]);

        return NextResponse.json({
            success: true,
            order: orders[orderIndex],
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
    { params }: { params: { id: string } }
) {
    try {
        const orders = await getOrders();
        const filteredOrders = orders.filter((o: any) => o.id !== params.id);

        if (orders.length === filteredOrders.length) {
            return NextResponse.json({
                success: false,
                error: 'Commande introuvable'
            }, { status: 404 });
        }

        await saveOrders(filteredOrders);

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