import React from 'react';
import { X, Volume2, Sparkles, BookOpen, Music, Play, Lightbulb, Award } from 'lucide-react';
import mascotImg from '../assets/images/cute_apple_mascot_1790741579427.jpg';
import { soundEngine } from '../utils/audio';

interface TeacherFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherFlashcardModal: React.FC<TeacherFlashcardModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const playWord = () => {
    soundEngine.speak('Apple', { pitch: 1.15, rate: 0.9 });
  };

  const playPhonics = () => {
    soundEngine.speakPhonics();
  };

  const playSentence = (en: string) => {
    soundEngine.speak(en, { pitch: 1.1, rate: 0.88 });
  };

  const playChant = () => {
    soundEngine.speak(
      'Apple round, apple red. Apple juicy, apple sweet! Apple, apple, I love you. Apple is my favorite fruit!',
      { pitch: 1.18, rate: 0.82 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 px-6 py-4 flex items-center justify-between text-white rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-yellow-200" />
            <div>
              <h2 className="font-extrabold text-lg md:text-xl tracking-tight">
                《Apple》备课中心与课堂教案
              </h2>
              <p className="text-xs text-rose-100 font-medium">小学低段英语 · 核心词汇精讲与自然拼读</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors active:scale-90"
            aria-label="关闭备课卡"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 space-y-6">
          {/* Main Visual & Pronunciation Hero */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            {/* Mascot Image with fallback */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md bg-white border-2 border-rose-200 shrink-0">
              <img
                src={mascotImg}
                alt="Cute Apple Mascot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Word Core Details */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-3">
                <span className="text-4xl md:text-5xl font-black text-rose-600 tracking-wide">
                  Apple
                </span>
                <span className="text-lg md:text-xl font-mono font-bold text-slate-600">
                  /ˈæp.l/
                </span>
                <span className="text-base font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  名词 · 苹果
                </span>
              </div>

              {/* Syllable Breakdown */}
              <p className="text-xs md:text-sm text-slate-600">
                双音节词：<strong className="text-rose-600">Ap</strong> (重读) +{' '}
                <strong className="text-amber-700">ple</strong> (轻读)
              </p>

              {/* Action Pronounce Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  onClick={playWord}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs md:text-sm shadow-sm transition-transform active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>朗读单词</span>
                </button>
                <button
                  onClick={playPhonics}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs md:text-sm shadow-sm transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                  <span>自然拼读节奏</span>
                </button>
              </div>
            </div>
          </div>

          {/* Phonics Ladder Section */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
              <span className="w-2 h-5 bg-rose-500 rounded-full" />
              <span>自然拼读分解 (Phonics Breakdown)</span>
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { letter: 'A', sound: '/æ/', tip: '梅花音 (短元音)' },
                { letter: 'P', sound: '/p/', tip: '爆破音 (清辅音)' },
                { letter: 'P', sound: '—', tip: '双写同音发一次' },
                { letter: 'L', sound: '/l/', tip: '成节音' },
                { letter: 'E', sound: 'silent', tip: '词尾不发音' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => soundEngine.speak(item.letter, { pitch: 1.25 })}
                  className="p-2 md:p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 transition-all flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-xl md:text-2xl font-black text-rose-600 group-hover:scale-110 transition-transform">
                    {item.letter}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-700 mt-0.5">
                    {item.sound}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">{item.tip}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Classroom High-Frequency Sentences */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
              <span className="w-2 h-5 bg-amber-500 rounded-full" />
              <span>课堂实用情境句型 (Sentences)</span>
            </h3>
            <div className="space-y-2">
              {[
                {
                  en: 'I like sweet apples.',
                  zh: '我喜欢吃甜甜的苹果。',
                  icon: '🍎',
                },
                {
                  en: 'An apple a day keeps the doctor away.',
                  zh: '一天一苹果，医生远离我。(著名健康谚语)',
                  icon: '🌟',
                },
                {
                  en: 'Look, the red apple is on the tree.',
                  zh: '看，红红的苹果挂在树上。',
                  icon: '🌳',
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => playSentence(s.en)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                        {s.en}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.zh}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white group-hover:bg-rose-500 text-slate-600 group-hover:text-white flex items-center justify-center shadow-xs transition-colors shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Rhythmic Nursery Chant */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-rose-500" />
                <h4 className="font-extrabold text-sm md:text-base text-rose-800">
                  课堂互动童谣 (Apple Chant)
                </h4>
              </div>
              <button
                onClick={playChant}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>跟读童谣</span>
              </button>
            </div>
            <div className="text-center font-medium text-slate-700 text-sm leading-relaxed py-2 bg-white/70 rounded-xl border border-rose-100">
              <p>🍎 Apple round, apple red,</p>
              <p>🍏 Apple juicy, apple sweet!</p>
              <p>❤️ Apple, apple, I love you,</p>
              <p>🌟 Apple is my favorite fruit!</p>
            </div>
          </div>

          {/* Teacher Classroom Activity Tips */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              <span>教师课堂互动小建议 (Classroom Activities)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
              <li>
                <strong>抢答跟读模式：</strong>请全班或分组比赛，每次屏幕消除苹果并读出"Apple"后，孩子们大声跟读3遍！
              </li>
              <li>
                <strong>拼读接龙游戏：</strong>点击"自然拼读"按钮，让5位同学依次拼出 A-P-P-L-E。
              </li>
              <li>
                <strong>积分收获奖励：</strong>每收集10个苹果达成一颗星星，完成20个苹果全班一起唱童谣！
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Close */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-sm transition-transform active:scale-95"
          >
            开始课堂游戏
          </button>
        </div>
      </div>
    </div>
  );
};
