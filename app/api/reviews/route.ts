import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const homeOnly = searchParams.get('home') === 'true';

        const reviews = await prisma.review.findMany({
            where: homeOnly ? { showOnHome: true } : {},
            include: {
                user: {
                    select: {
                        name: true,
                        role: true,
                        image: true,
                    }
                },
                menuItem: {
                    select: {
                        name: true,
                    }
                }
            },
            take: homeOnly ? 12 : 50,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
