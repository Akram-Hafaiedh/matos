// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
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
                    selectedBg: user.selectedBg,
                    selectedFrame: user.selectedFrame,
                    loyaltyPoints: user.loyaltyPoints
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
                token.selectedBg = (user as any).selectedBg;
                token.selectedFrame = (user as any).selectedFrame;
                token.loyaltyPoints = (user as any).loyaltyPoints;
            }
            // Logic to support session update
            if (trigger === "update" && session?.user) {
                token.name = session.user.name;
                token.picture = session.user.image;
                token.selectedBg = session.user.selectedBg;
                token.selectedFrame = session.user.selectedFrame;
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
                session.user.selectedBg = token.selectedBg as string | null | undefined;
                session.user.selectedFrame = token.selectedFrame as string | null | undefined;
                session.user.loyaltyPoints = token.loyaltyPoints as number | undefined;
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };