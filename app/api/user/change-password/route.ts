import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ success: false, error: 'Données manquantes' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || !user.password) {
            return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ success: false, error: 'Mot de passe actuel incorrect' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword }
        });

        return NextResponse.json({
            success: true,
            message: 'Mot de passe mis à jour'
        });

    } catch (error) {
        console.error('Password Change Error:', error);
        return NextResponse.json({ success: false, error: 'Erreur interne' }, { status: 500 });
    }
}
