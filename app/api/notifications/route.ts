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
            prisma.notification.findMany({
                where: {
                    userId: (session.user as any).id,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.notification.count({
                where: {
                    userId: (session.user as any).id,
                }
            }),
            prisma.notification.count({
                where: {
                    userId: (session.user as any).id,
                    isRead: false
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
            await prisma.notification.updateMany({
                where: {
                    userId: (session.user as any).id,
                    isRead: false
                },
                data: {
                    isRead: true
                }
            });
        } else if (id) {
            await prisma.notification.update({
                where: {
                    id: parseInt(id),
                    userId: (session.user as any).id
                },
                data: {
                    isRead: true
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }
}
