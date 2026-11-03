/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CosmeticItem } from '../types/fortnite';
import { getRarityStyle, soundFX } from '../utils/rarity';
import { Swords, Search, X, Sparkles, Box, Calendar, Layers, Tag, Eye } from 'lucide-react';

interface CosmeticComparisonViewProps {
  allCosmetics: CosmeticItem[];
  onInspectItem: (item: CosmeticItem) => void;
  onEquipItem: (item: CosmeticItem) => void;
}

export const CosmeticComparisonView: React.FC<CosmeticComparisonViewProps> = ({
  allCosmetics,
  onInspectItem,
  onEquipItem,
}) => {
  // Pre-seed with iconic match: Solid Snake vs Midas (or first two items)
  const [itemA, setItemA] = useState<CosmeticItem | null>(() => {
    return allCosmetics.find((c) => c.id.includes('AbstractMirror') || c.name.toLowerCase().includes('snake')) || allCosmetics[0] || null;
  });
  const [itemB, setItemB] = useState<CosmeticItem | null>(() => {
    return allCosmetics.find((c) => c.name.toLowerCase().includes('midas') || c.name.toLowerCase().includes('peely')) || allCosmetics[1] || null;
  });

  const [searchModalSide, setSearchModalSide] = useState<'A' | 'B' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRandomMatchup = () => {
    soundFX.playEquip();
    const outfits = allCosmetics.filter((c) => (c.type?.value || '').includes('outfit'));
    if (outfits.length >= 2) {
      const idxA = Math.floor(Math.random() * outfits.length);
      let idxB = Math.floor(Math.random() * outfits.length);
      while (idxB === idxA) idxB = Math.floor(Math.random() * outfits.length);
      setItemA(outfits[idxA]);
      setItemB(outfits[idxB]);
    }
  };

  const styleA = itemA ? getRarityStyle(itemA) : null;
  const styleB = itemB ? getRarityStyle(itemB) : null;

  const getAgeDays = (dateStr?: string) => {
    if (!dateStr) return null;
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const filteredSearchList = allCosmetics
    .filter((c) => c.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    .slice(0, 30);

  const renderSideCard = (item: CosmeticItem | null, side: 'A' | 'B') => {
    const style = item ? getRarityStyle(item) : null;
    const imageUrl = item ? item.images.featured || item.images.icon || item.images.smallIcon : null;
    const variantCount = item?.variants?.reduce((sum, v) => sum + (v.options?.length || 0), 0) || 0;

    return (
      <div className="flex-1 flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Selector Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Contender {side}
          </span>
          <button
            onClick={() => {
              soundFX.playClick();
              setSearchQuery('');
              setSearchModalSide(side);
            }}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Change Contender</span>
          </button>
        </div>

        {item && style ? (
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Visual Box */}
            <div className={`relative aspect-square w-full rounded-xl border ${style.cardBorder} bg-gradient-to-b ${style.cardBg} p-4 flex items-center justify-center overflow-hidden shadow-lg`}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform"
                />
              )}
              {variantCount > 0 && (
                <div className="absolute top-3 right-3 bg-blue-950/80 border border-blue-500/40 text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
                  {variantCount} Styles
                </div>
              )}
            </div>

            {/* Title & Set */}
            <div className="text-center">
              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5 ${style.badgeBg} ${style.badgeText}`}>
                {style.label}
              </span>
              <h3 className="font-heading font-black text-2xl text-white uppercase truncate">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {item.set?.value || item.type?.displayValue || 'Cosmetic'}
              </p>
            </div>

            {/* Spec Attributes */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category</span>
                </span>
                <span className="font-semibold text-slate-200">
                  {item.type?.displayValue || item.type?.value}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Introduced</span>
                </span>
                <span className="font-semibold text-slate-200">
                  {item.introduction?.text || (item.introduction?.chapter ? `Ch ${item.introduction.chapter}·S${item.introduction.season}` : 'Unknown')}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Total Styles</span>
                </span>
                <span className="font-semibold text-slate-200">
                  {variantCount > 0 ? `${variantCount} selectable options` : 'Standard default'}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Days in Game</span>
                <span className="font-mono text-slate-200">
                  {getAgeDays(item.added) ? `${getAgeDays(item.added)?.toLocaleString()} days` : 'Original'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  soundFX.playInspect();
                  onInspectItem(item);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Inspect</span>
              </button>
              <button
                onClick={() => {
                  soundFX.playEquip();
                  onEquipItem(item);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all hover:scale-102"
              >
                <Box className="w-3.5 h-3.5" />
                <span>Equip</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <Search className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-xs font-semibold">Select a cosmetic to compare</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600/15 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Swords className="w-4 h-4" />
            <span>Side-by-Side Head-to-Head</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Cosmetic Battle & Comparison
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-lg">
            Compare any two skins or battle gear directly to evaluate styles, release chapters, sets, and rarity tiers.
          </p>
        </div>

        <button
          onClick={handleRandomMatchup}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-105 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Random Matchup</span>
        </button>
      </div>

      {/* 2-Column Contender Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {renderSideCard(itemA, 'A')}

        {/* Center VS Emblem */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950 border-2 border-blue-500 items-center justify-center font-heading font-black text-sm text-white shadow-2xl shadow-blue-500/50">
          VS
        </div>

        {renderSideCard(itemB, 'B')}
      </div>

      {/* Search & Pick Modal */}
      {searchModalSide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-white">
                Select Contender {searchModalSide}
              </h3>
              <button
                onClick={() => setSearchModalSide(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skins, pickaxes, gliders..."
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {filteredSearchList.map((item) => {
                const style = getRarityStyle(item);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundFX.playClick();
                      if (searchModalSide === 'A') setItemA(item);
                      if (searchModalSide === 'B') setItemB(item);
                      setSearchModalSide(null);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {item.images.smallIcon && (
                        <img
                          src={item.images.smallIcon}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-contain bg-slate-900 shrink-0"
                        />
                      )}
                      <div className="truncate">
                        <span className="font-heading font-bold text-xs text-white block truncate group-hover:text-blue-400">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {item.set?.value || item.type?.displayValue}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.badgeBg} ${style.badgeText} shrink-0`}>
                      {style.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
