import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: isAdmin
                ? { lastAdminTypingAt: now }
                : { lastUserTypingAt: now }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating typing status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
