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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    try {
        const where = {
            role: 'customer',
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
                { phone: { contains: search, mode: 'insensitive' as const } },
            ]
        };

        const [totalItems, customers] = await Promise.all([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    image: true,
                    loyalty_points: true,
                    tokens: true,
                    created_at: true,
                    orders: {
                        select: {
                            total_amount: true
                        }
                    },
                    _count: {
                        select: { orders: true }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                },
                skip,
                take: limit
            })
        ]);

        const formattedCustomers = customers.map((c: any) => ({
            ...c,
            total_orders: c._count.orders,
            total_revenue: c.orders.reduce((acc: number, o: any) => acc + (o.total_amount || 0), 0)
        }));

        return NextResponse.json({
            success: true,
            customers: formattedCustomers,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        });
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
        const { userId, loyalty_points, tokens } = await req.json();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
        }

        const data: any = {};
        if (loyalty_points !== undefined) data.loyalty_points = parseInt(loyalty_points as any);
        if (tokens !== undefined) data.tokens = parseInt(tokens as any);

        if (Object.keys(data).length === 0) {
            return NextResponse.json({ success: false, error: 'No data to update' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
