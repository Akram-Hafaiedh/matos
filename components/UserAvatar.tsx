'use client';

import Image from 'next/image';

interface UserAvatarProps {
    image?: string | null;
    name?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    textClassName?: string;
    backgroundColor?: string;
    rank?: number;
}

export default function UserAvatar({ image, name, size = 'md', className = '', textClassName = '', backgroundColor, rank }: UserAvatarProps) {
    const isImageAvatar = (url?: string | null) => url && (url.startsWith('/') || url.startsWith('http'));

    const sizeClasses = {
        sm: 'w-8 h-8 rounded-xl text-xl',
        md: 'w-10 h-10 rounded-xl text-3xl',
        lg: 'w-12 h-12 rounded-2xl text-4xl',
        xl: 'w-24 h-24 rounded-[2rem] text-6xl'
    };

    // Determine background color: prop > default (yellow-400)
    // Avoid double background classes if backgroundColor is provided
    const bgClass = (backgroundColor && backgroundColor.trim() !== "") ? backgroundColor : 'bg-yellow-400 text-gray-900';

    const initial = name?.[0]?.toUpperCase() || 'U';

    return (
        <div className="relative flex-shrink-0 group/avatar-global">
            {/* Rank Flairs (Only for Top 2) */}
            {rank === 1 && (
                <div className="absolute inset-[-4px] rounded-[inherit] bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 blur-[6px] opacity-70 animate-pulse z-0"></div>
            )}
            {rank === 2 && (
                <div className="absolute inset-[-4px] rounded-[inherit] bg-gradient-to-br from-gray-300 via-slate-400 to-gray-500 blur-[6px] opacity-60 z-0"></div>
            )}

            <div className={`${bgClass} flex items-center justify-center font-black flex-shrink-0 overflow-hidden relative z-10 ${sizeClasses[size] || sizeClasses.md} ${className}`}>
                {image ? (
                    isImageAvatar(image) ? (
                        <Image
                            src={image}
                            alt={name || 'User'}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className={`leading-none ${textClassName}`}>{image}</span>
                    )
                ) : (
                    <span className={`leading-none ${textClassName}`}>{initial}</span>
                )}
            </div>

            {/* Global Rank Badge for Rank 1 */}
            {rank === 1 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border border-black z-20">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-black fill-current">
                        <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                    </svg>
                </div>
            )}
        </div>
    );
}
