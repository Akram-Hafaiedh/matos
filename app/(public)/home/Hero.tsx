import { ChevronRight, Gift } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
    slides: any[];
    currentSlide: number;
    setCurrentSlide: (index: number) => void;
}

export default function Hero({ slides, currentSlide, setCurrentSlide }: HeroProps) {
    return (
        <section className="relative h-screen min-h-[700px] overflow-hidden bg-black flex items-center justify-center">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
                        }`}
                >
                    {/* Cinematic Background */}
                    <div className="absolute inset-0">
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover brightness-[0.4] contrast-[1.2] scale-105 group-hover:scale-110 transition-transform duration-[10000ms]"
                            priority={index === 0}
                            sizes="100vw"
                        />
                        {/* Dynamic Overlay Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>

                        {/* Technical Aesthetic Overlays with Enhanced Yellow Sweep */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                            <div className="absolute right-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center z-20">
                        <div className="space-y-12 text-center max-w-6xl">
                            {/* Floating Tag */}
                            <div className={`transition-all duration-1000 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                                <div className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                                    <span className="text-yellow-400 font-black text-xs uppercase tracking-[0.4em]">{slide.price}</span>
                                </div>
                            </div>

                            {/* Hero Title */}
                            <div className={`space-y-4 transition-all duration-1000 delay-500 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                <h1 className="text-7xl md:text-[12rem] font-[1000] text-white leading-[0.85] tracking-[-0.05em] uppercase italic group">
                                    <span className="block">{slide.title.split(' ')[0]}</span>
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-600 drop-shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                                        {slide.title.split(' ').slice(1).join(' ')}
                                    </span>
                                </h1>
                            </div>

                            {/* Subtitle with High-End Layout */}
                            <div className={`flex flex-col md:flex-row items-center justify-center gap-8 transition-all duration-1000 delay-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="hidden md:block w-24 h-px bg-yellow-400/20"></div>
                                <p className="text-xl md:text-2xl text-gray-400 font-bold max-w-2xl uppercase tracking-widest leading-relaxed italic">
                                    {slide.subtitle}
                                </p>
                                <div className="hidden md:block w-24 h-px bg-yellow-400/20"></div>
                            </div>

                            {/* Glassmorphism Actions */}
                            <div className={`flex flex-col sm:flex-row gap-6 justify-center pt-12 transition-all duration-1000 delay-1000 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <Link
                                    href="/menu"
                                    className="relative group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-16 py-8 rounded-[2rem] font-black text-xl transition-all shadow-[0_20px_40px_-15px_rgba(250,204,21,0.4)] active:scale-95 flex items-center justify-center gap-4 overflow-hidden"
                                >
                                    <span className="relative z-10 uppercase tracking-tighter">Signature Menu</span>
                                    <ChevronRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </Link>

                                <Link
                                    href="/promos"
                                    className="group bg-white/5 backdrop-blur-3xl border-2 border-white/10 hover:border-yellow-400/50 text-white px-16 py-8 rounded-[2rem] font-black text-xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4"
                                >
                                    <span className="uppercase tracking-tighter group-hover:text-yellow-400 transition-colors">Offres Limitées</span>
                                    <Gift className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-all group-hover:scale-110" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Ambient Page Glows */}
            <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>

            {/* Cinematic Indicators */}
            <div className="absolute bottom-20 left-12 flex flex-col gap-6 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="group relative flex items-center gap-4"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <div className={`h-1.5 transition-all duration-700 rounded-full ${index === currentSlide ? 'bg-yellow-400 w-12 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-white/20 w-4 group-hover:bg-white/40'}`} />
                        <span className={`text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-500 ${index === currentSlide ? 'text-yellow-400 translate-x-0 opacity-100' : 'text-white/0 -translate-x-4 opacity-0 pointer-events-none'}`}>
                            0{index + 1}
                        </span>
                    </button>
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 right-12 z-30 hidden lg:flex flex-col items-center gap-6 group">
                <div className="[writing-mode:vertical-lr] text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] group-hover:text-yellow-400 transition-colors cursor-default">
                    Explore Mato's Spirit
                </div>
                <div className="w-px h-24 bg-gradient-to-b from-yellow-400 via-yellow-400/20 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scroll-indicator"></div>
                </div>
            </div>
        </section>
    );
}
