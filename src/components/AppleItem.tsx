import React from 'react';
import { FallingApple } from '../types';

interface AppleItemProps {
  apple: FallingApple;
  onCatch: (apple: FallingApple, event: React.MouseEvent | React.TouchEvent) => void;
}

export const AppleItem: React.FC<AppleItemProps> = ({ apple, onCatch }) => {
  // Sway calculation using sine wave
  const swayOffset = Math.sin(apple.swayPhase) * 14;

  // Visual schemes based on apple type
  const colorMap = {
    red: {
      gradientStart: '#ff4d4d',
      gradientEnd: '#c8102e',
      highlight: '#ff9999',
      borderColor: '#9e0c20',
      labelColor: '#ffffff',
    },
    golden: {
      gradientStart: '#fbbf24',
      gradientEnd: '#d97706',
      highlight: '#fef08a',
      borderColor: '#b45309',
      labelColor: '#78350f',
    },
    green: {
      gradientStart: '#84cc16',
      gradientEnd: '#4d7c0f',
      highlight: '#bef264',
      borderColor: '#365314',
      labelColor: '#ffffff',
    },
    rainbow: {
      gradientStart: '#f43f5e',
      gradientEnd: '#8b5cf6',
      highlight: '#fbcfe8',
      borderColor: '#6b21a8',
      labelColor: '#ffffff',
    },
  }[apple.type];

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onCatch(apple, e);
  };

  return (
    <div
      style={{
        left: `calc(${apple.x}% + ${swayOffset}px)`,
        top: `${apple.y}%`,
        transform: `translate(-50%, -50%) scale(${apple.size})`,
        touchAction: 'none',
      }}
      className="absolute cursor-pointer transition-transform duration-75 active:scale-90 hover:scale-110 group select-none z-20"
      onPointerDown={handleInteraction}
      aria-label={`Apple with letter ${apple.letter}`}
      role="button"
      tabIndex={0}
    >
      <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center filter drop-shadow-md group-hover:drop-shadow-xl transition-all">
        {/* Glow for special/bonus apples */}
        {apple.type === 'rainbow' && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-yellow-300 scale-125 pointer-events-none" />
        )}

        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`grad-${apple.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorMap.gradientStart} />
              <stop offset="100%" stopColor={colorMap.gradientEnd} />
            </linearGradient>

            <linearGradient id={`leaf-grad-${apple.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>

            <radialGradient id={`glow-${apple.id}`} cx="35%" cy="30%" r="45%">
              <stop offset="0%" stopColor={colorMap.highlight} stopOpacity="0.8" />
              <stop offset="100%" stopColor={colorMap.highlight} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Wooden Stem */}
          <path
            d="M 50 24 C 51 15, 56 10, 62 7 C 60 7, 56 12, 53 24 Z"
            fill="#78350f"
            stroke="#451a03"
            strokeWidth="1"
          />

          {/* Fresh Green Leaf */}
          <path
            d="M 53 18 C 65 14, 75 20, 78 26 C 68 30, 58 24, 53 18 Z"
            fill={`url(#leaf-grad-${apple.id})`}
            stroke="#14532d"
            strokeWidth="1.2"
          />

          {/* Leaf vein */}
          <path
            d="M 55 19 C 64 21, 72 24, 75 25"
            stroke="#166534"
            strokeWidth="0.8"
            fill="none"
          />

          {/* Main Apple Body (Heart-rounded cute apple silhouette) */}
          <path
            d="M 50 26 
               C 36 18, 16 26, 16 50 
               C 16 70, 32 88, 48 88 
               C 49 88, 50 87, 50 87 
               C 50 87, 51 88, 52 88 
               C 68 88, 84 70, 84 50 
               C 84 26, 64 18, 50 26 Z"
            fill={`url(#grad-${apple.id})`}
            stroke={colorMap.borderColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Top shine highlight for juicy glossy 3D fruit feel */}
          <ellipse
            cx="34"
            cy="36"
            rx="12"
            ry="7"
            transform="rotate(-20 34 36)"
            fill="white"
            opacity="0.5"
          />
          <circle cx="28" cy="45" r="3" fill="white" opacity="0.4" />

          {/* Cute Friendly Cartoon Face */}
          {/* Eyes */}
          <circle cx="38" cy="52" r="3.5" fill="#1e293b" />
          <circle cx="39.2" cy="51" r="1.3" fill="#ffffff" />

          <circle cx="62" cy="52" r="3.5" fill="#1e293b" />
          <circle cx="63.2" cy="51" r="1.3" fill="#ffffff" />

          {/* Cute Rosy Cheeks */}
          <ellipse cx="32" cy="57" rx="3.5" ry="2" fill="#fda4af" opacity="0.8" />
          <ellipse cx="68" cy="57" rx="3.5" ry="2" fill="#fda4af" opacity="0.8" />

          {/* Sweet Smile */}
          <path
            d="M 44 56 Q 50 63 56 56"
            stroke="#1e293b"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Big high-contrast English Letter or Word Tag on the Apple */}
        <div className="absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-md border border-amber-200 flex items-center justify-center">
          <span
            className="font-bold text-xs md:text-sm tracking-wide text-rose-700"
            style={{ color: apple.type === 'golden' ? '#b45309' : '#be123c' }}
          >
            {apple.letter}
          </span>
        </div>

        {/* Floating touch hint for children */}
        <div className="absolute -top-3 right-0 bg-yellow-400 text-amber-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Tap!
        </div>
      </div>
    </div>
  );
};
