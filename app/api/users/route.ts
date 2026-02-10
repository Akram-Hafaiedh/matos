// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt, { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// GET - List all users (admin only). Can filter by role.
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
        }

        // 2. Get query parameters for filtering (e.g., ?role=customer)
        const { searchParams } = new URL(request.url);
        const roleFilter = searchParams.get('role');

        const users = await prisma.user.findMany({
            where: roleFilter ? { role: roleFilter } : {},
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                created_at: true,
                // Explicitly OMIT password_hash
            },
            orderBy: { created_at: 'desc' },
        });

        return NextResponse.json({
            success: true,
            users,
        });


    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur serveur'
        }, { status: 500 });
    }
}

// POST - Create a new user (admin only - e.g., to add another staff member)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { email, password, name, phone, role = 'customer' } = body;


        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, error: 'Email, mot de passe et nom requis' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'Cet email est déjà utilisé' },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                id: `user_${Math.random().toString(36).slice(2, 11)}`,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                name,
                phone,
                role, // Can be 'customer', 'staff', 'admin', etc.
            },
            select: {
                // Return all fields EXCEPT the password
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                created_at: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                user: newUser,
                message: 'Utilisateur créé avec succès',
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}