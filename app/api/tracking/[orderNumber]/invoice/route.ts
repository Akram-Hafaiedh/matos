import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const { orderNumber } = await params;

        if (!orderNumber) {
            return NextResponse.json(
                { error: 'Numéro de commande manquant' },
                { status: 400 }
            );
        }

        // Find order by order number ONLY for public access security
        const order = await prisma.orders.findUnique({
            where: { order_number: orderNumber },
            include: {
                order_items: {
                    include: {
                        menu_items: true,
                        promotions: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Commande introuvable' },
                { status: 404 }
            );
        }

        // Fetch global settings for tax and brand identity (VAT, Stamp Duty, address, template)
        const settings = await prisma.global_settings.findFirst();

        return NextResponse.json({
            success: true,
            order,
            settings: settings || {
                address: "2015, 1 Rue Abderrazak Karabaka, Carthage",
                phone: "99 956 608",
                vat_rate: 0.19,
                stamp_duty: 1.0,
                invoice_template: 'standard'
            }
        });
    } catch (error) {
        console.error('Error fetching public invoice data:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des données' },
            { status: 500 }
        );
    }
}
