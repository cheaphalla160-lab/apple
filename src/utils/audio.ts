/**
 * Synthesizer & Speech Audio Engine for Apple Learning Game
 * Uses Web Audio API for zero-latency, reliable procedural music and sound effects,
 * combined with Web Speech Synthesis for crystal-clear English pronunciation.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying = false;
  private isMuted = false;
  private bgmVolume = 0.35;
  private sfxVolume = 0.8;
  private currentStep = 0;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural sounding en-US or en-GB female/child friendly voices
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Karen') ||
          v.name.includes('Zira') ||
          v.name.includes('Victoria'))
    ) || voices.find((v) => v.lang.startsWith('en'));
    if (preferred) {
      this.voice = preferred;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play crisp pop sound with bright harmonic overtone when clicking an apple
  public playApplePop(pitchMultiplier = 1.0) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Primary bubble/pop tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    const baseFreq = 420 * pitchMultiplier;
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.08);

    gain1.gain.setValueAtTime(0.5 * this.sfxVolume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.16);

    // Sweet wooden xylophone overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 2, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);

    gain2.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now);
    osc2.stop(now + 0.12);
  }

  // Sparkling star chord for combos or bonus apples
  public playSparkleChime() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // Fanfare for goal completion / level up
  public playCelebrationFanfare() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const chordNotes = [
      { f: 523.25, d: 0.15, offset: 0 },
      { f: 659.25, d: 0.15, offset: 0.12 },
      { f: 783.99, d: 0.15, offset: 0.24 },
      { f: 1046.5, d: 0.45, offset: 0.36 },
      { f: 1318.51, d: 0.5, offset: 0.42 },
    ];

    chordNotes.forEach(({ f, d, offset }) => {
      const startTime = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.35 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + d);
    });
  }

  // Pronounce English Words with Web Speech Synthesis
  public speak(text: string, options?: { rate?: number; pitch?: number; onEnd?: () => void }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Cancel any ongoing speech for snappy response

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options?.rate ?? 0.95; // Slightly measured for elementary students
    utterance.pitch = options?.pitch ?? 1.15; // Cheerful friendly teacher pitch
    utterance.volume = this.isMuted ? 0 : 1.0;

    if (this.voice) {
      utterance.voice = this.voice;
    }

    if (options?.onEnd) {
      utterance.onend = options.onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Phonics spelling sequence: "A ... P ... P ... L ... E! ... Apple!"
  public speakPhonics(onComplete?: () => void) {
    this.speak('A, P, P, L, E. Apple!', {
      rate: 0.85,
      pitch: 1.1,
      onEnd: onComplete,
    });
  }

  // Play relaxed, cheerful background music loop using gentle marimba/chime tones
  public startBGM() {
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Cheerful, friendly nursery progression: C - G - Am - F (C major pentatonic warmth)
    // Notes in Hz: C4, D4, E4, G4, A4, C5, D5, E5, G5
    const melodyPattern = [
      { note: 523.25, duration: 0.35, bass: 261.63 }, // C5 + C4
      { note: 659.25, duration: 0.35, bass: null },   // E5
      { note: 783.99, duration: 0.45, bass: 392.00 }, // G5 + G4
      { note: 659.25, duration: 0.35, bass: null },   // E5
      { note: 880.00, duration: 0.4, bass: 220.00 },  // A5 + A3
      { note: 783.99, duration: 0.35, bass: null },   // G5
      { note: 659.25, duration: 0.4, bass: 349.23 },  // E5 + F4
      { note: 523.25, duration: 0.5, bass: null },   // C5
      { note: 587.33, duration: 0.35, bass: 261.63 }, // D5 + C4
      { note: 659.25, duration: 0.35, bass: null },   // E5
      { note: 783.99, duration: 0.45, bass: 392.00 }, // G5 + G4
      { note: 880.00, duration: 0.35, bass: null },   // A5
      { note: 1046.5, duration: 0.6, bass: 349.23 },  // C6 + F4
      { note: 783.99, duration: 0.4, bass: null },   // G5
      { note: 659.25, duration: 0.5, bass: 392.00 },  // E5 + G4
      { note: 523.25, duration: 0.6, bass: 261.63 }, // C5 + C4
    ];

    const stepDurationMs = 380; // Relaxed bouncy tempo (~78 bpm)

    this.bgmInterval = window.setInterval(() => {
      if (!this.isBgmPlaying || this.isMuted) return;

      const actx = this.getAudioContext();
      if (!actx) return;

      const current = melodyPattern[this.currentStep % melodyPattern.length];
      this.currentStep = (this.currentStep + 1) % melodyPattern.length;

      const now = actx.currentTime;

      // Play soft marimba melody note
      if (current.note) {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(current.note, now);

        const vol = 0.12 * this.bgmVolume;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + current.duration);

        osc.connect(gain);
        gain.connect(actx.destination);

        osc.start(now);
        osc.stop(now + current.duration);
      }

      // Play warm acoustic bass accompaniment
      if (current.bass) {
        const bassOsc = actx.createOscillator();
        const bassGain = actx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(current.bass, now);

        const bassVol = 0.14 * this.bgmVolume;
        bassGain.gain.setValueAtTime(bassVol, now);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + current.duration * 1.5);

        bassOsc.connect(bassGain);
        bassGain.connect(actx.destination);

        bassOsc.start(now);
        bassOsc.stop(now + current.duration * 1.5);
      }
    }, stepDurationMs);
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setBgmVolume(val: number) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
  }
}

export const soundEngine = new SoundEngine();
