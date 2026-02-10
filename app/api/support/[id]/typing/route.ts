import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const ticketId = parseInt(id);
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isAdmin = (session.user as any).role === 'admin';
        const now = new Date();

        await prisma.support_tickets.update({
            where: { id: ticketId },
            data: isAdmin
                ? { last_admin_typing_at: now }
                : { last_user_typing_at: now }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating typing status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
