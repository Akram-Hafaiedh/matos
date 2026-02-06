import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, unread: 0, notifications: [] });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [notifications, totalItems, unreadCount] = await Promise.all([
            prisma.notifications.findMany({
                where: {
                    user_id: (session.user as any).id,
                },
                orderBy: {
                    created_at: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.notifications.count({
                where: {
                    user_id: (session.user as any).id,
                }
            }),
            prisma.notifications.count({
                where: {
                    user_id: (session.user as any).id,
                    is_read: false
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            unread: unreadCount,
            notifications,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ success: false, unread: 0, notifications: [] });
    }
}

// PATCH - Mark a notification as read
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { id, all } = body;

        if (all) {
            await prisma.notifications.updateMany({
                where: {
                    user_id: (session.user as any).id,
                    is_read: false
                },
                data: {
                    is_read: true
                }
            });
        } else if (id) {
            await prisma.notifications.update({
                where: {
                    id: parseInt(id),
                    user_id: (session.user as any).id
                },
                data: {
                    is_read: true
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }
}
