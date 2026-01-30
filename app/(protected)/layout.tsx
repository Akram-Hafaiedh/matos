'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Navigation from '../(public)/layout/Navigation';
import Footer from '../(public)/layout/Footer';
import GlobalCart from '../cart/GlobalCart';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navigation />
            <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 py-8">
                {children}
            </main>
            <GlobalCart />
            <Footer />
        </div>
    );
}
