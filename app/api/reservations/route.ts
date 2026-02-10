import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST - Create a new reservation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customerName, customerPhone, customerEmail, reservationDate, partySize, notes } = body;

        // Validation
        if (!customerName || !customerPhone || !reservationDate || !partySize) {
            return NextResponse.json({
                success: false,
                error: 'Champs obligatoires manquants'
            }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const userId = session?.user ? (session.user as any).id : null;

        // Create reservation in database
        const reservation = await prisma.reservations.create({
            data: {
                user_id: userId,
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerEmail || null,
                reservation_date: new Date(reservationDate),
                party_size: parseInt(partySize),
                notes: notes || null,
                status: 'pending',
                updated_at: new Date()
            }
        });

        // Create notification for admins
        const admins = await prisma.user.findMany({
            where: { role: 'admin' },
            select: { id: true }
        });

        for (const admin of admins) {
            await prisma.notifications.create({
                data: {
                    user_id: admin.id,
                    title: 'Nouvelle réservation',
                    message: `Une nouvelle réservation a été faite par ${customerName} pour le ${new Date(reservationDate).toLocaleString()}`,
                    type: 'reservation_new',
                    link: `/dashboard/reservations`,
                }
            });
        }

        // Send SMS to customer (Pending Confirmation)
        try {
            const { sendReservationSMS } = await import('@/lib/sms');
            await sendReservationSMS(reservation, 'pending');
        } catch (smsError) {
            console.error('Error in reservation SMS:', smsError);
        }

        return NextResponse.json({
            success: true,
            reservation,
            message: 'Réservation créée avec succès'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating reservation:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Erreur lors de la création de la réservation'
        }, { status: 500 });
    }
}

// GET - Fetch reservations
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
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const where: any = {};

        if (!isAdmin) {
            where.user_id = (session.user as any).id;
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        const [totalItems, reservations] = await Promise.all([
            prisma.reservations.count({ where }),
            prisma.reservations.findMany({
                where,
                include: {
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    reservation_date: 'desc'
                },
                skip,
                take: limit
            })
        ]);

        return NextResponse.json({
            success: true,
            reservations,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        });

    } catch (error) {
        console.error('Error fetching reservations:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération des réservations'
        }, { status: 500 });
    }
}
