'use client';

import React from 'react';

interface SectionHeaderProps {
    badge: string;
    title: string | React.ReactNode;
    subtitle?: string;
    description?: string;
    align?: 'left' | 'center';
    sideDescription?: boolean;
    className?: string;
    showAccentLine?: boolean;
    noMargin?: boolean;
    rightContent?: React.ReactNode;
}

export default function SectionHeader({
    badge,
    title,
    subtitle,
    description,
    align = 'left',
    sideDescription = false,
    className = '',
    showAccentLine = true,
    noMargin = false,
    rightContent,
}: SectionHeaderProps) {
    const alignmentClasses = align === 'center' ? 'items-center text-center' : 'items-start text-left';
    const containerClasses = sideDescription || rightContent ? 'flex flex-col md:flex-row md:items-end justify-between gap-8 w-full' : `flex flex-col ${alignmentClasses} space-y-6`;

    return (
        <div className={`${noMargin ? '' : 'mb-16 md:mb-24'} ${className} w-full`}>
            <div className={containerClasses}>
                <div className={`space-y-6 ${align === 'center' ? 'flex flex-col items-center' : ''}`}>
                    {/* Badge & Accent Line */}
                    <div className="flex items-center gap-4">
                        {showAccentLine && align === 'left' && (
                            <div className="w-12 h-1 bg-gradient-to-r from-transparent to-yellow-400 rounded-full"></div>
                        )}
                        <span className="px-5 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] italic backdrop-blur-md">
                            {badge}
                        </span>
                        {showAccentLine && align === 'center' && (
                            <div className="w-12 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)]"></div>
                        )}
                    </div>

                    {/* Main Title Group */}
                    <div className={`space-y-2 ${align === 'center' ? 'flex flex-col items-center' : ''}`}>
                        {subtitle && (
                            <span className="text-yellow-400 font-black text-[9px] uppercase tracking-[0.4em] italic block">
                                {subtitle}
                            </span>
                        )}
                        <h2 className="text-5xl md:text-8xl font-[1000] text-white italic tracking-tighter uppercase leading-[0.85] overflow-visible">
                            <span className="inline-block pr-[0.4em] overflow-visible">
                                {title}
                            </span>
                        </h2>
                    </div>
                </div>

                {/* Description OR Right Content */}
                {rightContent ? (
                    <div className="flex-shrink-0">
                        {rightContent}
                    </div>
                ) : description && (
                    <p className={`text-gray-500 font-bold max-w-sm uppercase text-[10px] tracking-widest leading-relaxed ${sideDescription
                        ? 'md:text-right text-left'
                        : align === 'center' ? 'text-center' : 'text-left'
                        }`}>
                        {description}
                    </p>
                )}
            </div>

            {/* Optional Bottom Border for Side Content layout */}
            {(sideDescription || rightContent) && !noMargin && (
                <div className="w-full h-px bg-white/5 mt-12"></div>
            )}
        </div>
    );
}
