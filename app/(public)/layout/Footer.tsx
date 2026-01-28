import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black py-8 px-4 border-t-4 border-yellow-400">
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-20 h-20 bg-white/5 rounded-full border-4 border-yellow-400 p-2 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(250,204,21,0.2)] mb-4">
                        <Image
                            src="/logo.svg"
                            alt="Mato's Logo"
                            width={64}
                            height={64}
                            className="object-contain"
                        />
                    </div>
                    <span className="text-4xl font-black text-white tracking-widest">MATO'S</span>
                    <p className="text-yellow-400 mt-2 text-xl font-bold">Pizza • Burgers • Tacos</p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-8 mb-6">
                    <a href="#" className="text-gray-400 hover:text-yellow-400 text-3xl transition hover:animate-float">📱</a>
                    <a href="#" className="text-gray-400 hover:text-yellow-400 text-3xl transition hover:animate-float">📧</a>
                    <a href="#" className="text-gray-400 hover:text-yellow-400 text-3xl transition hover:animate-float">📍</a>
                </div>

                {/* Bottom Section with Links and Credits */}
                <div className="border-t border-gray-800 pt-6">
                    <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-4 text-sm">
                        {/* Copyright */}
                        <div className="text-gray-500 order-3 lg:order-1">
                            © {currentYear} Mato's Restaurant. Tous droits réservés.
                        </div>

                        {/* Terms and Privacy Links */}
                        <div className="flex items-center gap-4 text-gray-400 order-2 lg:order-2">
                            <a
                                href="/terms"
                                className="hover:text-yellow-400 transition-colors"
                            >
                                Conditions
                            </a>
                            <span>•</span>
                            <a
                                href="/policy"
                                className="hover:text-yellow-400 transition-colors"
                            >
                                Politique
                            </a>
                        </div>

                        {/* Developer Credit */}
                        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-gray-400 order-1 lg:order-3">
                            <span>Développé avec</span>
                            <div className="flex items-center gap-1 text-yellow-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>par</span>
                            </div>
                            <a
                                href="https://portfolio-six-mu-c3zpt9l3gd.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-yellow-400 hover:text-yellow-300 transition-colors font-bold bg-yellow-400/10 px-3 py-1 rounded-full hover:bg-yellow-400/20"
                            >
                                Akram Hafaiedh
                            </a>
                            <span className="hidden lg:inline">•</span>
                            <a
                                href="https://github.com/Akram-Hafaiedh/e-commerce"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.337-3.369-1.337-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.58 9.58 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.291 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                                    />
                                </svg>
                                Code Source
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}