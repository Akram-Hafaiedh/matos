import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// PATCH - Update reservation status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const reservationId = parseInt(id);
        if (isNaN(reservationId)) {
            return NextResponse.json({ success: false, error: 'ID invalide' }, { status: 400 });
        }

        const { status, table_number, notes } = await request.json();

        const updatedReservation = await prisma.reservations.update({
            where: { id: reservationId },
            data: {
                status,
                table_number: table_number !== undefined ? parseInt(table_number) : undefined,
                notes: notes !== undefined ? notes : undefined,
                updated_at: new Date()
            },
            include: {
                users: true
            }
        });

        // Create notification for user if they are linked
        if (updatedReservation.user_id) {
            await prisma.notifications.create({
                data: {
                    user_id: updatedReservation.user_id,
                    title: 'Mise à jour réservation',
                    message: `Votre réservation pour le ${new Date(updatedReservation.reservation_date).toLocaleDateString()} est passée au statut : ${status}`,
                    type: 'reservation_update',
                    link: `/account/reservations`,
                }
            });
        }

        // Send SMS Status Update
        try {
            const { sendReservationSMS } = await import('@/lib/sms');
            if (status === 'confirmed' || status === 'cancelled') {
                await sendReservationSMS(updatedReservation, status);
            }
        } catch (smsError) {
            console.error('Error in reservation update SMS:', smsError);
        }

        return NextResponse.json({
            success: true,
            reservation: updatedReservation
        });

    } catch (error: any) {
        console.error('Error updating reservation:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Erreur lors de la mise à jour'
        }, { status: 500 });
    }
}
