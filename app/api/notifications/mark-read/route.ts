import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        await prisma.notifications.updateMany({
            where: {
                user_id: (session.user as any).id,
                is_read: false
            },
            data: {
                is_read: true
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
