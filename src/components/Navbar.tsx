/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ViewTab } from '../types/fortnite';
import { Shield, Sparkles, ShoppingBag, Box, Dices, Volume2, VolumeX, RefreshCw, Compass, Newspaper, Swords, Zap } from 'lucide-react';
import { soundFX } from '../utils/rarity';

interface NavbarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  totalCosmetics: number;
  isLoading: boolean;
  onRefresh: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  totalCosmetics,
  isLoading,
  onRefresh,
  audioEnabled,
  onToggleAudio,
}) => {
  const handleTabClick = (tab: ViewTab) => {
    soundFX.playClick();
    onSelectTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => handleTabClick('catalog')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white uppercase whitespace-nowrap">
              Fortnite <span className="text-blue-400">Vault</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => handleTabClick('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Cosmetics</span>
            {totalCosmetics > 0 && (
              <span className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                currentTab === 'catalog' ? 'bg-slate-950/30 text-blue-100 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {totalCosmetics.toLocaleString()}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('shop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'shop'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span>Item Shop</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Live Now" />
          </button>

          <button
            onClick={() => handleTabClick('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'map'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span>Map</span>
          </button>

          <button
            onClick={() => handleTabClick('news')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'news'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span>News</span>
          </button>

          <button
            onClick={() => handleTabClick('compare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'compare'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Swords className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span>Compare</span>
          </button>

          <button
            onClick={() => handleTabClick('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'quiz'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span>Quiz</span>
          </button>

          <button
            onClick={() => handleTabClick('locker')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'locker'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5 shrink-0" />
            <span>Locker</span>
          </button>

          <button
            onClick={() => handleTabClick('roulette')}
            className={`hidden md:flex px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap shrink-0 items-center gap-1.5 ${
              currentTab === 'roulette'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Dices className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span>Roulette</span>
          </button>
        </nav>

        {/* Zone 3: Audio Toggle & Sync Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleAudio}
            title={audioEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh database"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>
    </header>
  );
};
