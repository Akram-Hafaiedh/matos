import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch all necessary data in parallel
        const [orders, reservations, settings] = await Promise.all([
            prisma.orders.findMany({
                where: {
                    created_at: { gte: today }
                }
            }),
            prisma.reservations.findMany({
                where: {
                    reservation_date: { gte: today }
                }
            }),
            prisma.global_settings.findFirst({
                where: { id: 1 }
            })
        ]);

        const vatRate = settings?.vat_rate ?? 0.19;
        const stampDuty = settings?.stamp_duty ?? 1.0;

        // Aggregate Today Stats
        const todayRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const todayStampDuty = orders.length * stampDuty;

        // HT calculation: (TTC - StampDuty) / (1 + VAT)
        const todayNetRevenue = orders.reduce((sum, o) => {
            const ttcWithoutStamp = (o.total_amount || 0) - stampDuty;
            const ht = ttcWithoutStamp / (1 + vatRate);
            return sum + ht;
        }, 0);

        const todayVat = todayRevenue - todayNetRevenue - todayStampDuty;

        // Aggregate Today Reservation Stats
        const todayReservations = reservations.length;
        const pendingReservations = reservations.filter(r => r.status === 'pending').length;

        // Fetch Global Stats
        const [allOrders, totalReservations, totalOrdersCount] = await Promise.all([
            prisma.orders.findMany({
                select: { total_amount: true }
            }),
            prisma.reservations.count(),
            prisma.orders.count()
        ]);

        const globalRevenue = allOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const globalStampDutyAgg = totalOrdersCount * stampDuty;

        const globalNetRevenue = allOrders.reduce((sum, o) => {
            const ttcWithoutStamp = (o.total_amount || 0) - stampDuty;
            const ht = ttcWithoutStamp / (1 + vatRate);
            return sum + ht;
        }, 0);

        const globalVat = globalRevenue - globalNetRevenue - globalStampDutyAgg;

        return NextResponse.json({
            success: true,
            stats: {
                today: {
                    revenue: todayRevenue,
                    netRevenue: todayNetRevenue,
                    orders: orders.length,
                    vat: todayVat,
                    stampDuty: todayStampDuty,
                    reservations: todayReservations,
                    pendingReservations: pendingReservations
                },
                global: {
                    revenue: globalRevenue,
                    netRevenue: globalNetRevenue,
                    orders: totalOrdersCount,
                    vat: globalVat,
                    stampDuty: globalStampDutyAgg,
                    reservations: totalReservations,
                }
            },
            config: {
                vatRate,
                stampDuty
            }
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
