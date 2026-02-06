import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { itemId } = await req.json();
        const shopItem = await prisma.shop_items.findUnique({
            where: { id: itemId }
        });

        if (!shopItem) {
            return NextResponse.json({ success: false, error: 'Item non trouvé' }, { status: 404 });
        }

        const userId = session.user.id;

        const result = await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: { tokens: true }
            });

            if (!user || user.tokens < shopItem.price) {
                throw new Error('Jetons insuffisants');
            }

            // Check if already owned
            const existing = await tx.user_inventory.findUnique({
                where: {
                    user_id_item_id: {
                        user_id: userId,
                        item_id: shopItem.id
                    }
                }
            });

            if (existing) {
                throw new Error('Item déjà possédé');
            }

            // Deduct tokens
            await tx.user.update({
                where: { id: userId },
                data: { tokens: { decrement: shopItem.price } }
            });

            // Add to inventory
            let expires_at: Date | null = null;
            if (shopItem.type === 'Boosters') {
                const durationMatch = shopItem.name.match(/\((\d+)h\)/i);
                if (durationMatch) {
                    const hours = parseInt(durationMatch[1]);
                    expires_at = new Date();
                    expires_at.setHours(expires_at.getHours() + hours);
                }
            }

            const newItem = await tx.user_inventory.create({
                data: {
                    id: `${userId}-${shopItem.id}-${Date.now()}`, // Added ID as it is required in schema
                    user_id: userId,
                    item_id: shopItem.id,
                    name: shopItem.name,
                    type: shopItem.type,
                    description: shopItem.description,
                    expires_at
                }
            });

            return newItem;
        });

        return NextResponse.json({ success: true, item: result });
    } catch (error: any) {
        console.error('Purchase error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Une erreur est survenue lors de l\'achat'
        }, { status: 400 });
    }
}
