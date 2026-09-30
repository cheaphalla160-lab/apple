import React from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  RotateCcw,
  BookOpen,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { GameMode, GameSpeed } from '../types';

interface TeacherToolbarProps {
  isBgmPlaying: boolean;
  isMuted: boolean;
  gameMode: GameMode;
  gameSpeed: GameSpeed;
  isFullscreen: boolean;
  onToggleBgm: () => void;
  onToggleMute: () => void;
  onChangeGameMode: (mode: GameMode) => void;
  onChangeSpeed: (speed: GameSpeed) => void;
  onResetGame: () => void;
  onOpenTeacherCard: () => void;
  onToggleFullscreen: () => void;
  onInstantSpeak: () => void;
}

export const TeacherToolbar: React.FC<TeacherToolbarProps> = ({
  isBgmPlaying,
  isMuted,
  gameMode,
  gameSpeed,
  isFullscreen,
  onToggleBgm,
  onToggleMute,
  onChangeGameMode,
  onChangeSpeed,
  onResetGame,
  onOpenTeacherCard,
  onToggleFullscreen,
  onInstantSpeak,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-200/80 shadow-xs px-3 md:px-6 py-2.5 flex items-center justify-between gap-2">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl md:text-2xl font-black tracking-tight text-rose-600 flex items-center gap-1.5 drop-shadow-xs">
          <span>🍎</span>
          <span>Apple Orchard</span>
        </span>
      </div>

      {/* Zone 2: Navigation & Mode Selectors (Functional segmented buttons) */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Game Mode Selector */}
        <div className="flex items-center bg-amber-50 p-1 rounded-xl border border-amber-200">
          <button
            onClick={() => onChangeGameMode('orchard')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              gameMode === 'orchard'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-amber-900 hover:text-rose-600'
            }`}
          >
            🍎 自由收获
          </button>
          <button
            onClick={() => onChangeGameMode('spelling')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              gameMode === 'spelling'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-amber-900 hover:text-rose-600'
            }`}
          >
            🔤 字母拼读 (A-P-P-L-E)
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onChangeSpeed('slow')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              gameSpeed === 'slow'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🐢 低段慢速
          </button>
          <button
            onClick={() => onChangeSpeed('medium')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              gameSpeed === 'medium'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏃 标准速度
          </button>
          <button
            onClick={() => onChangeSpeed('fast')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              gameSpeed === 'fast'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ 反应挑战
          </button>
        </div>
      </div>

      {/* Zone 3: Primary Actions & Audio Controls */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Instant Speak Button */}
        <button
          onClick={onInstantSpeak}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs md:text-sm transition-transform active:scale-95 whitespace-nowrap shadow-xs"
          title="朗读 Apple"
        >
          <Volume2 className="w-4 h-4 text-rose-600" />
          <span className="hidden sm:inline">听发音</span>
        </button>

        {/* Teacher Flashcard */}
        <button
          onClick={onOpenTeacherCard}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs md:text-sm shadow-xs transition-transform active:scale-95 whitespace-nowrap"
          title="打开教学备课卡片"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">备课卡</span>
        </button>

        {/* BGM Toggle */}
        <button
          onClick={onToggleBgm}
          className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center border transition-all ${
            isBgmPlaying
              ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
          }`}
          title={isBgmPlaying ? '暂停背景音乐' : '播放背景音乐'}
          aria-label="背景音乐"
        >
          <Music className={`w-4 h-4 ${isBgmPlaying ? 'animate-bounce' : ''}`} />
        </button>

        {/* SFX / Voice Mute Toggle */}
        <button
          onClick={onToggleMute}
          className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center border transition-all ${
            !isMuted
              ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              : 'bg-red-500 border-red-600 text-white shadow-xs'
          }`}
          title={isMuted ? '取消静音' : '静音'}
          aria-label="声音开关"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Reset Round */}
        <button
          onClick={onResetGame}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center transition-all active:scale-90"
          title="重新开始课堂游戏"
          aria-label="重置"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Fullscreen for classroom projector/whiteboard */}
        <button
          onClick={onToggleFullscreen}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-slate-800 hover:bg-slate-900 border border-slate-900 text-white flex items-center justify-center transition-all active:scale-90"
          title={isFullscreen ? '退出全屏' : '全屏投影互动'}
          aria-label="全屏"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
