export type AppleType = 'red' | 'golden' | 'green' | 'rainbow';

export interface FallingApple {
  id: string;
  x: number; // percentage (8% - 90%)
  y: number; // percentage (-5% to 105%)
  speed: number; // fall rate per tick
  size: number; // scaling factor
  type: AppleType;
  letter: string; // 'A', 'P', 'P', 'L', 'E' or 'Apple'
  letterIndex?: number; // 0 to 4 for spelling
  swayPhase: number;
  swaySpeed: number;
  points: number;
  sparkles?: boolean;
}

export interface PopParticle {
  id: string;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  size: number;
  life: number;
}

export type GameSpeed = 'slow' | 'medium' | 'fast';
export type PronunciationMode = 'word' | 'phonics' | 'sentence';
export type GameMode = 'orchard' | 'spelling';

export interface AppleWordData {
  word: string;
  phonetic: string;
  chinese: string;
  letters: string[];
  sampleSentences: {
    en: string;
    zh: string;
  }[];
}
