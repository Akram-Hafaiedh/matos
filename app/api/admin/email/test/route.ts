import { sendEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
        }

        await sendEmail({
            to: email,
            subject: "Test de configuration Mato's",
            text: "Ceci est un email de test pour confirmer votre configuration SMTP.",
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h1 style="color: #fbbf24;">Mato's - Test SMTP</h1>
                    <p>Félicitations ! Votre configuration SMTP fonctionne correctement.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #666;">Ce message a été envoyé automatiquement depuis votre panneau d'administration.</p>
                </div>
            `
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error sending test email:', error);
        return NextResponse.json({ error: error.message || 'Failed to send test email' }, { status: 500 });
    }
}
