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

        const notifications = await prisma.notification.findMany({
            where: {
                userId: (session.user as any).id,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10 // Only fetch recent ones for the dropdown
        });

        const unreadCount = await prisma.notification.count({
            where: {
                userId: (session.user as any).id,
                isRead: false
            }
        });

        return NextResponse.json({
            success: true,
            unread: unreadCount,
            notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ success: false, unread: 0, notifications: [] });
    }
}
