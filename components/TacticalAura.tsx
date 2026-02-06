'use client';

import { motion } from 'framer-motion';

interface TacticalAuraProps {
    color?: string;
    opacity?: number;
    size?: string;
    duration?: number;
    className?: string;
}

export default function TacticalAura({
    color = "rgba(250, 204, 21, 0.05)",
    opacity = 1,
    size = "600px",
    duration = 15,
    className = ""
}: TacticalAuraProps) {
    return (
        <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
            <motion.div
                animate={{
                    x: ['-10%', '10%', '-5%'],
                    y: ['-10%', '5%', '10%'],
                    scale: [1, 1.2, 0.9],
                    rotate: [0, 90, 180],
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[10%] left-[10%] rounded-full blur-[150px]"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    opacity: opacity,
                }}
            />
            <motion.div
                animate={{
                    x: ['10%', '-10%', '5%'],
                    y: ['10%', '-5%', '-10%'],
                    scale: [0.9, 1.1, 1],
                    rotate: [0, -90, -180],
                }}
                transition={{
                    duration: duration * 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[10%] right-[10%] rounded-full blur-[150px]"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    opacity: opacity * 0.7,
                }}
            />
        </div>
    );
}
