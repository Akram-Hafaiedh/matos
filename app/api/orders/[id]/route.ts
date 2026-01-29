// app/api/orders/[id]/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch single order
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const order = await prisma.order.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                orderItems: {
                    include: {
                        menuItem: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
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

        const session = await getServerSession(authOptions);

        // Check if user is admin
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({
                success: false,
                error: 'Statut invalide'
            }, { status: 400 });
        }

        // Update order
        const updateData: any = {
            status,
            updatedAt: new Date()
        };


        const order = await prisma.order.update({
            where: { id: parseInt(params.id) },
            data: updateData,
            include: {
                orderItems: true,
                user: true
            }
        });


        // TODO: Send SMS to customer about status update
        // await sendStatusUpdateSMS(order);

        return NextResponse.json({
            success: true,
            order,
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

        const session = await getServerSession(authOptions);

        // Check if user is admin
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        await prisma.order.delete({
            where: { id: parseInt(params.id) }
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