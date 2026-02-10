import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { encrypt, decrypt } from '@/lib/crypto';

export async function GET() {
    try {
        let config = await prisma.sms_settings.findFirst({
            where: { id: 1 }
        });

        if (!config) {
            config = await prisma.sms_settings.create({
                data: { id: 1, provider: 'simulator', is_active: false }
            });
        }

        // Return masked values to the UI
        if (config.api_key) config.api_key = '••••••••••••••••';
        if (config.api_secret) config.api_secret = '••••••••••••••••';

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error fetching SMS settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, updated_at, ...data } = body;

        // Encrypt api_key if provided and not masked
        if (data.api_key && data.api_key !== '••••••••••••••••') {
            data.api_key = encrypt(data.api_key);
        } else if (data.api_key === '••••••••••••••••') {
            delete data.api_key;
        }

        // Encrypt api_secret if provided and not masked
        if (data.api_secret && data.api_secret !== '••••••••••••••••') {
            data.api_secret = encrypt(data.api_secret);
        } else if (data.api_secret === '••••••••••••••••') {
            delete data.api_secret;
        }

        const updated = await prisma.sms_settings.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });

        // Return masked version
        return NextResponse.json({
            ...updated,
            api_key: '••••••••••••••••',
            api_secret: '••••••••••••••••'
        });
    } catch (error) {
        console.error('Error saving SMS settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
