import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PolicyContent from './PolicyContent';

export const revalidate = 60; // ISR revalidation 

export default async function PolicyPage() {
    const page = await prisma.content_pages.findUnique({
        where: { slug: 'policy' }
    });

    if (!page) {
        notFound();
    }

    const sections = page.content as any[];

    return <PolicyContent page={page} sections={sections} />;
}
