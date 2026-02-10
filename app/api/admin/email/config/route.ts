import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { encrypt, decrypt } from '@/lib/crypto';

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

        // Return a masked password to the UI if one exists
        if (config.password) {
            return NextResponse.json({
                ...config,
                password: '••••••••••••••••' // Masked for UI
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
        const { id, updated_at, ...data } = body;

        // Encrypt password if it was provided and is not the mask
        if (data.password && data.password !== '••••••••••••••••') {
            data.password = encrypt(data.password);
        } else if (data.password === '••••••••••••••••') {
            // If they sent the mask, don't change the existing password
            delete data.password;
        }

        const updated = await prisma.email_settings.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });

        return NextResponse.json({
            ...updated,
            password: '••••••••••••••••'
        });
    } catch (error) {
        console.error('Error saving email settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
