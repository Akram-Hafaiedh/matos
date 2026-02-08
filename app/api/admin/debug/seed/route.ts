import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const hashedPassword = await bcrypt.hash('Matos2026!', 10);

        const names = [
            "Sami Ben Ali", "Mariem Mansouri", "Yassine Trabelsi",
            "Lina Ghorbel", "Ahmed Mejri", "Amira Bouazizi",
            "Omar Ayari", "Ines Kallel", "Mehdi Rekik", "Salma Dridi"
        ];

        const users = [];

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const email = `${name.toLowerCase().replace(/ /g, '.')}@example.com`;

            // Random points between 50 and 2500
            const loyalty_points = Math.floor(Math.random() * 2450) + 50;

            const user = await prisma.user.upsert({
                where: { email },
                update: { loyalty_points },
                create: {
                    id: `user_${Math.random().toString(36).slice(2, 11)}`,
                    name,
                    email,
                    password: hashedPassword,
                    loyalty_points,
                    role: 'customer',
                    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                }
            });
            users.push(user);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${users.length} users.`,
            users: users.map(u => ({ id: u.id, name: u.name, points: u.loyalty_points }))
        });

    } catch (error) {
        console.error('Error seeding users:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
