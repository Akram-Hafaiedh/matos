import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    try {
        const customers = await prisma.user.findMany({
            where: {
                role: 'customer',
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                loyaltyPoints: true,
                createdAt: true,
                _count: {
                    select: { orders: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedCustomers = customers.map(c => ({
            ...c,
            totalOrders: c._count.orders
        }));

        return NextResponse.json({ success: true, customers: formattedCustomers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { userId, loyaltyPoints } = await req.json();

        if (!userId || loyaltyPoints === undefined) {
            return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { loyaltyPoints: parseInt(loyaltyPoints) }
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
