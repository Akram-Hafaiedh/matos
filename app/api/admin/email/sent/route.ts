import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sent = await prisma.sent_emails.findMany({
            orderBy: { created_at: 'desc' }
        });
        return NextResponse.json(sent);
    } catch (error) {
        console.error('Error fetching sent emails:', error);
        return NextResponse.json({ error: 'Failed to fetch sent emails' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { to, subject, content } = await req.json();

        if (!to || !subject || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Send the email
        await sendEmail({
            to,
            subject,
            text: content,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                    ${content.replace(/\n/g, '<br />')}
                </div>
            `
        });

        // 2. Log it in the database
        const logged = await prisma.sent_emails.create({
            data: {
                to,
                subject,
                content,
                status: 'sent'
            }
        });

        return NextResponse.json(logged);
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
    }
}
