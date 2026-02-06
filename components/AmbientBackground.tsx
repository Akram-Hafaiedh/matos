'use client';

export default function AmbientBackground() {
    return (
        <div className="fixed inset-0 w-full h-full bg-black -z-50 pointer-events-none overflow-hidden">
            {/* Ultra-Large Ambient Glows */}
            <div className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] bg-yellow-400/[0.03] blur-[150px] rounded-full animate-pulse-slow"></div>
            <div className="absolute top-[20%] -right-[20%] w-[70vw] h-[70vw] bg-orange-600/[0.02] blur-[180px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-purple-600/[0.02] blur-[200px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

            {/* Subtle Texture/Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* Global Gradient Fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"></div>
        </div>
    );
}
