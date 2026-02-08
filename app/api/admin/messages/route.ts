import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const messages = await prisma.contact_messages.findMany({
            orderBy: { created_at: 'desc' }
        });
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json();
        const updated = await prisma.contact_messages.update({
            where: { id },
            data: { status }
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating message status:', error);
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get('id') || '');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await prisma.contact_messages.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
