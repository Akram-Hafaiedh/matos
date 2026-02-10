import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ Missing credentials');
                    return null;
                }

                console.log('🔍 Looking for user:', credentials.email);

                const user = await prisma.user.findFirst({
                    where: { email: credentials.email.toLowerCase().trim() }
                });

                console.log('👤 User found:', user ? 'Yes' : 'No');

                if (!user || !user.password) {
                    console.log('❌ User not found or no password');
                    return null;
                }

                console.log('🔐 Comparing password...');
                const isValidPassword = await compare(credentials.password, user.password);

                if (!isValidPassword) {
                    console.log('❌ Invalid password');
                    return null;
                }
                console.log('✅ Login successful for:', user.email);

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                    phone: user.phone,
                    selected_bg: user.selected_bg,
                    selected_frame: user.selected_frame,
                    loyalty_points: user.loyalty_points
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.email = user.email
                token.picture = user.image;
                token.role = (user as any).role;
                token.phone = (user as any).phone;
                token.selected_bg = (user as any).selected_bg;
                token.selected_frame = (user as any).selected_frame;
                token.loyalty_points = (user as any).loyalty_points;
            }
            // Logic to support session update
            if (trigger === "update" && session?.user) {
                token.name = session.user.name;
                token.picture = session.user.image;
                token.selected_bg = session.user.selected_bg;
                token.selected_frame = session.user.selected_frame;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string | null | undefined;
                session.user.email = token.email;
                session.user.image = token.picture as string | null | undefined;
                session.user.phone = token.phone as string | null | undefined;
                session.user.selected_bg = token.selected_bg as string | null | undefined;
                session.user.selected_frame = token.selected_frame as string | null | undefined;
                session.user.loyalty_points = token.loyalty_points as number | undefined;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
};
