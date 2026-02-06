'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';

export default function UserProfileHeader({ session }: { session: any }) {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);

    // Fetch latest profile data (frame, bg, custom icon)
    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            if (data.success) {
                setUserProfile(data.user);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchProfile();
        // Listener for profile updates (optional, for now we rely on mount/nav)
        window.addEventListener('profile-updated', fetchProfile);
        return () => window.removeEventListener('profile-updated', fetchProfile);
    }, [session]); // Re-fetch if session changes

    const displayName = userProfile?.name || session?.user?.name;
    const displayImage = userProfile?.image || session?.user?.image;
    const selectedTitle = userProfile?.selectedTitle || 'Membre Elite';
    const selectedFrame = userProfile?.selectedFrame || 'border-white/10';

    return (
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-white uppercase tracking-wider">{displayName}</p>
                <p className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest italic">{selectedTitle}</p>
            </div>
            <div className="relative group/user">
                <button className={`w-12 h-12 bg-black border-2 ${selectedFrame} rounded-xl flex items-center justify-center overflow-hidden transition-all shadow-lg`}>
                    {/* If image is a URL (http/https), use UserAvatar/Image. If it's an emoji/unicode, render text. */}
                    {displayImage && displayImage.startsWith('http') ? (
                        <img src={displayImage} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-2xl">{displayImage || '👤'}</span>
                    )}
                </button>

                {/* Mini Dropdown */}
                <div className="absolute right-0 mt-3 w-56 bg-black border border-white/5 rounded-2xl shadow-2xl opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 transform origin-top-right overflow-hidden p-2 z-50">
                    <Link href="/account/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition uppercase tracking-widest italic">
                        <User size={14} className="text-yellow-400" />
                        Mon Profil
                    </Link>
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition uppercase tracking-widest italic" onClick={() => router.push('/')}>
                        <Home size={14} className="text-yellow-400" />
                        Site Public
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded-xl transition uppercase tracking-widest flex items-center gap-3 border-t border-white/5 mt-2 italic"
                    >
                        <LogOut size={14} />
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    );
}
