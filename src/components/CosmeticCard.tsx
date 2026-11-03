/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { CosmeticItem } from '../types/fortnite';
import { getRarityStyle, soundFX } from '../utils/rarity';
import { Sparkles, Eye, Plus, Check, Heart } from 'lucide-react';

interface CosmeticCardProps {
  item: CosmeticItem;
  onInspect: (item: CosmeticItem) => void;
  onEquip?: (item: CosmeticItem) => void;
  isEquipped?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: (item: CosmeticItem) => void;
}

export const CosmeticCard: React.FC<CosmeticCardProps> = ({
  item,
  onInspect,
  onEquip,
  isEquipped = false,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [imgError, setImgError] = useState(false);
  const [tilt, setTilt] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rarityStyle = getRarityStyle(item);

  const imageUrl =
    (!imgError && (item.images.featured || item.images.icon || item.images.smallIcon)) || null;

  const variantCount = item.variants?.reduce((sum, v) => sum + (v.options?.length || 0), 0) || 0;

  const handleCardClick = () => {
    soundFX.playInspect();
    onInspect(item);
  };

  const handleEquipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playEquip();
    onEquip?.(item);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playClick();
    onToggleWishlist?.(item);
  };

  // 3D Parallax tilt effect on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt(null);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-xl border ${rarityStyle.cardBorder} bg-gradient-to-b ${rarityStyle.cardBg} p-3 transition-all duration-150 cursor-pointer flex flex-col justify-between overflow-hidden select-none`}
      style={{
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        transform: tilt
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)',
      }}
    >
      {/* Top Header metadata */}
      <div className="flex items-center justify-between gap-1.5 z-10 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors truncate">
          {item.type?.displayValue || item.type?.value || 'Cosmetic'}
        </span>

        <div className="flex items-center gap-1">
          {variantCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-300 bg-blue-950/60 border border-blue-500/40 px-1.5 py-0.5 rounded">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{variantCount} Styles</span>
            </span>
          )}

          {isWishlisted && (
            <span className="text-rose-400 p-0.5" title="In Wishlist">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            </span>
          )}
        </div>
      </div>

      {/* Main Image Showcase */}
      <div className="relative aspect-square w-full flex items-center justify-center rounded-lg bg-black/20 p-2 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)] group-hover:scale-108 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-2 text-center">
            <span className="text-2xl font-black mb-1 opacity-40">FN</span>
            <span className="text-xs font-medium line-clamp-1">{item.name}</span>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
          <button
            onClick={handleCardClick}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-bold shadow-lg transition-transform hover:scale-105"
            title="Inspect Details & Styles"
          >
            <Eye className="w-4 h-4" />
          </button>

          {onToggleWishlist && (
            <button
              onClick={handleWishlistClick}
              className={`p-2 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 ${
                isWishlisted
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          )}

          {onEquip && (
            <button
              onClick={handleEquipClick}
              className={`p-2 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 ${
                isEquipped
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title={isEquipped ? 'Equipped in Locker' : 'Equip to Locker'}
            >
              {isEquipped ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Item Information Footer */}
      <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-col z-10">
        <h3 className="font-heading font-bold text-sm sm:text-base text-white tracking-wide truncate group-hover:text-blue-300 transition-colors">
          {item.name}
        </h3>

        <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 mt-0.5">
          <span className="truncate">{item.set?.value || rarityStyle.label}</span>
          {item.introduction?.chapter && (
            <span className="shrink-0 text-slate-500 font-mono text-[10px]">
              Ch {item.introduction.chapter}·S{item.introduction.season}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
