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

            // Start expiration check logic
            let expires_at: Date | null = null;
            if (shopItem.type === 'Boosters') {
                const durationMatch = shopItem.name.match(/\((\d+)h\)/i);
                if (durationMatch) {
                    const hours = parseInt(durationMatch[1]);
                    expires_at = new Date();
                    expires_at.setHours(expires_at.getHours() + hours);
                }
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
                // Check if expired using logic similar to client-side isItemExpired
                let isExpired = false;
                if (existing.expires_at) {
                    isExpired = new Date(existing.expires_at) < new Date();
                } else if (existing.type === 'Boosters' && existing.unlocked_at) {
                    // Fallback check
                    const match = existing.name.match(/\((\d+)h\)/i);
                    if (match) {
                        const hours = parseInt(match[1]);
                        const start = new Date(existing.unlocked_at);
                        const expiryDate = new Date(start.getTime() + hours * 60 * 60 * 1000);
                        isExpired = expiryDate < new Date();
                    }
                }

                if (!isExpired) {
                    throw new Error('Item déjà possédé');
                }

                // If expired, UPDATE the existing record instead of creating new
                const updatedItem = await tx.user_inventory.update({
                    where: {
                        user_id_item_id: {
                            user_id: userId,
                            item_id: shopItem.id
                        }
                    },
                    data: {
                        unlocked_at: new Date(),
                        expires_at: expires_at // Set new expiration
                    }
                });

                // Deduct tokens only after checks pass
                await tx.user.update({
                    where: { id: userId },
                    data: { tokens: { decrement: shopItem.price } }
                });

                return updatedItem;
            }

            // Deduct tokens (New Purchase)
            await tx.user.update({
                where: { id: userId },
                data: { tokens: { decrement: shopItem.price } }
            });

            // Create new inventory item
            const newItem = await tx.user_inventory.create({
                data: {
                    id: `${userId}-${shopItem.id}-${Date.now()}`,
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
