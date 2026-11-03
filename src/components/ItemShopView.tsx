/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { ShopData, ShopEntry, CosmeticItem } from '../types/fortnite';
import { fetchLiveItemShop } from '../services/fortniteApi';
import { getRarityStyle, soundFX } from '../utils/rarity';
import { Clock, RefreshCw, ShoppingBag, Sparkles, Tag, Search, X, Check, Box, Layers, Wallet } from 'lucide-react';

interface ItemShopViewProps {
  onInspectItem: (item: CosmeticItem) => void;
  onEquipItem?: (item: CosmeticItem) => void;
}

export const ItemShopView: React.FC<ItemShopViewProps> = ({
  onInspectItem,
  onEquipItem,
}) => {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under1000' | 'bundles' | 'discounted'>('all');
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const loadShop = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLiveItemShop();
      if (data && data.entries) {
        setShopData(data);
      } else {
        setError('Could not load today’s shop rotation. Please try again.');
      }
    } catch {
      setError('Failed to reach Fortnite shop servers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShop();
  }, []);

  // Countdown timer to midnight UTC (Daily Item Shop Reset)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setUTCHours(24, 0, 0, 0);
      const diffMs = nextReset.getTime() - now.getTime();

      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute Shop Metrics
  const metrics = useMemo(() => {
    if (!shopData?.entries) return { totalVbucks: 0, totalSavings: 0, bundleCount: 0 };
    let totalVbucks = 0;
    let totalSavings = 0;
    let bundleCount = 0;

    shopData.entries.forEach((e) => {
      totalVbucks += e.finalPrice || 0;
      if (e.regularPrice > e.finalPrice) {
        totalSavings += e.regularPrice - e.finalPrice;
      }
      if (e.bundle || (e.brItems && e.brItems.length > 1)) {
        bundleCount += 1;
      }
    });

    return { totalVbucks, totalSavings, bundleCount };
  }, [shopData]);

  // Available unique sections
  const availableSections = useMemo(() => {
    if (!shopData?.entries) return [];
    const counts = new Map<string, number>();
    shopData.entries.forEach((entry) => {
      const sec = entry.section?.name || 'Featured Offers';
      counts.set(sec, (counts.get(sec) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [shopData]);

  // Filtered entries
  const filteredSections = useMemo(() => {
    if (!shopData?.entries) return [];
    const q = searchQuery.toLowerCase().trim();

    const sectionsMap = new Map<string, ShopEntry[]>();

    shopData.entries.forEach((entry) => {
      const primaryItem = entry.brItems?.[0] || entry.items?.[0];
      const title = entry.bundle?.name || primaryItem?.name || entry.devName || '';
      const secName = entry.section?.name || 'Featured Offers';

      // Section filter
      if (selectedSection !== 'all' && secName !== selectedSection) return;

      // Price filter
      if (priceFilter === 'under1000' && entry.finalPrice >= 1000) return;
      if (priceFilter === 'bundles' && !entry.bundle && (!entry.brItems || entry.brItems.length <= 1)) return;
      if (priceFilter === 'discounted' && entry.regularPrice <= entry.finalPrice) return;

      // Search query
      if (q) {
        const matchesTitle = title.toLowerCase().includes(q);
        const matchesSec = secName.toLowerCase().includes(q);
        const matchesDesc = primaryItem?.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSec && !matchesDesc) return;
      }

      if (!sectionsMap.has(secName)) {
        sectionsMap.set(secName, []);
      }
      sectionsMap.get(secName)!.push(entry);
    });

    return Array.from(sectionsMap.entries());
  }, [shopData, searchQuery, selectedSection, priceFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <RefreshCw className="w-10 h-10 text-blue-400 animate-spin mb-4" />
        <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider">
          Connecting to Item Shop...
        </h3>
        <p className="text-sm text-slate-400 mt-1">Fetching live V-Buck offers and today's rotations.</p>
      </div>
    );
  }

  if (error || !shopData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/60 rounded-2xl border border-slate-800 p-8">
        <ShoppingBag className="w-12 h-12 text-slate-500 mb-3" />
        <h3 className="font-heading font-bold text-lg text-white">Item Shop Unavailable</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-md">{error}</p>
        <button
          onClick={loadShop}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const vbuckIcon = shopData.vbuckIcon || 'https://fortnite-api.com/images/vbuck.png';

  return (
    <div className="space-y-6">
      {/* Header Banner with Reset Countdown & Metrics */}
      <div className="bg-gradient-to-r from-blue-600/10 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Official Fortnite Battle Royale Item Shop</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Today's Rotating Offers
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Live prices, featured skin bundles, jam tracks, and emotes updated daily at 00:00 UTC.
          </p>
        </div>

        {/* Countdown & V-Bucks Metrics Box */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950/80 border border-blue-500/30 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg shadow-blue-500/10">
            <Clock className="w-5 h-5 text-blue-400 animate-pulse shrink-0" />
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Resets In (00:00 UTC)
              </div>
              <div className="font-mono font-black text-lg sm:text-xl text-white tracking-widest tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3">
            <Wallet className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Full Shop Value
              </div>
              <div className="font-mono font-black text-lg sm:text-xl text-blue-300 tabular-nums flex items-center gap-1.5">
                <img src={vbuckIcon} alt="V" className="w-4 h-4 object-contain inline" />
                <span>{metrics.totalVbucks.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Shop Filter & Search Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="w-full sm:max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search today's item shop offers..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Price/Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <button
              onClick={() => {
                soundFX.playClick();
                setPriceFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                priceFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Offers ({shopData.entries.length})
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setPriceFilter('under1000');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                priceFilter === 'under1000'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Under 1,000 V-Bucks
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setPriceFilter('bundles');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                priceFilter === 'bundles'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Bundles ({metrics.bundleCount})
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setPriceFilter('discounted');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                priceFilter === 'discounted'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Discounts Only
            </button>
          </div>
        </div>

        {/* Section Jump Tabs */}
        {availableSections.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800/60 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-400" />
              Sections:
            </span>
            <button
              onClick={() => {
                soundFX.playClick();
                setSelectedSection('all');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedSection === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            {availableSections.map((sec) => (
              <button
                key={sec.name}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedSection(sec.name);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap shrink-0 ${
                  selectedSection === sec.name
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{sec.name}</span>
                <span className="font-mono text-[9px] ml-1 opacity-70">({sec.count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sections rendering */}
      {filteredSections.length > 0 ? (
        filteredSections.map(([sectionName, entries]) => (
          <section key={sectionName} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-3">
                <h3 className="font-heading font-black text-xl text-white uppercase tracking-wider">
                  {sectionName}
                </h3>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  ({entries.length})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {entries.map((entry, idx) => {
                const primaryItem = entry.brItems?.[0] || entry.items?.[0];
                const bundleInfo = entry.bundle;
                const title = bundleInfo?.name || primaryItem?.name || entry.devName || 'Special Offer';
                const imageUrl =
                  bundleInfo?.image ||
                  primaryItem?.images.featured ||
                  primaryItem?.images.icon ||
                  primaryItem?.images.smallIcon;

                const rarityStyle = primaryItem ? getRarityStyle(primaryItem) : getRarityStyle({});
                const discount =
                  entry.regularPrice > entry.finalPrice
                    ? entry.regularPrice - entry.finalPrice
                    : 0;

                return (
                  <div
                    key={entry.offerId || `${sectionName}_${idx}`}
                    onClick={() => {
                      if (primaryItem) {
                        soundFX.playInspect();
                        onInspectItem(primaryItem);
                      }
                    }}
                    className={`group relative rounded-2xl border ${rarityStyle.cardBorder} bg-gradient-to-b ${rarityStyle.cardBg} p-3 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer flex flex-col justify-between overflow-hidden`}
                  >
                    {/* Top Badge: Bundle or Items count */}
                    <div className="flex items-center justify-between gap-1 z-10 mb-2">
                      {discount > 0 ? (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                          <Tag className="w-2.5 h-2.5" />
                          <span>Save {discount}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                          {bundleInfo ? 'Bundle' : primaryItem?.type?.displayValue || 'Item'}
                        </span>
                      )}

                      {entry.brItems && entry.brItems.length > 1 && (
                        <span className="text-[10px] font-mono text-blue-300 bg-slate-950/60 px-1.5 py-0.2 rounded">
                          {entry.brItems.length} items
                        </span>
                      )}
                    </div>

                    {/* Image showcase */}
                    <div className="relative aspect-square w-full flex items-center justify-center rounded-xl bg-black/20 p-2 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)] group-hover:scale-108 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                          FN SHOP
                        </div>
                      )}
                    </div>

                    {/* Title & V-Bucks Price */}
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-col z-10">
                      <h4 className="font-heading font-bold text-sm text-white truncate group-hover:text-blue-300 transition-colors">
                        {title}
                      </h4>

                      {/* V-Bucks Price pill */}
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-md px-2 py-0.5">
                          <img
                            src={vbuckIcon}
                            alt="V-Bucks"
                            className="w-3.5 h-3.5 object-contain"
                          />
                          <span className="font-mono font-extrabold text-xs text-blue-300 tabular-nums">
                            {entry.finalPrice.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <span className="text-[10px] text-slate-500 line-through tabular-nums">
                              {entry.regularPrice}
                            </span>
                          )}
                        </div>

                        {entry.banner && (
                          <span className="text-[10px] font-bold uppercase text-blue-400">
                            {entry.banner.value}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-xl text-white">No Offers Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No item shop offers matched your search query "{searchQuery}" in this category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSection('all');
              setPriceFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-500 transition-colors"
          >
            Clear Shop Filters
          </button>
        </div>
      )}
    </div>
  );
};
