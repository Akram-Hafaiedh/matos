// app/api/user/profile/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            select: {
                id: true,
                name: true,
                email: true,
                loyaltyPoints: true,
                phone: true,
                address: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'Utilisateur non trouvé'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération du profil'
        }, { status: 500 });
    }
}
