import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (slug) {
            const page = await prisma.content_pages.findUnique({
                where: { slug }
            });
            return NextResponse.json({ success: true, page });
        }

        const pages = await prisma.content_pages.findMany();
        return NextResponse.json({ success: true, pages });
    } catch (error) {
        console.error('Error fetching content pages:', error);
        return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const page = await prisma.content_pages.update({
            where: { slug: data.slug },
            data: {
                title: data.title,
                subtitle: data.subtitle,
                content: data.content
            }
        });

        return NextResponse.json({ success: true, page });
    } catch (error) {
        console.error('Error updating content page:', error);
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
    }
}
