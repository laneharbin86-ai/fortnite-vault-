/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CosmeticItem } from '../types/fortnite';

export interface RarityStyle {
  label: string;
  badgeBg: string;
  badgeText: string;
  cardBg: string;
  cardBorder: string;
  glowColor: string;
  headerGradient: string;
}

export function getRarityStyle(item: Partial<CosmeticItem>): RarityStyle {
  const seriesName = item.series?.value?.toLowerCase() || '';
  const rarityVal = item.rarity?.value?.toLowerCase() || item.rarity?.displayValue?.toLowerCase() || 'common';

  // Special Series take precedence in Fortnite
  if (seriesName.includes('marvel')) {
    return {
      label: 'Marvel Series',
      badgeBg: 'bg-red-600',
      badgeText: 'text-white',
      cardBg: 'from-red-950/80 via-slate-900 to-slate-950',
      cardBorder: 'border-red-600/50 hover:border-red-500',
      glowColor: 'rgba(239, 68, 68, 0.4)',
      headerGradient: 'from-red-700 to-red-900',
    };
  }

  if (seriesName.includes('star wars') || seriesName.includes('starwars')) {
    return {
      label: 'Star Wars Series',
      badgeBg: 'bg-sky-600',
      badgeText: 'text-white',
      cardBg: 'from-sky-950/80 via-slate-900 to-slate-950',
      cardBorder: 'border-sky-500/50 hover:border-sky-400',
      glowColor: 'rgba(56, 189, 248, 0.4)',
      headerGradient: 'from-sky-700 to-sky-950',
    };
  }

  if (seriesName.includes('dc')) {
    return {
      label: 'DC Series',
      badgeBg: 'bg-blue-700',
      badgeText: 'text-white',
      cardBg: 'from-blue-950/80 via-slate-900 to-slate-950',
      cardBorder: 'border-blue-600/50 hover:border-blue-500',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      headerGradient: 'from-blue-700 to-slate-950',
    };
  }

  if (seriesName.includes('gaming') || seriesName.includes('platform')) {
    return {
      label: 'Gaming Legends',
      badgeBg: 'bg-indigo-600',
      badgeText: 'text-white',
      cardBg: 'from-indigo-950/80 via-slate-900 to-slate-950',
      cardBorder: 'border-indigo-500/50 hover:border-indigo-400',
      glowColor: 'rgba(99, 102, 241, 0.4)',
      headerGradient: 'from-indigo-600 to-violet-950',
    };
  }

  if (seriesName.includes('icon')) {
    return {
      label: 'Icon Series',
      badgeBg: 'bg-teal-500',
      badgeText: 'text-slate-950',
      cardBg: 'from-teal-950/80 via-slate-900 to-slate-950',
      cardBorder: 'border-teal-500/50 hover:border-teal-400',
      glowColor: 'rgba(20, 184, 166, 0.4)',
      headerGradient: 'from-teal-600 to-emerald-950',
    };
  }

  if (seriesName.includes('lava')) {
    return {
      label: 'Lava Series',
      badgeBg: 'bg-orange-600',
      badgeText: 'text-white',
      cardBg: 'from-orange-950/90 via-amber-950/40 to-slate-950',
      cardBorder: 'border-orange-500/60 hover:border-orange-400',
      glowColor: 'rgba(249, 115, 22, 0.5)',
      headerGradient: 'from-orange-600 to-red-950',
    };
  }

  if (seriesName.includes('frozen')) {
    return {
      label: 'Frozen Series',
      badgeBg: 'bg-cyan-400',
      badgeText: 'text-slate-950',
      cardBg: 'from-cyan-950/80 via-slate-900 to-slate-950',
      cardBorder: 'border-cyan-400/50 hover:border-cyan-300',
      glowColor: 'rgba(34, 211, 238, 0.4)',
      headerGradient: 'from-cyan-500 to-blue-950',
    };
  }

  if (seriesName.includes('slurp')) {
    return {
      label: 'Slurp Series',
      badgeBg: 'bg-cyan-500',
      badgeText: 'text-white',
      cardBg: 'from-cyan-950/80 via-emerald-950/30 to-slate-950',
      cardBorder: 'border-cyan-500/50 hover:border-cyan-400',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      headerGradient: 'from-cyan-600 to-teal-950',
    };
  }

  if (seriesName.includes('dark')) {
    return {
      label: 'Dark Series',
      badgeBg: 'bg-fuchsia-700',
      badgeText: 'text-white',
      cardBg: 'from-fuchsia-950/90 via-purple-950 to-slate-950',
      cardBorder: 'border-fuchsia-500/50 hover:border-fuchsia-400',
      glowColor: 'rgba(217, 70, 239, 0.4)',
      headerGradient: 'from-fuchsia-700 to-purple-950',
    };
  }

  if (seriesName.includes('shadow')) {
    return {
      label: 'Shadow Series',
      badgeBg: 'bg-slate-700',
      badgeText: 'text-white',
      cardBg: 'from-slate-900 via-neutral-900 to-black',
      cardBorder: 'border-slate-600/50 hover:border-slate-400',
      glowColor: 'rgba(148, 163, 184, 0.3)',
      headerGradient: 'from-slate-700 to-slate-900',
    };
  }

  // Standard Fortnite Rarities
  switch (rarityVal) {
    case 'mythic':
      return {
        label: 'Mythic',
        badgeBg: 'bg-amber-400',
        badgeText: 'text-slate-950',
        cardBg: 'from-amber-950/90 via-yellow-950/40 to-slate-950',
        cardBorder: 'border-amber-400/60 hover:border-amber-300',
        glowColor: 'rgba(251, 191, 36, 0.5)',
        headerGradient: 'from-amber-500 to-yellow-600',
      };
    case 'legendary':
      return {
        label: 'Legendary',
        badgeBg: 'bg-amber-500',
        badgeText: 'text-slate-950',
        cardBg: 'from-amber-950/70 via-slate-900 to-slate-950',
        cardBorder: 'border-amber-500/50 hover:border-amber-400',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        headerGradient: 'from-amber-600 to-amber-800',
      };
    case 'epic':
      return {
        label: 'Epic',
        badgeBg: 'bg-purple-600',
        badgeText: 'text-white',
        cardBg: 'from-purple-950/70 via-slate-900 to-slate-950',
        cardBorder: 'border-purple-500/50 hover:border-purple-400',
        glowColor: 'rgba(168, 85, 247, 0.4)',
        headerGradient: 'from-purple-600 to-purple-800',
      };
    case 'rare':
      return {
        label: 'Rare',
        badgeBg: 'bg-blue-600',
        badgeText: 'text-white',
        cardBg: 'from-blue-950/70 via-slate-900 to-slate-950',
        cardBorder: 'border-blue-500/50 hover:border-blue-400',
        glowColor: 'rgba(59, 130, 246, 0.4)',
        headerGradient: 'from-blue-600 to-blue-800',
      };
    case 'uncommon':
      return {
        label: 'Uncommon',
        badgeBg: 'bg-emerald-600',
        badgeText: 'text-white',
        cardBg: 'from-emerald-950/60 via-slate-900 to-slate-950',
        cardBorder: 'border-emerald-500/50 hover:border-emerald-400',
        glowColor: 'rgba(16, 185, 129, 0.35)',
        headerGradient: 'from-emerald-600 to-emerald-800',
      };
    case 'common':
    default:
      return {
        label: item.rarity?.displayValue || 'Common',
        badgeBg: 'bg-slate-600',
        badgeText: 'text-slate-100',
        cardBg: 'from-slate-900 via-slate-900/90 to-slate-950',
        cardBorder: 'border-slate-700/60 hover:border-slate-500',
        glowColor: 'rgba(148, 163, 184, 0.2)',
        headerGradient: 'from-slate-700 to-slate-800',
      };
  }
}

// Interactive Web Audio Sound Effects Synthesizer (no external mp3 files required)
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled = true;
  public volume = 0.8;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
  }

  playClick() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playEquip() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.14);
  }

  playInspect() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.06 * this.volume, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.18);
    });
  }

  playSuccess() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 1046.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.1 * this.volume, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.22);
    });
  }

  playFail() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
    gain.gain.setValueAtTime(0.09 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playChest() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.08 * this.volume, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.25);
    });
  }

  playVictory() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [587.33, 587.33, 587.33, 587.33, 659.25, 783.99, 880, 1174.66];
    const delays = [0, 0.1, 0.2, 0.32, 0.45, 0.58, 0.72, 0.9];
    const durations = [0.08, 0.08, 0.08, 0.1, 0.1, 0.12, 0.15, 0.45];

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delays[i]);
      gain.gain.setValueAtTime(0.12 * this.volume, now + delays[i]);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delays[i] + durations[i]);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + delays[i]);
      osc.stop(now + delays[i] + durations[i]);
    });
  }
}

export const soundFX = new SoundFX();
