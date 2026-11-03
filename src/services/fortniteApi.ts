/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CosmeticItem, ShopData } from '../types/fortnite';
import { STARTER_COSMETICS } from './starterCosmetics';

const DB_NAME = 'fortnite_vault_db';
const STORE_NAME = 'cosmetics_store';
const CACHE_KEY = 'all_cosmetics_v2';
const TIMESTAMP_KEY = 'all_cosmetics_timestamp';
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

// IndexedDB Helper for high-volume 16k items cache
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getCachedCosmetics(): Promise<CosmeticItem[] | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(CACHE_KEY);
      const timeReq = store.get(TIMESTAMP_KEY);

      let data: CosmeticItem[] | null = null;
      let timestamp = 0;

      req.onsuccess = () => {
        data = req.result || null;
      };

      timeReq.onsuccess = () => {
        timestamp = timeReq.result || 0;
      };

      tx.oncomplete = () => {
        if (data && timestamp && Date.now() - timestamp < CACHE_TTL_MS) {
          resolve(data);
        } else {
          resolve(null);
        }
      };
      tx.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function setCachedCosmetics(items: CosmeticItem[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(items, CACHE_KEY);
    store.put(Date.now(), TIMESTAMP_KEY);
  } catch {
    // Ignore cache failure
  }
}

export interface FetchOptions {
  forceRefresh?: boolean;
  onProgress?: (msg: string) => void;
}

