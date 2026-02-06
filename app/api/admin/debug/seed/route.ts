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
            const loyaltyPoints = Math.floor(Math.random() * 2450) + 50;

            const user = await prisma.user.upsert({
                where: { email },
                update: { loyaltyPoints },
                create: {
                    name,
                    email,
                    password: hashedPassword,
                    loyaltyPoints,
                    role: 'customer',
                    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                }
            });
            users.push(user);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${users.length} users.`,
            users: users.map(u => ({ id: u.id, name: u.name, points: u.loyaltyPoints }))
        });

    } catch (error) {
        console.error('Error seeding users:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
