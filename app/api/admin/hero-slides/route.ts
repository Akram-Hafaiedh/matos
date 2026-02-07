import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const slides = await prisma.hero_slides.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json({ success: true, slides });
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const slide = await prisma.hero_slides.create({
            data: {
                title: data.title,
                subtitle: data.subtitle,
                tagline: data.tagline,
                image_url: data.image_url,
                accent: data.accent || "from-yellow-400 to-orange-600",
                order: data.order || 0,
                is_active: data.is_active !== undefined ? data.is_active : true
            }
        });

        return NextResponse.json({ success: true, slide });
    } catch (error) {
        console.error('Error creating hero slide:', error);
        return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const slide = await prisma.hero_slides.update({
            where: { id: data.id },
            data: {
                title: data.title,
                subtitle: data.subtitle,
                tagline: data.tagline,
                image_url: data.image_url,
                accent: data.accent,
                order: data.order,
                is_active: data.is_active
            }
        });

        return NextResponse.json({ success: true, slide });
    } catch (error) {
        console.error('Error updating hero slide:', error);
        return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get('id') || '');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.hero_slides.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting hero slide:', error);
        return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
    }
}
