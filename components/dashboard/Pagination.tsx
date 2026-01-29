import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const delta = 1;
    const range: number[] = [];
    const left = currentPage - delta;
    const right = currentPage + delta + 1;
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i < right)) {
            range.push(i);
        }
    }

    for (const i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-white disabled:opacity-20 disabled:cursor-not-allowed hover:border-yellow-400/50 transition duration-500 active:scale-95 group"
                title="Précédent"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-2 bg-gray-950 p-2 rounded-[2rem] border border-gray-800">
                {rangeWithDots.map((page, idx) => (
                    page === '...' ? (
                        <span key={`dots-${idx}`} className="px-3 text-gray-700 font-black">•••</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`w-12 h-12 rounded-2xl font-black text-sm transition duration-500 ${currentPage === page
                                ? 'bg-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/20'
                                : 'bg-gray-900 text-gray-500 hover:text-white border border-gray-800'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-400/50 disabled:opacity-30 disabled:cursor-not-allowed transition duration-500 active:scale-95 group"
                title="Suivant"
            >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
