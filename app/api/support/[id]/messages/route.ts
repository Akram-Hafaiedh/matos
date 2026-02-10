import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const ticketId = parseInt(id);
        const body = await request.json();
        const { message, attachments } = body;

        if (!message && (!attachments || attachments.length === 0)) {
            return NextResponse.json({
                success: false,
                error: 'Le message ou une pièce jointe est requis'
            }, { status: 400 });
        }

        // Verify ticket existence and ownership
        const ticket = await prisma.support_tickets.findUnique({
            where: { id: ticketId }
        });

        if (!ticket) {
            return NextResponse.json({
                success: false,
                error: 'Ticket non trouvé'
            }, { status: 404 });
        }

        const isAdmin = (session.user as any).role === 'admin';

        if (!isAdmin && ticket.user_id !== (session.user as any).id) {
            return NextResponse.json({
                success: false,
                error: 'Accès non autorisé'
            }, { status: 403 });
        }

        const newMessage = await prisma.ticket_messages.create({
            data: {
                message: message || '',
                attachments: attachments || [],
                ticket_id: ticketId,
                user_id: (session.user as any).id,
                is_admin: isAdmin
            },
            include: {
                users: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        });

        // Create notification for the user if an admin responded
        if (isAdmin) {
            await prisma.notifications.create({
                data: {
                    user_id: ticket.user_id!,
                    title: 'Nouveau message de support',
                    message: `Un admin a répondu à votre ticket #${ticket.id}`,
                    type: 'ticket_response',
                    link: `/account/tickets/${ticket.id}`,
                }
            });
        }

        // Optionally update ticket status if user responds to a closed/resolved ticket
        if (!isAdmin && (ticket.status === 'resolved' || ticket.status === 'closed')) {
            await prisma.support_tickets.update({
                where: { id: ticketId },
                data: { status: 'open' }
            });
        }

        return NextResponse.json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        console.error('Error adding ticket message:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de l\'envoi du message'
        }, { status: 500 });
    }
}
