/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FilterParams } from '../services/fortniteApi';
import { Search, X, SlidersHorizontal, Layers, Sparkles, Heart, Box } from 'lucide-react';
import { soundFX } from '../utils/rarity';

interface FilterBarProps {
  params: FilterParams;
  onChange: (params: FilterParams) => void;
  totalFiltered: number;
  totalTotal: number;
  wishlistCount?: number;
  ownedCount?: number;
}

const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'outfit', label: 'Outfits & Skins' },
  { id: 'backpack', label: 'Back Blings' },
  { id: 'pickaxe', label: 'Pickaxes' },
  { id: 'glider', label: 'Gliders' },
  { id: 'emote', label: 'Emotes & Dances' },
  { id: 'wrap', label: 'Wraps' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'music', label: 'Music Packs' },
  { id: 'contrail', label: 'Contrails' },
];

const RARITIES = [
  { id: 'all', label: 'All Rarities & Series' },
  { id: 'marvel', label: 'Marvel Series' },
  { id: 'starwars', label: 'Star Wars Series' },
  { id: 'gaming', label: 'Gaming Legends' },
  { id: 'icon', label: 'Icon Series' },
  { id: 'dc', label: 'DC Series' },
  { id: 'special', label: 'Any Special Series' },
  { id: 'mythic', label: 'Mythic' },
  { id: 'legendary', label: 'Legendary' },
  { id: 'epic', label: 'Epic' },
  { id: 'rare', label: 'Rare' },
  { id: 'uncommon', label: 'Uncommon' },
  { id: 'common', label: 'Common' },
];

const CHAPTERS = [
  { id: 'all', label: 'All Chapters' },
  { id: '1', label: 'Chapter 1 (OG)' },
  { id: '2', label: 'Chapter 2' },
  { id: '3', label: 'Chapter 3' },
  { id: '4', label: 'Chapter 4' },
  { id: '5', label: 'Chapter 5' },
  { id: '6', label: 'Chapter 6' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  params,
  onChange,
  totalFiltered,
  totalTotal,
  wishlistCount = 0,
  ownedCount = 0,
}) => {
  const update = (partial: Partial<FilterParams>) => {
    soundFX.playClick();
    onChange({ ...params, ...partial });
  };

  const collection = params.collectionFilter || 'all';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md mb-8">
      {/* Top Row: Search + Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-4">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={params.searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
            placeholder="Search by skin name, set, or character..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {params.searchQuery && (
            <button
              onClick={() => update({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Rarity & Series Selector */}
        <div className="lg:col-span-3">
          <div className="relative">
            <select
              value={params.rarityOrSeries}
              onChange={(e) => update({ rarityOrSeries: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
            >
              {RARITIES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Chapter Selector */}
        <div className="lg:col-span-2">
          <div className="relative">
            <select
              value={params.chapter}
              onChange={(e) => update({ chapter: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
            >
              {CHAPTERS.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.label}
                </option>
              ))}
            </select>
            <Layers className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sort Selector */}
        <div className="lg:col-span-3">
          <select
            value={params.sortBy}
            onChange={(e) => update({ sortBy: e.target.value as FilterParams['sortBy'] })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="newest">Sort: Newest Added</option>
            <option value="oldest">Sort: Oldest / OG First</option>
            <option value="rarity">Sort: Highest Rarity</option>
            <option value="alpha-asc">Sort: Name (A-Z)</option>
            <option value="alpha-desc">Sort: Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Middle Row: Category Buttons (Segmented Controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = params.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => update({ category: cat.id })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                  : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Collection Filters + Variant Toggle + Results Counter */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Collection Segment */}
          <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            <button
              onClick={() => update({ collectionFilter: 'all' })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                collection === 'all'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => update({ collectionFilter: 'wishlist' })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                collection === 'wishlist'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${collection === 'wishlist' ? 'text-white fill-current' : 'text-rose-400'}`} />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="font-mono text-[10px] px-1 rounded bg-black/30 font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => update({ collectionFilter: 'owned' })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                collection === 'owned'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-blue-400" />
              <span>Locker Items</span>
              {ownedCount > 0 && (
                <span className="font-mono text-[10px] px-1 rounded bg-black/30 font-bold">
                  {ownedCount}
                </span>
              )}
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none group ml-1">
            <input
              type="checkbox"
              checked={!!params.hasVariantsOnly}
              onChange={(e) => update({ hasVariantsOnly: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            <span className="text-slate-300 group-hover:text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Variants
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>
            Showing <strong className="text-white font-mono tabular-nums">{totalFiltered.toLocaleString()}</strong> of <span className="font-mono tabular-nums">{totalTotal.toLocaleString()}</span> cosmetics
          </span>
          {(params.searchQuery || params.category !== 'all' || params.rarityOrSeries !== 'all' || params.chapter !== 'all' || params.hasVariantsOnly || params.collectionFilter !== 'all') && (
            <>
              <span aria-hidden="true">·</span>
              <button
                onClick={() =>
                  onChange({
                    category: 'all',
                    rarityOrSeries: 'all',
                    chapter: 'all',
                    searchQuery: '',
                    sortBy: 'newest',
                    hasVariantsOnly: false,
                    collectionFilter: 'all',
                  })
                }
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                Reset Filters
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
