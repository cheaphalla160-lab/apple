import React from 'react';
import { Trophy, Star, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import mascotImg from '../assets/images/cute_apple_mascot_1790741579427.jpg';

interface CelebrationModalProps {
  isOpen: boolean;
  score: number;
  collectedCount: number;
  maxCombo: number;
  onContinue: () => void;
  onRestart: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  score,
  collectedCount,
  maxCombo,
  onContinue,
  onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-yellow-300 text-center flex flex-col items-center">
        {/* Mascot & Crown */}
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-300 shadow-lg mx-auto bg-amber-50">
            <img
              src={mascotImg}
              alt="Happy Apple Mascot"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -top-3 -right-2 text-3xl animate-bounce">
            👑
          </div>
        </div>

        <h3 className="text-2xl font-black text-rose-600 mb-1">
          太棒啦！苹果大丰收！
        </h3>
        <p className="text-sm text-slate-600 font-semibold mb-4">
          你成功掌握了单词 <span className="text-rose-600 font-extrabold text-base">Apple</span> 的发音与拼写！
        </p>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-2 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 mb-5">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold">收集苹果</span>
            <span className="text-xl font-black text-rose-600 tabular-nums">🍎 {collectedCount}</span>
          </div>
          <div className="flex flex-col items-center border-x border-amber-200">
            <span className="text-xs text-slate-500 font-bold">总得分</span>
            <span className="text-xl font-black text-amber-600 tabular-nums">⭐ {score}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold">最高连击</span>
            <span className="text-xl font-black text-red-500 tabular-nums">🔥 {maxCombo}x</span>
          </div>
        </div>

        {/* Motivational Rating */}
        <div className="flex justify-center gap-1.5 mb-5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-7 h-7 text-amber-400 fill-amber-400 drop-shadow-md animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新开始</span>
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <span>继续采摘</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
