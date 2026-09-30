/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from './utils/audio';
import { AppleItem } from './components/AppleItem';
import { AppleTree } from './components/AppleTree';
import { AppleWordPopup } from './components/AppleWordPopup';
import { HarvestBasket } from './components/HarvestBasket';
import { TeacherToolbar } from './components/TeacherToolbar';
import { TeacherFlashcardModal } from './components/TeacherFlashcardModal';
import { SpellingHeader } from './components/SpellingHeader';
import { CelebrationModal } from './components/CelebrationModal';
import { FallingApple, GameMode, GameSpeed, PopParticle } from './types';

interface HangingAppleData {
  id: string;
  x: number;
  y: number;
  size: number;
  type: 'red' | 'golden' | 'green';
}

const PRAISES = [
  '太棒啦！',
  '发音真好！',
  'Super!',
  'Great Job!',
  'Awesome!',
  'Delicious!',
  'Yummy!',
  'Perfect!',
];

const SPELLING_LETTERS = ['A', 'P', 'P', 'L', 'E'];

export default function App() {
  // Game states
  const [score, setScore] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [gameMode, setGameMode] = useState<GameMode>('orchard');
  const [gameSpeed, setGameSpeed] = useState<GameSpeed>('medium');
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals & Popups
  const [isTeacherCardOpen, setIsTeacherCardOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentPraise, setCurrentPraise] = useState('Great Job!');
  const [currentScoreGained, setCurrentScoreGained] = useState(10);
  const [lastAppleType, setLastAppleType] = useState('red');

  // Spelling mode states
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingCompleteCount, setSpellingCompleteCount] = useState(0);

  // Active falling apples
  const [fallingApples, setFallingApples] = useState<FallingApple[]>([]);

  // Hanging apples in the canopy
  const [hangingApples, setHangingApples] = useState<HangingAppleData[]>([
    { id: 'hang-1', x: 28, y: 24, size: 1.05, type: 'red' },
    { id: 'hang-2', x: 38, y: 19, size: 0.95, type: 'red' },
    { id: 'hang-3', x: 50, y: 15, size: 1.1, type: 'golden' },
    { id: 'hang-4', x: 62, y: 20, size: 1.0, type: 'red' },
    { id: 'hang-5', x: 72, y: 26, size: 0.95, type: 'green' },
    { id: 'hang-6', x: 34, y: 32, size: 1.0, type: 'green' },
    { id: 'hang-7', x: 65, y: 31, size: 1.05, type: 'red' },
    { id: 'hang-8', x: 48, y: 28, size: 1.15, type: 'golden' },
  ]);

  // Click burst particles
  const [particles, setParticles] = useState<PopParticle[]>([]);

  // Target goal
  const targetCount = 20;

  // Refs for animation loop
  const animFrameRef = useRef<number | null>(null);
  const lastSpawnTimeRef = useRef<number>(Date.now());
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const comboResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gameSpeedRef = useRef<GameSpeed>(gameSpeed);
  const gameModeRef = useRef<GameMode>(gameMode);
  const spellingIndexRef = useRef<number>(spellingIndex);

  // Keep refs in sync
  useEffect(() => {
    gameSpeedRef.current = gameSpeed;
  }, [gameSpeed]);

  useEffect(() => {
    gameModeRef.current = gameMode;
  }, [gameMode]);

  useEffect(() => {
    spellingIndexRef.current = spellingIndex;
  }, [spellingIndex]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        setIsFullscreen(false);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Audio Toggles
  const handleToggleBgm = () => {
    const playing = soundEngine.toggleBGM();
    setIsBgmPlaying(playing);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleInstantSpeak = () => {
    soundEngine.speak('Apple', { pitch: 1.15, rate: 0.9 });
  };

  // Trigger particle burst at client coordinates
  const triggerParticles = (clientX: number, clientY: number, color: string) => {
    const newParticles: PopParticle[] = [];
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5);
      const speed = 2 + Math.random() * 4;
      newParticles.push({
        id: `p-${Date.now()}-${i}-${Math.random()}`,
        x: clientX,
        y: clientY,
        color: i % 2 === 0 ? color : '#fde047',
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 5 + Math.random() * 6,
        life: 1.0,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Spawn a new falling apple
  const spawnFallingApple = useCallback(() => {
    const id = `apple-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    // Spread evenly across the tree branches (14% to 86%)
    const x = 14 + Math.random() * 72;
    // Start above/in the tree canopy
    const y = 8 + Math.random() * 18;

    // Speeds: Varied fast and slow as requested
    const speedBase =
      gameSpeedRef.current === 'slow' ? 0.22 : gameSpeedRef.current === 'fast' ? 0.65 : 0.38;
    // Add individual variance (+/- 45%)
    const speed = speedBase * (0.65 + Math.random() * 0.7);

    // Randomize types: mostly Red, with sweet Golden and crisp Green, plus rare Rainbow
    const randType = Math.random();
    let type: FallingApple['type'] = 'red';
    let points = 10;
    if (randType > 0.88) {
      type = 'rainbow';
      points = 30;
    } else if (randType > 0.68) {
      type = 'golden';
      points = 20;
    } else if (randType > 0.50) {
      type = 'green';
      points = 15;
    }

    // Determine letter
    let letter = 'Apple';
    let letterIndex: number | undefined;

    if (gameModeRef.current === 'spelling') {
      // In spelling mode, prioritize the current target letter, but provide other letters too
      const currentIdx = spellingIndexRef.current;
      const shouldSpawnTarget = Math.random() > 0.35;
      const targetChar = shouldSpawnTarget
        ? SPELLING_LETTERS[currentIdx]
        : SPELLING_LETTERS[Math.floor(Math.random() * SPELLING_LETTERS.length)];

      letter = targetChar;
      letterIndex = SPELLING_LETTERS.indexOf(targetChar);
    }

    const newApple: FallingApple = {
      id,
      x,
      y,
      speed,
      size: 0.9 + Math.random() * 0.25,
      type,
      letter,
      letterIndex,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.04 + Math.random() * 0.04,
      points,
    };

    setFallingApples((prev) => {
      // Keep maximum 8 concurrent falling apples to prevent screen clutter for young students
      if (prev.length >= 8) return prev;
      return [...prev, newApple];
    });
  }, []);

  // Handle catching/clicking an apple
  const handleCatchApple = (apple: FallingApple, e: React.MouseEvent | React.TouchEvent) => {
    // Start background music smoothly on first student click if not playing yet
    if (!isBgmPlaying && !soundEngine.getIsBgmPlaying()) {
      soundEngine.startBGM();
      setIsBgmPlaying(true);
    }

    // Coordinates for particle burst
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;
    if ('clientX' in e && e.clientX) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    // Pop sound & sparkles
    soundEngine.playApplePop(apple.type === 'rainbow' ? 1.3 : apple.type === 'golden' ? 1.15 : 1.0);
    if (apple.type === 'rainbow' || apple.type === 'golden') {
      soundEngine.playSparkleChime();
    }

    // Trigger visual particles
    const particleColor =
      apple.type === 'golden'
        ? '#f59e0b'
        : apple.type === 'green'
        ? '#84cc16'
        : apple.type === 'rainbow'
        ? '#ec4899'
        : '#ef4444';
    triggerParticles(clientX, clientY, particleColor);

    // Spelling Mode Check
    if (gameMode === 'spelling') {
      const targetChar = SPELLING_LETTERS[spellingIndex];
      if (apple.letter === targetChar) {
        // Correct letter in sequence!
        const nextIndex = spellingIndex + 1;
        if (nextIndex >= SPELLING_LETTERS.length) {
          // Completed full word "A-P-P-L-E"!
          setSpellingIndex(0);
          setSpellingCompleteCount((c) => c + 1);
          soundEngine.playCelebrationFanfare();
          soundEngine.speak('A, P, P, L, E! Apple! You did it!', { pitch: 1.2 });
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } else {
          setSpellingIndex(nextIndex);
          soundEngine.speak(`${apple.letter}! Next letter is ${SPELLING_LETTERS[nextIndex]}`, {
            pitch: 1.25,
            rate: 1.0,
          });
        }
      } else {
        // Tapped other letter, still read it out cheerfully
        soundEngine.speak(apple.letter, { pitch: 1.15 });
      }
    } else {
      // Normal Orchard Mode: Read "Apple!" prominently
      soundEngine.speak('Apple', { pitch: 1.18, rate: 0.95 });
    }

    // Remove the caught apple immediately
    setFallingApples((prev) => prev.filter((a) => a.id !== apple.id));

    // Update Combo & Score
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) {
      setMaxCombo(newCombo);
    }

    // Reset combo timeout if no apple is clicked for 5 seconds
    if (comboResetTimeoutRef.current) {
      clearTimeout(comboResetTimeoutRef.current);
    }
    comboResetTimeoutRef.current = setTimeout(() => {
      setCombo(1);
    }, 4500);

    const gained = apple.points * Math.min(4, newCombo);
    setCurrentScoreGained(gained);
    setScore((s) => s + gained);
    const newCollected = collectedCount + 1;
    setCollectedCount(newCollected);

    // Show Word Banner with random praise
    const randomPraise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
    setCurrentPraise(randomPraise);
    setLastAppleType(apple.type);
    setPopupVisible(true);

    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    popupTimeoutRef.current = setTimeout(() => {
      setPopupVisible(false);
    }, 3200);

    // Milestone Check (e.g. 20 apples collected)
    if (newCollected === targetCount || newCollected === targetCount * 2) {
      soundEngine.playCelebrationFanfare();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
      });
      setTimeout(() => {
        setIsCelebrationOpen(true);
      }, 500);
    }
  };

  // Click on a hanging apple in the tree canopy
  const handleHangingAppleClick = (apple: HangingAppleData, e: React.MouseEvent) => {
    // Pop sound + drop apple down into falling apples!
    soundEngine.playApplePop(1.1);
    soundEngine.speak('Apple', { pitch: 1.2, rate: 0.95 });

    // Remove from hanging tree, convert to falling apple with initial push
    setHangingApples((prev) => prev.filter((h) => h.id !== apple.id));

    const fallingItem: FallingApple = {
      id: `hang-drop-${Date.now()}`,
      x: apple.x,
      y: apple.y,
      speed: 0.45,
      size: apple.size,
      type: apple.type,
      letter: gameMode === 'spelling' ? SPELLING_LETTERS[spellingIndex] : 'Apple',
      swayPhase: 0,
      swaySpeed: 0.05,
      points: 15,
    };
    setFallingApples((prev) => [...prev, fallingItem]);

    // Respawn hanging apple on branch after 4 seconds
    setTimeout(() => {
      setHangingApples((prev) => [
        ...prev,
        {
          id: `hang-respawn-${Date.now()}`,
          x: apple.x,
          y: apple.y,
          size: apple.size,
          type: apple.type,
        },
      ]);
    }, 4500);
  };

  // Reset Game Round
  const handleResetGame = () => {
    setScore(0);
    setCollectedCount(0);
    setCombo(1);
    setSpellingIndex(0);
    setSpellingCompleteCount(0);
    setFallingApples([]);
    setPopupVisible(false);
    setIsCelebrationOpen(false);
    soundEngine.speak('New Round! Let us pick apples!', { pitch: 1.15, rate: 0.95 });
  };

  // Main Game Physics Loop (RAF)
  useEffect(() => {
    let lastTick = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(100, now - lastTick);
      lastTick = now;

      // Spawn check
      const spawnInterval =
        gameSpeedRef.current === 'slow' ? 2400 : gameSpeedRef.current === 'fast' ? 1200 : 1700;
      if (Date.now() - lastSpawnTimeRef.current > spawnInterval) {
        lastSpawnTimeRef.current = Date.now();
        spawnFallingApple();
      }

      // Update falling apples positions
      setFallingApples((prev) => {
        return prev
          .map((apple) => {
            const nextY = apple.y + apple.speed * (dt / 16.6);
            const nextSway = apple.swayPhase + apple.swaySpeed;
            return {
              ...apple,
              y: nextY,
              swayPhase: nextSway,
            };
          })
          .filter((apple) => apple.y < 108); // Filter out apples that reached the bottom
      });

      // Update particles
      setParticles((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            life: p.life - 0.035,
          }))
          .filter((p) => p.life > 0);
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [spawnFallingApple]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
      if (comboResetTimeoutRef.current) clearTimeout(comboResetTimeoutRef.current);
      soundEngine.stopBGM();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-amber-50">
      {/* Teacher Top Navigation & Classroom Controls */}
      <TeacherToolbar
        isBgmPlaying={isBgmPlaying}
        isMuted={isMuted}
        gameMode={gameMode}
        gameSpeed={gameSpeed}
        isFullscreen={isFullscreen}
        onToggleBgm={handleToggleBgm}
        onToggleMute={handleToggleMute}
        onChangeGameMode={setGameMode}
        onChangeSpeed={setGameSpeed}
        onResetGame={handleResetGame}
        onOpenTeacherCard={() => setIsTeacherCardOpen(true)}
        onToggleFullscreen={toggleFullscreen}
        onInstantSpeak={handleInstantSpeak}
      />

      {/* Spelling Target Header in Spelling Mode */}
      {gameMode === 'spelling' && (
        <SpellingHeader
          currentLetterIndex={spellingIndex}
          wordCompletedCount={spellingCompleteCount}
        />
      )}

      {/* Lush Tree & Orchard Viewport */}
      <AppleTree
        hangingApples={hangingApples}
        onHangingAppleClick={handleHangingAppleClick}
      >
        {/* Active Falling Apples */}
        {fallingApples.map((apple) => (
          <AppleItem
            key={apple.id}
            apple={apple}
            onCatch={handleCatchApple}
          />
        ))}

        {/* Click Burst Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.life,
              transform: `scale(${p.life})`,
            }}
            className="absolute rounded-full pointer-events-none z-30 shadow-xs"
          />
        ))}

        {/* Word Display & Audio Replay Popup Banner */}
        <AppleWordPopup
          visible={popupVisible}
          scoreGained={currentScoreGained}
          combo={combo}
          praise={currentPraise}
          appleType={lastAppleType}
          onReplayAudio={handleInstantSpeak}
          onLetterClick={(char) => soundEngine.speak(char, { pitch: 1.2 })}
        />

        {/* Harvest Basket & Live Score at Bottom */}
        <HarvestBasket
          collectedCount={collectedCount}
          score={score}
          combo={combo}
          maxCombo={maxCombo}
          targetCount={targetCount}
        />

        {/* Classroom Quick Instructions Hint on Tree Canopy */}
        <div className="absolute top-16 md:top-20 right-4 pointer-events-none z-20 hidden md:block">
          <div className="bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-amber-200 text-xs font-bold text-amber-950 shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>点击树上或掉落的苹果，听标准美音发音 🍎</span>
          </div>
        </div>
      </AppleTree>

      {/* Teacher Flashcard & Lesson Plan Modal */}
      <TeacherFlashcardModal
        isOpen={isTeacherCardOpen}
        onClose={() => setIsTeacherCardOpen(false)}
      />

      {/* Round Celebration Modal on Target Hit */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        score={score}
        collectedCount={collectedCount}
        maxCombo={maxCombo}
        onContinue={() => setIsCelebrationOpen(false)}
        onRestart={handleResetGame}
      />
    </div>
  );
}
