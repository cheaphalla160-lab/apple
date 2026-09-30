import React from 'react';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AppleWordPopupProps {
  visible: boolean;
  scoreGained: number;
  combo: number;
  praise: string;
  appleType: string;
  onReplayAudio: () => void;
  onLetterClick: (letter: string) => void;
}

export const AppleWordPopup: React.FC<AppleWordPopupProps> = ({
  visible,
  scoreGained,
  combo,
  praise,
  appleType,
  onReplayAudio,
  onLetterClick,
}) => {
  if (!visible) return null;

  const letters = ['A', 'P', 'P', 'L', 'E'];

  return (
    <div className="pointer-events-auto fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 transform animate-bounce-slow">
      <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-3xl shadow-2xl border-4 border-rose-300 flex flex-col items-center gap-2 max-w-sm sm:max-w-md text-center">
        {/* Top Praise & Points pill */}
        <div className="flex items-center gap-2">
          <span className="bg-rose-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            {praise}
          </span>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs md:text-sm font-extrabold px-3 py-1 rounded-full">
            +{scoreGained} 分
          </span>
          {combo > 1 && (
            <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full animate-pulse">
              🔥 {combo} 连击!
            </span>
          )}
        </div>

        {/* Word Display with giant friendly font */}
        <div className="flex items-center justify-center gap-1.5 my-1">
          {letters.map((char, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.speak(char, { pitch: 1.25 });
                onLetterClick(char);
              }}
              title={`点击听字母 ${char}`}
              className="w-10 h-12 md:w-13 md:h-16 rounded-xl bg-gradient-to-b from-rose-500 to-red-600 text-white font-extrabold text-2xl md:text-3xl flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform border-b-4 border-red-800"
            >
              {char}
            </button>
          ))}
        </div>

        {/* Phonetic & Syllables & Chinese meaning */}
        <div className="flex items-center justify-center gap-3 text-sm md:text-base font-semibold text-slate-700">
          <span className="text-rose-600 font-mono tracking-wider font-bold">/ˈæp.l/</span>
          <span className="text-slate-400 font-normal">·</span>
          <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            Ap · ple
          </span>
          <span className="text-slate-400 font-normal">·</span>
          <span className="text-slate-800 font-bold">苹果</span>
        </div>

        {/* Listen Pronunciation Action Button */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReplayAudio();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs md:text-sm border border-rose-200 transition-colors shadow-xs active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>再听一次原声发音</span>
          </button>
        </div>

        {/* Phonics mnemonic hint */}
        <div className="text-[11px] md:text-xs text-slate-500 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>自然拼读：字母 A 发 /æ/，重读第一音节</span>
        </div>
      </div>
    </div>
  );
};
