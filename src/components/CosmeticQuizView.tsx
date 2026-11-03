/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CosmeticItem } from '../types/fortnite';
import { getRarityStyle, soundFX } from '../utils/rarity';
import { Sparkles, Trophy, Flame, HelpCircle, CheckCircle2, XCircle, ArrowRight, Eye, RefreshCw, Zap } from 'lucide-react';

interface CosmeticQuizViewProps {
  allCosmetics: CosmeticItem[];
  onInspectItem: (item: CosmeticItem) => void;
}

type QuizMode = 'silhouette' | 'set' | 'chapter';

interface Question {
  item: CosmeticItem;
  mode: QuizMode;
  questionText: string;
  options: string[];
  correctIndex: number;
  hint?: string;
}

const BEST_STREAK_KEY = 'fortnite_vault_quiz_best_streak_v1';

export const CosmeticQuizView: React.FC<CosmeticQuizViewProps> = ({
  allCosmetics,
  onInspectItem,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(BEST_STREAK_KEY) || '0', 10);
    } catch {
      return 0;
    }
  });
  const [revealed, setRevealed] = useState<boolean>(false);

  // Generate question from available items
  const generateQuestion = useCallback(() => {
    const validOutfits = allCosmetics.filter(
      (c) =>
        (c.type?.value === 'outfit' || c.type?.backendValue === 'AthenaCharacter') &&
        (c.images.featured || c.images.icon) &&
        c.name &&
        c.name.trim().length > 0
    );

    if (validOutfits.length < 10) return;

    // Pick target item
    const targetIdx = Math.floor(Math.random() * validOutfits.length);
    const target = validOutfits[targetIdx];

    const modes: QuizMode[] = ['silhouette'];
    if (target.set?.value) modes.push('set');
    if (target.introduction?.chapter) modes.push('chapter');

    const mode = modes[Math.floor(Math.random() * modes.length)];

    let questionText = '';
    let options: string[] = [];
    let correctIndex = 0;

    if (mode === 'silhouette') {
      questionText = 'Identify this mystery Fortnite outfit:';
      const distractors: string[] = [];
      while (distractors.length < 3) {
        const rand = validOutfits[Math.floor(Math.random() * validOutfits.length)];
        if (rand.name !== target.name && !distractors.includes(rand.name)) {
          distractors.push(rand.name);
        }
      }
      const allOpts = [...distractors, target.name].sort(() => Math.random() - 0.5);
      correctIndex = allOpts.indexOf(target.name);
      options = allOpts;
    } else if (mode === 'set') {
      questionText = `Which cosmetic set does "${target.name}" belong to?`;
      const targetSet = target.set?.value || 'Default Set';
      const distractors: string[] = [];
      const setPool = allCosmetics
        .map((c) => c.set?.value)
        .filter((s): s is string => !!s && s !== targetSet);

      while (distractors.length < 3 && setPool.length >= 3) {
        const rand = setPool[Math.floor(Math.random() * setPool.length)];
        if (!distractors.includes(rand)) {
          distractors.push(rand);
        }
      }
      const allOpts = [...distractors, targetSet].sort(() => Math.random() - 0.5);
      correctIndex = allOpts.indexOf(targetSet);
      options = allOpts;
    } else {
      questionText = `In which Chapter was "${target.name}" originally introduced?`;
      const targetChapter = `Chapter ${target.introduction?.chapter || '1'}`;
      const allPossible = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6'];
      const filtered = allPossible.filter((c) => c !== targetChapter);
      const distractors = filtered.sort(() => Math.random() - 0.5).slice(0, 3);
      const allOpts = [...distractors, targetChapter].sort(() => Math.random() - 0.5);
      correctIndex = allOpts.indexOf(targetChapter);
      options = allOpts;
    }

    setCurrentQuestion({
      item: target,
      mode,
      questionText,
      options,
      correctIndex,
      hint: target.description,
    });
    setSelectedOption(null);
    setHasAnswered(false);
    setRevealed(false);
  }, [allCosmetics]);

  useEffect(() => {
    if (allCosmetics.length > 0 && !currentQuestion) {
      generateQuestion();
    }
  }, [allCosmetics, currentQuestion, generateQuestion]);

  const handleSelectOption = (index: number) => {
    if (hasAnswered || !currentQuestion) return;

    setSelectedOption(index);
    setHasAnswered(true);
    setRevealed(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      soundFX.playSuccess();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
        try {
          localStorage.setItem(BEST_STREAK_KEY, nextStreak.toString());
        } catch {
          // Ignore
        }
      }
      if (nextStreak % 5 === 0) {
        soundFX.playVictory();
      }
    } else {
      soundFX.playFail();
      setStreak(0);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-3" />
        <p className="text-slate-400 text-sm">Loading quiz questions from cosmetic catalog...</p>
      </div>
    );
  }

  const { item, questionText, options, correctIndex, hint } = currentQuestion;
  const imageSrc = item.images.featured || item.images.icon || item.images.smallIcon;
  const rarity = getRarityStyle(item);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>Fortnite Trivia Challenge</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
            Guess the Cosmetic
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test your Battle Royale skin knowledge and build your winning streak!
          </p>
        </div>

        {/* Score & Streak Trackers */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-blue-500/30">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Streak</span>
              <span className="font-mono font-black text-base text-white tabular-nums">{streak}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <Trophy className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Best</span>
              <span className="font-mono font-black text-base text-blue-300 tabular-nums">{bestStreak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: rarity.glowColor }}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Visual Showcase / Silhouette */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[280px] aspect-square rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-center p-4 overflow-hidden group shadow-inner">
              {/* Silhouette toggle */}
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Quiz Target"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-contain transition-all duration-500 ${
                    !revealed && currentQuestion.mode === 'silhouette'
                      ? 'brightness-0 contrast-200 drop-shadow-[0_10px_20px_rgba(37,99,235,0.3)]'
                      : 'brightness-100 drop-shadow-2xl scale-105'
                  }`}
                />
              ) : (
                <HelpCircle className="w-16 h-16 text-slate-600 animate-pulse" />
              )}

              {/* Mystery Badge if unrevealed */}
              {!revealed && currentQuestion.mode === 'silhouette' && (
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-blue-300 uppercase tracking-widest backdrop-blur-sm">
                  CLASSIFIED
                </div>
              )}

              {/* Revealed Rarity Badge */}
              {revealed && (
                <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${rarity.badgeBg} ${rarity.badgeText}`}>
                  {rarity.label}
                </div>
              )}
            </div>

            {revealed && (
              <div className="mt-3 text-center animate-in fade-in">
                <span className="font-heading font-black text-base text-white uppercase block">
                  {item.name}
                </span>
                <span className="text-xs text-slate-400">
                  {item.set?.value ? `Part of the ${item.set.value} Set` : item.type?.displayValue || 'Cosmetic'}
                </span>
              </div>
            )}
          </div>

          {/* Options & Question Column */}
          <div className="md:col-span-7 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-blue-400 tracking-wider mb-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>Question</span>
              </div>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
                {questionText}
              </h3>
              {hint && !revealed && (
                <p className="text-xs text-slate-400 italic mt-2 border-l-2 border-blue-500/40 pl-2">
                  Hint: "{hint}"
                </p>
              )}
            </div>

            {/* Answer Option Buttons */}
            <div className="grid grid-cols-1 gap-2.5">
              {options.map((opt, idx) => {
                let btnStyle = 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-blue-500/50';

                if (hasAnswered) {
                  if (idx === correctIndex) {
                    btnStyle = 'bg-emerald-950/80 text-emerald-200 border-emerald-500 ring-1 ring-emerald-500 font-bold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-950/80 text-rose-200 border-rose-500 ring-1 ring-rose-500 font-bold';
                  } else {
                    btnStyle = 'bg-slate-950/40 text-slate-500 border-slate-900 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-slate-400 font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </span>

                    {hasAnswered && idx === correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {hasAnswered && idx === selectedOption && idx !== correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Post-Answer Action Bar */}
            {hasAnswered && (
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80 animate-in fade-in">
                <button
                  onClick={() => onInspectItem(item)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>Inspect Skin Details</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    generateQuestion();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-102"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
