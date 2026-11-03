/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CosmeticItem, ViewTab, LockerPreset } from './types/fortnite';
import { fetchAllCosmetics, filterAndSortCosmetics, FilterParams } from './services/fortniteApi';
import { STARTER_COSMETICS } from './services/starterCosmetics';
import { soundFX } from './utils/rarity';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { CosmeticCard } from './components/CosmeticCard';
import { CosmeticDetailModal } from './components/CosmeticDetailModal';
import { ItemShopView } from './components/ItemShopView';
import { MinimapView } from './components/MinimapView';
import { LockerBuilder } from './components/LockerBuilder';
import { DropRoulette } from './components/DropRoulette';
import { FortniteNewsView } from './components/FortniteNewsView';
import { CosmeticComparisonView } from './components/CosmeticComparisonView';
import { CosmeticQuizView } from './components/CosmeticQuizView';
import { SetShowcaseModal } from './components/SetShowcaseModal';
import { Sparkles, ArrowDownCircle, RefreshCw, Flame } from 'lucide-react';

const PAGE_BATCH_SIZE = 60;
const ACTIVE_PRESET_KEY = 'fortnite_vault_active_preset_v1';
const WISHLIST_KEY = 'fortnite_vault_wishlist_v1';

export default function App() {
  const [allCosmetics, setAllCosmetics] = useState<CosmeticItem[]>(STARTER_COSMETICS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<string>('Initializing archive...');
  const [currentTab, setCurrentTab] = useState<ViewTab>('catalog');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [inspectedItem, setInspectedItem] = useState<CosmeticItem | null>(null);
  const [activeSetShowcase, setActiveSetShowcase] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_BATCH_SIZE);

  // Active equipped items tracking
  const [equippedIds, setEquippedIds] = useState<Set<string>>(new Set());

  // Wishlist items tracking
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
    return new Set<string>();
  });

  // Filter state
  const [filterParams, setFilterParams] = useState<FilterParams>({
    category: 'all',
    rarityOrSeries: 'all',
    chapter: 'all',
    searchQuery: '',
    sortBy: 'newest',
    hasVariantsOnly: false,
    collectionFilter: 'all',
  });

  // Load active preset IDs for card badge sync
  const refreshEquippedIds = useCallback(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_PRESET_KEY);
      if (saved) {
        const preset: LockerPreset = JSON.parse(saved);
        const ids = new Set<string>();
        if (preset.outfit?.id) ids.add(preset.outfit.id);
        if (preset.backpack?.id) ids.add(preset.backpack.id);
        if (preset.pickaxe?.id) ids.add(preset.pickaxe.id);
        if (preset.glider?.id) ids.add(preset.glider.id);
        if (preset.shoes?.id) ids.add(preset.shoes.id);
        if (preset.wrap?.id) ids.add(preset.wrap.id);
        preset.emotes?.forEach((e) => {
          if (e?.id) ids.add(e.id);
        });
        setEquippedIds(ids);
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  const loadData = useCallback(async (force = false) => {
    setIsLoading(true);
    try {
      const data = await fetchAllCosmetics({
        forceRefresh: force,
        onProgress: (msg) => setLoadingProgress(msg),
      });
      if (data && data.length > 0) {
        setAllCosmetics(data);
      }
    } catch (err) {
      console.error('Error fetching cosmetics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    refreshEquippedIds();
  }, [loadData, refreshEquippedIds]);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playClick();
  };

  const handleToggleWishlist = (item: CosmeticItem) => {
    soundFX.playClick();
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  // Filter and sort memoization
  const filteredCosmetics = useMemo(() => {
    return filterAndSortCosmetics(allCosmetics, filterParams, {
      wishlistIds,
      ownedIds: equippedIds,
    });
  }, [allCosmetics, filterParams, wishlistIds, equippedIds]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(PAGE_BATCH_SIZE);
  }, [filterParams]);

  // Handle Equipping from card or modal
  const handleEquipItem = (item: CosmeticItem) => {
    try {
      let preset: LockerPreset = {
        id: 'default',
        name: 'Primary Locker',
        outfit: null,
        backpack: null,
        pickaxe: null,
        glider: null,
        shoes: null,
        wrap: null,
        emotes: [null, null, null, null, null, null],
      };

      const saved = localStorage.getItem(ACTIVE_PRESET_KEY);
      if (saved) {
        preset = JSON.parse(saved);
      }

      const itemType = (item.type?.value || item.type?.displayValue || '').toLowerCase();

      if (itemType.includes('outfit') || itemType.includes('character')) {
        preset.outfit = item;
      } else if (itemType.includes('backpack') || itemType.includes('back bling') || itemType.includes('pet')) {
        preset.backpack = item;
      } else if (itemType.includes('pickaxe')) {
        preset.pickaxe = item;
      } else if (itemType.includes('glider') || itemType.includes('umbrella')) {
        preset.glider = item;
      } else if (itemType.includes('shoe')) {
        preset.shoes = item;
      } else if (itemType.includes('wrap')) {
        preset.wrap = item;
      } else if (itemType.includes('emote') || itemType.includes('dance')) {
        const emotes = preset.emotes || [null, null, null, null, null, null];
        const emptyIdx = emotes.findIndex((e) => e === null);
        if (emptyIdx !== -1) {
          emotes[emptyIdx] = item;
        } else {
          emotes[0] = item;
        }
        preset.emotes = emotes;
      } else {
        preset.outfit = item;
      }

      localStorage.setItem(ACTIVE_PRESET_KEY, JSON.stringify(preset));
      refreshEquippedIds();
    } catch {
      // Ignore storage error
    }
  };

  // 1-Click Equip entire Matching Set
  const handleEquipFullSet = (items: CosmeticItem[]) => {
    try {
      let preset: LockerPreset = {
        id: 'default',
        name: 'Primary Locker',
        outfit: null,
        backpack: null,
        pickaxe: null,
        glider: null,
        shoes: null,
        wrap: null,
        emotes: [null, null, null, null, null, null],
      };

      const saved = localStorage.getItem(ACTIVE_PRESET_KEY);
      if (saved) {
        preset = JSON.parse(saved);
      }

      items.forEach((item) => {
        const itemType = (item.type?.value || item.type?.displayValue || '').toLowerCase();
        if (itemType.includes('outfit') || itemType.includes('character')) {
          preset.outfit = item;
        } else if (itemType.includes('backpack') || itemType.includes('back bling') || itemType.includes('pet')) {
          preset.backpack = item;
        } else if (itemType.includes('pickaxe')) {
          preset.pickaxe = item;
        } else if (itemType.includes('glider') || itemType.includes('umbrella')) {
          preset.glider = item;
        } else if (itemType.includes('shoe')) {
          preset.shoes = item;
        } else if (itemType.includes('wrap')) {
          preset.wrap = item;
        } else if (itemType.includes('emote') || itemType.includes('dance')) {
          const emotes = preset.emotes || [null, null, null, null, null, null];
          const emptyIdx = emotes.findIndex((e) => e === null);
          if (emptyIdx !== -1) {
            emotes[emptyIdx] = item;
          } else {
            emotes[0] = item;
          }
          preset.emotes = emotes;
        }
      });

      localStorage.setItem(ACTIVE_PRESET_KEY, JSON.stringify(preset));
      refreshEquippedIds();
      soundFX.playEquip();
    } catch {
      // Ignore
    }
  };

  const handleFilterBySet = (setName: string) => {
    setCurrentTab('catalog');
    setFilterParams((prev) => ({
      ...prev,
      category: 'all',
      rarityOrSeries: 'all',
      collectionFilter: 'all',
      searchQuery: setName,
    }));
  };

  const handleOpenCategory = (cat: string) => {
    setCurrentTab('catalog');
    setFilterParams((prev) => ({
      ...prev,
      category: cat,
      collectionFilter: 'all',
      searchQuery: '',
    }));
  };

  const displayedList = filteredCosmetics.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCosmetics.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        totalCosmetics={allCosmetics.length}
        isLoading={isLoading}
        onRefresh={() => loadData(true)}
        audioEnabled={audioEnabled}
        onToggleAudio={toggleAudio}
      />

      {/* Loading banner while catalog synchronizes in background */}
      {isLoading && (
        <div className="bg-blue-500/10 border-b border-blue-500/20 py-2 px-4 text-xs font-medium text-blue-300 flex items-center justify-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{loadingProgress}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'catalog' && (
          <div>
            {/* Hero / Header Intro */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                  <Flame className="w-4 h-4 text-blue-400" />
                  <span>The Complete Battle Royale Archive</span>
                </div>
                <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
                  Fortnite Cosmetic Explorer
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Browse all {allCosmetics.length.toLocaleString()} skins, back blings, pickaxes, gliders, and emotes with 3D renders, selectable edit styles, wishlist curation, and set pairings.
                </p>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    setFilterParams((prev) => ({ ...prev, category: 'outfit', collectionFilter: 'all', searchQuery: '' }))
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold uppercase text-slate-300 hover:text-white border border-slate-800 transition-colors"
                >
                  Skins Only
                </button>
                <button
                  onClick={() =>
                    setFilterParams((prev) => ({ ...prev, rarityOrSeries: 'special', collectionFilter: 'all', searchQuery: '' }))
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold uppercase text-blue-300 hover:text-blue-200 border border-slate-800 transition-colors"
                >
                  Collabs & Series
                </button>
                <button
                  onClick={() =>
                    setFilterParams((prev) => ({ ...prev, chapter: '1', collectionFilter: 'all', searchQuery: '' }))
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold uppercase text-slate-300 hover:text-white border border-slate-800 transition-colors"
                >
                  Chapter 1 OG
                </button>
              </div>
            </div>

            {/* Filter Control Bar */}
            <FilterBar
              params={filterParams}
              onChange={setFilterParams}
              totalFiltered={filteredCosmetics.length}
              totalTotal={allCosmetics.length}
              wishlistCount={wishlistIds.size}
              ownedCount={equippedIds.size}
            />

            {/* Cosmetics Grid */}
            {displayedList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {displayedList.map((item) => (
                  <CosmeticCard
                    key={item.id}
                    item={item}
                    onInspect={(c) => setInspectedItem(c)}
                    onEquip={(c) => handleEquipItem(c)}
                    isEquipped={equippedIds.has(item.id)}
                    isWishlisted={wishlistIds.has(item.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
                <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-xl text-white">No Cosmetics Found</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                  No cosmetics matched your current filters or search term "{filterParams.searchQuery}".
                </p>
                <button
                  onClick={() =>
                    setFilterParams({
                      category: 'all',
                      rarityOrSeries: 'all',
                      chapter: 'all',
                      searchQuery: '',
                      sortBy: 'newest',
                      hasVariantsOnly: false,
                      collectionFilter: 'all',
                    })
                  }
                  className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-500 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Load More Button & Infinite Scroll Trigger */}
            {hasMore && (
              <div className="mt-10 flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setVisibleCount((prev) => prev + PAGE_BATCH_SIZE);
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-extrabold text-sm uppercase tracking-wider border border-slate-800 hover:border-blue-500/50 flex items-center gap-2 shadow-lg transition-all hover:scale-102"
                >
                  <ArrowDownCircle className="w-4 h-4 text-blue-400" />
                  <span>
                    Load More Cosmetics ({Math.min(filteredCosmetics.length - visibleCount, PAGE_BATCH_SIZE).toLocaleString()} more)
                  </span>
                </button>
                <span className="text-xs text-slate-500 font-mono">
                  Showing {visibleCount.toLocaleString()} of {filteredCosmetics.length.toLocaleString()} items
                </span>
              </div>
            )}
          </div>
        )}

        {currentTab === 'shop' && (
          <ItemShopView
            onInspectItem={(item) => setInspectedItem(item)}
            onEquipItem={(item) => handleEquipItem(item)}
          />
        )}

        {currentTab === 'map' && (
          <MinimapView />
        )}

        {currentTab === 'news' && (
          <FortniteNewsView />
        )}

        {currentTab === 'compare' && (
          <CosmeticComparisonView
            allCosmetics={allCosmetics}
            onInspectItem={(item) => setInspectedItem(item)}
            onEquipItem={(item) => handleEquipItem(item)}
          />
        )}

        {currentTab === 'quiz' && (
          <CosmeticQuizView
            allCosmetics={allCosmetics}
            onInspectItem={(item) => setInspectedItem(item)}
          />
        )}

        {currentTab === 'locker' && (
          <LockerBuilder
            allCosmetics={allCosmetics}
            onInspectItem={(item) => setInspectedItem(item)}
            onOpenCategory={handleOpenCategory}
          />
        )}

        {currentTab === 'roulette' && (
          <DropRoulette
            allCosmetics={allCosmetics}
            onInspectItem={(item) => setInspectedItem(item)}
            onEquipItem={(item) => handleEquipItem(item)}
          />
        )}
      </main>

      {/* Inspect Detail Modal */}
      <CosmeticDetailModal
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
        onFilterSet={handleFilterBySet}
        onOpenSetShowcase={(setName) => setActiveSetShowcase(setName)}
        onEquipToLocker={handleEquipItem}
        isWishlisted={inspectedItem ? wishlistIds.has(inspectedItem.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Set Showcase Modal */}
      <SetShowcaseModal
        setName={activeSetShowcase}
        allCosmetics={allCosmetics}
        onClose={() => setActiveSetShowcase(null)}
        onInspectItem={(item) => setInspectedItem(item)}
        onEquipItem={(item) => handleEquipItem(item)}
        onEquipFullSet={(items) => handleEquipFullSet(items)}
      />

      {/* Minimal Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Fortnite Cosmetics Vault · Powered by public Fortnite game assets & APIs.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>{allCosmetics.length.toLocaleString()} Total Cosmetics Indexed</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                soundFX.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-400 transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
