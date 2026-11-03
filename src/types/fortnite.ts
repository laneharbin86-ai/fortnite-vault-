/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CosmeticType {
  value: string;
  displayValue: string;
  backendValue: string;
}

export interface CosmeticRarity {
  value: string;
  displayValue: string;
  backendValue: string;
}

export interface CosmeticSeries {
  value: string;
  colors?: string[];
  backendValue?: string;
}

export interface CosmeticSet {
  value: string;
  text: string;
  backendValue?: string;
}

export interface CosmeticIntroduction {
  chapter: string;
  season: string;
  text: string;
  backendValue?: number;
}

export interface CosmeticImages {
  smallIcon?: string;
  icon?: string;
  featured?: string;
  other?: Record<string, string>;
}

export interface VariantOption {
  tag: string;
  name: string;
  image?: string;
}

export interface CosmeticVariant {
  channel: string;
  type: string;
  options: VariantOption[];
}

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  type: CosmeticType;
  rarity: CosmeticRarity;
  series?: CosmeticSeries;
  set?: CosmeticSet;
  introduction?: CosmeticIntroduction;
  images: CosmeticImages;
  variants?: CosmeticVariant[];
  showcaseVideo?: string;
  added?: string;
}

export interface ShopEntry {
  regularPrice: number;
  finalPrice: number;
  devName?: string;
  offerId?: string;
  inDate?: string;
  outDate?: string;
  bundle?: {
    name: string;
    info: string;
    image: string;
  };
  banner?: {
    value: string;
    intensity: string;
    backendValue: string;
  };
  section?: {
    id: string;
    name: string;
    landingPriority: number;
  };
  brItems?: CosmeticItem[];
  items?: CosmeticItem[];
}

export interface ShopData {
  hash?: string;
  date?: string;
  vbuckIcon?: string;
  entries: ShopEntry[];
}

export interface LockerPreset {
  id: string;
  name: string;
  outfit?: CosmeticItem | null;
  backpack?: CosmeticItem | null;
  pickaxe?: CosmeticItem | null;
  glider?: CosmeticItem | null;
  shoes?: CosmeticItem | null;
  wrap?: CosmeticItem | null;
  emotes?: (CosmeticItem | null)[];
}

export interface MapPOI {
  id: string;
  name: string;
  location: {
    x: number;
    y: number;
    z: number;
  };
}

export interface MapData {
  images: {
    blank: string;
    pois: string;
  };
  pois: MapPOI[];
}

export interface MOTDItem {
  id: string;
  title: string;
  tabTitle?: string;
  body: string;
  image: string;
  tileImage?: string;
  sortingPriority?: number;
  hidden?: boolean;
}

export interface NewsData {
  hash: string;
  date: string;
  image?: string;
  motds: MOTDItem[];
}

export type ViewTab = 'catalog' | 'shop' | 'map' | 'news' | 'compare' | 'quiz' | 'locker' | 'roulette';
