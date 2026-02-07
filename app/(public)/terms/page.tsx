import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TermsContent from './TermsContent';

export const revalidate = 60; // ISR revalidation 

export default async function TermsPage() {
    const page = await prisma.content_pages.findUnique({
        where: { slug: 'terms' }
    });

    if (!page) {
        notFound();
    }

    const sections = page.content as any[];

    return <TermsContent page={page} sections={sections} />;
}
