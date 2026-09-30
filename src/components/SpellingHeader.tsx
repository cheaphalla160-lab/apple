import React from 'react';
import { Sparkles, Trophy } from 'lucide-react';

interface SpellingHeaderProps {
  currentLetterIndex: number;
  wordCompletedCount: number;
}

export const SpellingHeader: React.FC<SpellingHeaderProps> = ({
  currentLetterIndex,
  wordCompletedCount,
}) => {
  const letters = ['A', 'P', 'P', 'L', 'E'];

  return (
    <div className="fixed top-14 md:top-16 left-1/2 -translate-x-1/2 z-25 pointer-events-none select-none">
      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border-2 border-amber-300 flex items-center gap-3">
        <div className="text-xs font-bold text-amber-900 hidden sm:block">
          目标拼读:
        </div>

        <div className="flex items-center gap-1.5">
          {letters.map((char, idx) => {
            const isCollected = idx < currentLetterIndex;
            const isTarget = idx === currentLetterIndex;

            return (
              <div
                key={idx}
                className={`w-8 h-9 md:w-9 md:h-10 rounded-xl font-black text-lg md:text-xl flex items-center justify-center transition-all ${
                  isCollected
                    ? 'bg-emerald-500 text-white shadow-xs scale-100'
                    : isTarget
                    ? 'bg-rose-500 text-white ring-4 ring-rose-200 animate-pulse scale-110'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {char}
              </div>
            );
          })}
        </div>

        {wordCompletedCount > 0 && (
          <div className="flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-xl text-amber-900 font-extrabold text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>完成 {wordCompletedCount} 次</span>
          </div>
        )}
      </div>
    </div>
  );
};
