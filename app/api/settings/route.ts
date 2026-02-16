
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const settings = await prisma.global_settings.findFirst();

        // Return default settings if none exist
        if (!settings) {
            return NextResponse.json({
                address: "2015, 1 Rue Abderrazak Karabaka, Carthage",
                phone: "99 956 608",
                lat: 36.8391,
                lng: 10.3200,
                facebook: "",
                instagram: "",
                tiktok: "",
                whatsapp: "",
                google_maps_url: "",
                invoice_template: "standard"
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is admin
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const data = await req.json();

        // Validation: Ensure required fields are not empty
        if (!data.address || !data.phone) {
            return NextResponse.json(
                { error: 'Address and Phone are required' },
                { status: 400 }
            );
        }

        // Upsert settings (update if exists, create if not)
        // We assume ID 1 for global settings as per schema default
        const settings = await prisma.global_settings.upsert({
            where: { id: 1 },
            update: {
                address: data.address,
                phone: data.phone,
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng),
                facebook: data.facebook || null,
                instagram: data.instagram || null,
                tiktok: data.tiktok || null,
                whatsapp: data.whatsapp || null,
                google_maps_url: data.google_maps_url || null,
                vat_rate: parseFloat(data.vat_rate) || 0.19,
                stamp_duty: parseFloat(data.stamp_duty) || 1.0,
                invoice_template: data.invoice_template || "standard",
                updated_at: new Date()
            },
            create: {
                id: 1,
                address: data.address,
                phone: data.phone,
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng),
                facebook: data.facebook || null,
                instagram: data.instagram || null,
                tiktok: data.tiktok || null,
                whatsapp: data.whatsapp || null,
                google_maps_url: data.google_maps_url || null,
                vat_rate: parseFloat(data.vat_rate) || 0.19,
                stamp_duty: parseFloat(data.stamp_duty) || 1.0,
                invoice_template: data.invoice_template || "standard",
                updated_at: new Date()
            },
        });

        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
