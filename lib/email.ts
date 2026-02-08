import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function getTransporter() {
    const config = await prisma.email_settings.findFirst({
        where: { id: 1 }
    });

    if (!config) {
        throw new Error('Email configuration not found');
    }

    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465, // true for 465, false for other ports
        auth: {
            user: config.user,
            pass: config.password,
        },
        tls: {
            rejectUnauthorized: false // Often needed for custom SMTP
        }
    });
}

export async function sendEmail({ to, subject, text, html }: { to: string, subject: string, text?: string, html?: string }) {
    const config = await prisma.email_settings.findFirst({
        where: { id: 1 }
    });

    if (!config) throw new Error('Email configuration not found');

    const transporter = await getTransporter();

    return transporter.sendMail({
        from: `"${config.from_name}" <${config.from_email}>`,
        to,
        subject,
        text,
        html,
    });
}
