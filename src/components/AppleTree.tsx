import React from 'react';
import orchardBg from '../assets/images/game_orchard_background_1790741548060.jpg';

interface HangingApple {
  id: string;
  x: number; // percentage
  y: number; // percentage
  size: number;
  type: 'red' | 'golden' | 'green';
}

interface AppleTreeProps {
  hangingApples: HangingApple[];
  onHangingAppleClick: (apple: HangingApple, e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export const AppleTree: React.FC<AppleTreeProps> = ({
  hangingApples,
  onHangingAppleClick,
  children,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Orchard Background Painting with Resilient Gradient Fallback */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100">
        <img
          src={orchardBg}
          alt="Sunny Apple Orchard Background"
          className="w-full h-full object-cover object-center opacity-85 transition-opacity duration-1000"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Graceful fallback to styled CSS landscape if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Soft atmospheric gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-sky-400/10 pointer-events-none" />
      </div>

      {/* Cheerful Cartoon Sun in Sky */}
      <div className="absolute top-14 left-8 md:left-16 pointer-events-none z-0">
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          {/* Sun Rays */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '24s' }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 md:w-4 h-6 md:h-7 bg-amber-300/80 rounded-full left-1/2 -translate-x-1/2 -top-4 origin-bottom"
                style={{ transform: `rotate(${i * 45}deg) translateY(-24px)` }}
              />
            ))}
          </div>
          {/* Sun Core */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-amber-300 to-amber-400 shadow-lg border-2 border-yellow-200 flex items-center justify-center">
            {/* Sun Face */}
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-900" />
                <div className="w-2 h-2 rounded-full bg-amber-900" />
              </div>
              <div className="w-3.5 h-1.5 border-b-2 border-amber-900 rounded-full mt-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animated Cartoon Clouds */}
      <div className="absolute top-10 left-1/4 w-32 h-12 bg-white/70 rounded-full blur-[0.5px] pointer-events-none animate-floatCloud" style={{ animationDuration: '45s' }}>
        <div className="absolute -top-4 left-4 w-14 h-14 bg-white/70 rounded-full" />
        <div className="absolute -top-6 left-12 w-16 h-16 bg-white/70 rounded-full" />
      </div>
      <div className="absolute top-20 right-1/4 w-40 h-14 bg-white/60 rounded-full blur-[0.5px] pointer-events-none animate-floatCloud" style={{ animationDuration: '60s', animationDelay: '-20s' }}>
        <div className="absolute -top-5 left-6 w-16 h-16 bg-white/60 rounded-full" />
        <div className="absolute -top-7 left-16 w-18 h-18 bg-white/60 rounded-full" />
      </div>

      {/* Master Lush Apple Tree Illustration (SVG Canvas) */}
      <div className="absolute inset-0 pointer-events-none z-10 flex justify-center items-end">
        <svg
          viewBox="0 0 1000 800"
          className="w-full h-full max-h-[88vh] object-contain object-bottom pointer-events-none"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            {/* Trunk Gradient */}
            <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5c2c16" />
              <stop offset="35%" stopColor="#854d27" />
              <stop offset="65%" stopColor="#a36336" />
              <stop offset="100%" stopColor="#5c2c16" />
            </linearGradient>

            {/* Tree Foliage Gradients */}
            <radialGradient id="foliageGrad1" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="60%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </radialGradient>

            <radialGradient id="foliageGrad2" cx="40%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="55%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>

            <radialGradient id="foliageGrad3" cx="60%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </radialGradient>

            {/* Tree Shadow */}
            <radialGradient id="treeShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ground Soft Shadow */}
          <ellipse cx="500" cy="740" rx="340" ry="40" fill="url(#treeShadow)" />

          {/* Sturdy Apple Tree Trunk */}
          <path
            d="M 450 750 
               C 440 680, 460 560, 430 460 
               C 415 410, 370 370, 310 330 
               C 335 345, 380 390, 435 440 
               C 445 400, 470 360, 500 310 
               C 525 360, 545 395, 555 435 
               C 610 380, 665 340, 690 325 
               C 630 365, 580 410, 560 465 
               C 530 560, 550 680, 540 750 Z"
            fill="url(#trunkGrad)"
            stroke="#381a08"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Bark texture & hollow */}
          <path d="M 475 510 C 470 540, 485 580, 478 620" stroke="#3d1e0f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 515 530 C 520 570, 505 610, 515 650" stroke="#3d1e0f" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Cute Tree Hollow with peek */}
          <ellipse cx="495" cy="565" rx="14" ry="20" fill="#2d150b" />
          <ellipse cx="495" cy="565" rx="11" ry="16" fill="#170a05" />
          {/* Friendly squirrel eyes inside hollow */}
          <circle cx="491" cy="562" r="2.2" fill="#fbbf24" />
          <circle cx="498" cy="562" r="2.2" fill="#fbbf24" />

          {/* Primary Lush Canopy - Layer 1 (Dark back depth) */}
          <g fill="url(#foliageGrad1)" stroke="#0f3d1e" strokeWidth="3">
            <circle cx="320" cy="270" r="115" />
            <circle cx="680" cy="270" r="115" />
            <circle cx="500" cy="210" r="135" />
          </g>

          {/* Primary Lush Canopy - Layer 2 (Middle vibrant volume) */}
          <g fill="url(#foliageGrad2)" stroke="#14532d" strokeWidth="3">
            <circle cx="240" cy="240" r="95" />
            <circle cx="380" cy="180" r="110" />
            <circle cx="620" cy="180" r="110" />
            <circle cx="760" cy="240" r="95" />
            <circle cx="500" cy="140" r="125" />
          </g>

          {/* Primary Lush Canopy - Layer 3 (Foreground highlights & round pillowy tufts) */}
          <g fill="url(#foliageGrad3)" stroke="#15803d" strokeWidth="3">
            <circle cx="300" cy="170" r="85" />
            <circle cx="450" cy="120" r="95" />
            <circle cx="550" cy="120" r="95" />
            <circle cx="700" cy="170" r="85" />
            <circle cx="500" cy="260" r="90" />
          </g>

          {/* Leaf highlights/tufts */}
          <path d="M 460 90 Q 480 75 500 90" stroke="#bbf7d0" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 320 140 Q 340 125 360 140" stroke="#bbf7d0" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 640 140 Q 660 125 680 140" stroke="#bbf7d0" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Hanging Apples on the Tree (Interactive: kids can also tap them directly on the tree to drop them!) */}
      <div className="absolute inset-0 pointer-events-auto z-20">
        {hangingApples.map((apple) => (
          <div
            key={apple.id}
            style={{
              left: `${apple.x}%`,
              top: `${apple.y}%`,
              transform: `scale(${apple.size})`,
            }}
            onClick={(e) => onHangingAppleClick(apple, e)}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 active:scale-95 group animate-sway"
            title="点击摘下红苹果！"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 relative filter drop-shadow-md">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Stem */}
                <path d="M 50 25 C 50 16, 56 12, 60 9" stroke="#5c2c16" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Leaf */}
                <path d="M 52 20 C 62 16, 70 20, 72 26 C 64 28, 56 24, 52 20 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
                {/* Body */}
                <path
                  d="M 50 26 C 36 18, 16 26, 16 50 C 16 70, 32 88, 48 88 C 49 88, 50 87, 50 87 C 50 87, 51 88, 52 88 C 68 88, 84 70, 84 50 C 84 26, 64 18, 50 26 Z"
                  fill={apple.type === 'golden' ? '#fbbf24' : apple.type === 'green' ? '#84cc16' : '#ef4444'}
                  stroke={apple.type === 'golden' ? '#b45309' : apple.type === 'green' ? '#3f6212' : '#991b1b'}
                  strokeWidth="2.5"
                />
                {/* Shine */}
                <ellipse cx="36" cy="38" rx="8" ry="4" transform="rotate(-20 36 38)" fill="white" opacity="0.6" />
              </svg>
              {/* Cute shimmer indicator */}
              <div className="absolute inset-0 rounded-full ring-2 ring-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Rolling Meadow Ground at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-24 md:h-32 pointer-events-none z-15">
        <svg viewBox="0 0 1200 150" className="w-full h-full object-cover" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grassGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <linearGradient id="grassGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
          </defs>
          {/* Back grassy hill */}
          <path d="M 0 60 Q 300 20 600 50 T 1200 30 L 1200 150 L 0 150 Z" fill="url(#grassGrad1)" />
          {/* Fore grassy hill */}
          <path d="M 0 85 Q 400 45 800 90 T 1200 70 L 1200 150 L 0 150 Z" fill="url(#grassGrad2)" />

          {/* Wildflowers / Daisies */}
          <g>
            <circle cx="150" cy="110" r="5" fill="#facc15" />
            <circle cx="145" cy="110" r="3" fill="#ffffff" />
            <circle cx="155" cy="110" r="3" fill="#ffffff" />
            <circle cx="150" cy="105" r="3" fill="#ffffff" />
            <circle cx="150" cy="115" r="3" fill="#ffffff" />

            <circle cx="450" cy="120" r="5" fill="#f43f5e" />
            <circle cx="850" cy="105" r="5" fill="#facc15" />
            <circle cx="1020" cy="118" r="5" fill="#38bdf8" />
          </g>
        </svg>
      </div>

      {/* Active Layer for falling apples, particles, and modals */}
      {children}
    </div>
  );
};
