import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        let config = await prisma.email_settings.findFirst({
            where: { id: 1 }
        });

        if (!config) {
            config = await prisma.email_settings.create({
                data: { id: 1 }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error fetching email settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Remove id and updated_at if they exist
        const { id, updated_at, ...data } = body;

        const updated = await prisma.email_settings.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error saving email settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
