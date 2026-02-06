import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const inventory = await prisma.user_inventory.findMany({
            where: { user_id: session.user.id },
            orderBy: { unlocked_at: 'desc' }
        });

        return NextResponse.json({ success: true, inventory });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch inventory' }, { status: 500 });
    }
}
