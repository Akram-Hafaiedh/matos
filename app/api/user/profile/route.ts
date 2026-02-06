// app/api/user/profile/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any).id) {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                loyaltyPoints: true,
                tokens: true,
                phone: true,
                address: true,
                role: true,
                image: true,
                selectedFrame: true,
                selectedBg: true,
                selectedTitle: true,
                createdAt: true,
                inventory: true,
                _count: {
                    select: { orders: true }
                }
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
    } catch (error: any) {
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
        const { name, phone, address, image, selectedFrame, selectedBg, selectedTitle } = body;

        const updatedUser = await prisma.user.update({
            where: { id: (session.user as any).id },
            data: {
                name,
                phone,
                address,
                image,
                selectedFrame,
                selectedBg,
                selectedTitle
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                image: true,
                selectedFrame: true,
                selectedBg: true,
                selectedTitle: true
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