export async function fetchAllCosmetics(options?: FetchOptions): Promise<CosmeticItem[]> {
  const onProgress = options?.onProgress;

  if (!options?.forceRefresh) {
    onProgress?.('Checking cached catalog...');
    const cached = await getCachedCosmetics();
    if (cached && cached.length > 0) {
      onProgress?.(`Loaded ${cached.length.toLocaleString()} cosmetics from cache`);
      return cached;
    }
  }

  onProgress?.('Fetching live cosmetics from Fortnite API...');
  try {
    const res = await fetch('https://fortnite-api.com/v2/cosmetics/br', {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    onProgress?.('Processing cosmetic archives...');
    const json = await res.json();
    if (json.status === 200 && Array.isArray(json.data)) {
      const cosmetics: CosmeticItem[] = json.data;
      onProgress?.(`Saving ${cosmetics.length.toLocaleString()} cosmetics to local storage...`);
      // Fire and forget cache saving
      setCachedCosmetics(cosmetics);
      return cosmetics;
    }
  } catch (err) {
    console.warn('Live API fetch failed, falling back to starter data or cache:', err);
    const cached = await getCachedCosmetics();
    if (cached && cached.length > 0) {
      return cached;
    }
  }

  return STARTER_COSMETICS;
}

export async function fetchLiveItemShop(): Promise<ShopData | null> {
  try {
    const res = await fetch('https://fortnite-api.com/v2/shop');
    if (!res.ok) {
      throw new Error(`Shop API returned ${res.status}`);
    }
    const json = await res.json();
    if (json.status === 200 && json.data) {
      return json.data as ShopData;
    }
    return null;
  } catch (err) {
    console.error('Failed to load live Item Shop:', err);
    return null;
  }
}

// -------------------------------------------------------------
// Minimap API Integration
// -------------------------------------------------------------
export async function fetchFortniteMap(): Promise<import('../types/fortnite').MapData | null> {
  try {
    const res = await fetch('https://fortnite-api.com/v1/map');
    if (!res.ok) {
      throw new Error(`Map API returned ${res.status}`);
    }
    const json = await res.json();
    if (json.status === 200 && json.data) {
      return json.data as import('../types/fortnite').MapData;
    }
    return null;
  } catch (err) {
    console.error('Failed to load Fortnite map:', err);
    return null;
  }
}

// -------------------------------------------------------------
// Fortnite Battle Royale In-Game News & MOTDs
// -------------------------------------------------------------
export async function fetchFortniteNews(): Promise<import('../types/fortnite').NewsData | null> {
  try {
    const res = await fetch('https://fortnite-api.com/v2/news/br');
    if (!res.ok) {
      throw new Error(`News API returned ${res.status}`);
    }
    const json = await res.json();
    if (json.status === 200 && json.data) {
      return json.data as import('../types/fortnite').NewsData;
    }
    return null;
  } catch (err) {
    console.error('Failed to load Fortnite news:', err);
    return null;
  }
}

// Helpers for filtering and sorting
export interface FilterParams {
  category: string; // 'all' | 'outfit' | 'backpack' | 'pickaxe' | 'glider' | 'emote' | 'wrap' | 'shoes' | 'music' | 'loading'
  rarityOrSeries: string; // 'all' | 'legendary' | 'epic' | 'rare' | 'marvel' | 'starwars' | 'icon' | 'gaming' etc.
  chapter: string; // 'all' | '1' | '2' | '3' | '4' | '5' | '6'
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc' | 'rarity';
  hasVariantsOnly?: boolean;
  collectionFilter?: 'all' | 'wishlist' | 'owned';
}

const RARITY_WEIGHTS: Record<string, number> = {
  mythic: 100,
  legendary: 90,
  marvel: 85,
  starwars: 85,
  gaminglegends: 85,
  dc: 85,
  icon: 80,
  lava: 80,
  frozen: 80,
  slurp: 80,
  dark: 80,
  shadow: 80,
  epic: 70,
  rare: 50,
  uncommon: 30,
  common: 10,
};

export function filterAndSortCosmetics(
  items: CosmeticItem[],
  params: FilterParams,
  extra?: { wishlistIds?: Set<string>; ownedIds?: Set<string> }
): CosmeticItem[] {
  const query = params.searchQuery.trim().toLowerCase();
  const cat = params.category.toLowerCase();
  const rarityFilter = params.rarityOrSeries.toLowerCase();
  const chapter = params.chapter;
  const hasVariantsOnly = params.hasVariantsOnly;

  return items
    .filter((item) => {
      // 1. Category Filter
      if (cat !== 'all') {
        const itemType = (item.type?.value || item.type?.displayValue || '').toLowerCase();
        if (cat === 'outfit' || cat === 'skin') {
          if (!itemType.includes('outfit') && !itemType.includes('character')) return false;
        } else if (cat === 'backpack' || cat === 'back bling') {
          if (!itemType.includes('backpack') && !itemType.includes('back bling') && !itemType.includes('pet')) return false;
        } else if (cat === 'pickaxe') {
          if (!itemType.includes('pickaxe')) return false;
        } else if (cat === 'glider') {
          if (!itemType.includes('glider') && !itemType.includes('umbrella')) return false;
        } else if (cat === 'emote') {
          if (!itemType.includes('emote') && !itemType.includes('dance')) return false;
        } else if (cat === 'wrap') {
          if (!itemType.includes('wrap')) return false;
        } else if (cat === 'shoes') {
          if (!itemType.includes('shoe')) return false;
        } else if (cat === 'music') {
          if (!itemType.includes('music')) return false;
        } else if (cat === 'contrail') {
          if (!itemType.includes('contrail')) return false;
        } else if (cat === 'loading') {
          if (!itemType.includes('loading')) return false;
        }
      }

      // 2. Rarity / Series Filter
      if (rarityFilter !== 'all') {
        const itemRarity = (item.rarity?.value || item.rarity?.displayValue || '').toLowerCase();
        const itemSeries = (item.series?.value || '').toLowerCase();

        if (rarityFilter === 'marvel') {
          if (!itemSeries.includes('marvel')) return false;
        } else if (rarityFilter === 'starwars') {
          if (!itemSeries.includes('star wars') && !itemSeries.includes('starwars')) return false;
        } else if (rarityFilter === 'gaming') {
          if (!itemSeries.includes('gaming') && !itemSeries.includes('platform')) return false;
        } else if (rarityFilter === 'dc') {
          if (!itemSeries.includes('dc')) return false;
        } else if (rarityFilter === 'icon') {
          if (!itemSeries.includes('icon')) return false;
        } else if (rarityFilter === 'special') {
          if (!item.series?.value) return false;
        } else {
          if (!itemRarity.includes(rarityFilter)) return false;
        }
      }

      // 3. Chapter Filter
      if (chapter !== 'all') {
        const introChapter = item.introduction?.chapter;
        if (introChapter !== chapter) return false;
      }

      // 4. Variants Only
      if (hasVariantsOnly) {
        if (!item.variants || item.variants.length === 0) return false;
      }

      // 5. Collection Filter (Wishlist or Owned)
      if (params.collectionFilter === 'wishlist') {
        if (!extra?.wishlistIds?.has(item.id)) return false;
      } else if (params.collectionFilter === 'owned') {
        if (!extra?.ownedIds?.has(item.id)) return false;
      }

      // 6. Search Query
      if (query) {
        const nameMatch = item.name.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const setMatch = item.set?.value?.toLowerCase().includes(query) || item.set?.text?.toLowerCase().includes(query);
        const idMatch = item.id.toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !setMatch && !idMatch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (params.sortBy === 'alpha-asc') {
        return a.name.localeCompare(b.name);
      }
      if (params.sortBy === 'alpha-desc') {
        return b.name.localeCompare(a.name);
      }
      if (params.sortBy === 'rarity') {
        const weightA = RARITY_WEIGHTS[a.rarity?.value?.toLowerCase() || ''] || (a.series ? 80 : 20);
        const weightB = RARITY_WEIGHTS[b.rarity?.value?.toLowerCase() || ''] || (b.series ? 80 : 20);
        return weightB - weightA;
      }
      if (params.sortBy === 'oldest') {
        const dateA = a.added ? new Date(a.added).getTime() : 0;
        const dateB = b.added ? new Date(b.added).getTime() : 0;
        return dateA - dateB;
      }
      // default: newest
      const dateA = a.added ? new Date(a.added).getTime() : 0;
      const dateB = b.added ? new Date(b.added).getTime() : 0;
      return dateB - dateA;
    });
}
