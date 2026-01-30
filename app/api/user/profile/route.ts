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
                image: true,
                selectedFrame: true,
                selectedBg: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'Utilisateur non trouvé'
            }, { status: 404 });
        }

        const rank = await prisma.user.count({
            where: {
                loyaltyPoints: {
                    gt: user.loyaltyPoints || 0
                }
            }
        }) + 1;

        return NextResponse.json({
            success: true,
            user: { ...user, rank }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération du profil'
        }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    return PATCH(request);
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const body = await request.json();
        const { name, phone, address, image, selectedFrame, selectedBg } = body;

        const updatedUser = await prisma.user.update({
            where: { id: (session.user as any).id },
            data: {
                name,
                phone,
                address,
                image,
                selectedFrame,
                selectedBg
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                image: true,
                selectedFrame: true,
                selectedBg: true
            }
        });

        return NextResponse.json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la mise à jour du profil'
        }, { status: 500 });
    }
}
