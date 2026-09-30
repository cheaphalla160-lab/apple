import React from 'react';
import { Star, Award, Flame } from 'lucide-react';

interface HarvestBasketProps {
  collectedCount: number;
  score: number;
  combo: number;
  maxCombo: number;
  targetCount: number;
}

export const HarvestBasket: React.FC<HarvestBasketProps> = ({
  collectedCount,
  score,
  combo,
  maxCombo,
  targetCount,
}) => {
  // Star count calculation (1 star every 5 apples, max 5 stars)
  const stars = Math.min(5, Math.floor(collectedCount / 5));
  const progressPercent = Math.min(100, Math.round((collectedCount / targetCount) * 100));

  // Determine basket apple visual density (0 to 6 apples visible peeking over edge)
  const appleVisuals = Math.min(6, Math.floor(collectedCount / 2));

  return (
    <div className="fixed bottom-3 left-4 md:left-8 z-30 flex items-end gap-3 select-none pointer-events-none">
      {/* Basket Graphic & Apples Container */}
      <div className="relative pointer-events-auto group cursor-pointer transition-transform hover:scale-105 active:scale-95">
        {/* Apples inside basket */}
        <div className="absolute -top-5 inset-x-2 flex justify-center items-center gap-1 z-10">
          {[...Array(appleVisuals)].map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500 border border-red-700 shadow-sm animate-bounce"
              style={{
                animationDelay: `${i * 120}ms`,
                animationDuration: '1.8s',
                transform: `rotate(${(i - 2) * 12}deg)`,
              }}
            >
              <div className="w-1.5 h-1.5 bg-white/70 rounded-full ml-1 mt-0.5" />
            </div>
          ))}
        </div>

        {/* Woven Basket SVG */}
        <div className="w-24 h-20 md:w-28 md:h-24 relative filter drop-shadow-lg z-20">
          <svg viewBox="0 0 100 80" className="w-full h-full">
            <defs>
              <linearGradient id="basketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <pattern id="weave" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 0 5 L 10 5 M 5 0 L 5 10" stroke="#92400e" strokeWidth="1.5" />
              </pattern>
            </defs>

            {/* Basket Handle */}
            <path
              d="M 20 35 C 20 10, 80 10, 80 35"
              fill="none"
              stroke="#92400e"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 20 35 C 20 10, 80 10, 80 35"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Basket Body */}
            <path
              d="M 12 32 L 22 74 C 23 77, 26 78, 30 78 L 70 78 C 74 78, 77 77, 78 74 L 88 32 C 89 28, 86 26, 82 26 L 18 26 C 14 26, 11 28, 12 32 Z"
              fill="url(#basketGrad)"
              stroke="#451a03"
              strokeWidth="2.5"
            />
            {/* Woven texture overlay */}
            <path
              d="M 14 32 L 23 73 L 77 73 L 86 32 Z"
              fill="url(#weave)"
              opacity="0.45"
            />
            {/* Rim */}
            <ellipse cx="50" cy="28" rx="36" ry="6" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
          </svg>

          {/* Harvest Count Badge */}
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-sm md:text-base px-2.5 py-0.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
            <span>🍎</span>
            <span className="tabular-nums">{collectedCount}</span>
          </div>
        </div>
      </div>

      {/* Progress & Stars HUD Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 md:p-3 shadow-lg border border-amber-200 pointer-events-auto flex flex-col gap-1.5 min-w-[140px] md:min-w-[170px]">
        {/* Score & Combo */}
        <div className="flex items-center justify-between text-xs md:text-sm font-bold">
          <span className="text-amber-900">课堂得分:</span>
          <span className="text-rose-600 font-extrabold text-base md:text-lg tabular-nums">{score}</span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-0.5">
            <span>收获进度</span>
            <span className="tabular-nums">{collectedCount}/{targetCount}</span>
          </div>
          <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stars Earned */}
        <div className="flex items-center justify-between pt-1 border-t border-amber-100">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${
                  i < stars ? 'text-amber-400 fill-amber-400 drop-shadow-xs' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          {combo > 1 && (
            <span className="text-[11px] font-bold text-rose-600 flex items-center gap-0.5 animate-pulse">
              <Flame className="w-3 h-3 text-red-500 fill-red-500" />
              {combo} 连击
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
