import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { menuItemId } = await req.json();
        if (!menuItemId) {
            return NextResponse.json({ error: 'ID du produit manquant' }, { status: 400 });
        }

        const itemId = parseInt(menuItemId);
        if (isNaN(itemId)) {
            return NextResponse.json({ error: 'ID du produit invalide' }, { status: 400 });
        }

        // Toggle Like
        const existingLike = await prisma.menu_likes.findUnique({
            where: {
                user_id_menu_item_id: {
                    user_id: session.user.id,
                    menu_item_id: itemId
                }
            }
        });

        if (existingLike) {
            await prisma.menu_likes.delete({
                where: { id: existingLike.id }
            });
            return NextResponse.json({ success: true, liked: false });
        } else {
            await prisma.menu_likes.create({
                data: {
                    user_id: session.user.id,
                    menu_item_id: itemId
                }
            });
            return NextResponse.json({ success: true, liked: true });
        }
    } catch (error) {
        console.error('Like toggle error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
