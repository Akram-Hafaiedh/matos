// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, phone, address, role = 'customer' } = body;

        // Validate required fields
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Create user in database
        const user = await prisma.user.create({
            data: {
                id: `user_${Math.random().toString(36).slice(2, 11)}`,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                name,
                phone,
                address,
                role,
                loyaltyPoints: 10,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
        return NextResponse.json(
            { user, message: 'User created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}