'use client';

import Image from 'next/image';

interface UserAvatarProps {
    image?: string | null;
    name?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    textClassName?: string;
}

export default function UserAvatar({ image, name, size = 'md', className = '', textClassName = '' }: UserAvatarProps) {
    const isImageAvatar = (url?: string | null) => url && (url.startsWith('/') || url.startsWith('http'));

    const sizeClasses = {
        sm: 'w-8 h-8 rounded-xl text-lg',
        md: 'w-10 h-10 rounded-xl text-2xl',
        lg: 'w-12 h-12 rounded-2xl text-3xl',
        xl: 'w-24 h-24 rounded-[2rem] text-6xl'
    };

    const initial = name?.[0]?.toUpperCase() || 'U';

    return (
        <div className={`bg-yellow-400 flex items-center justify-center text-gray-900 font-black flex-shrink-0 overflow-hidden relative ${sizeClasses[size]} ${className}`}>
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
    );
}
