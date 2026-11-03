/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CosmeticItem } from '../types/fortnite';
import { getRarityStyle, soundFX } from '../utils/rarity';
import { X, Sparkles, Check, Share2, Layers, Calendar, Tag, ShieldCheck, Box, Download, Heart } from 'lucide-react';

interface CosmeticDetailModalProps {
  item: CosmeticItem | null;
  onClose: () => void;
  onFilterSet?: (setName: string) => void;
  onEquipToLocker?: (item: CosmeticItem, slot?: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (item: CosmeticItem) => void;
  onOpenSetShowcase?: (setName: string) => void;
}

export const CosmeticDetailModal: React.FC<CosmeticDetailModalProps> = ({
  item,
  onClose,
  onFilterSet,
  onEquipToLocker,
  isWishlisted = false,
  onToggleWishlist,
  onOpenSetShowcase,
}) => {
  const [selectedVariantImage, setSelectedVariantImage] = useState<string | null>(null);
  const [activeVariantName, setActiveVariantName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [equippedNotice, setEquippedNotice] = useState(false);

  useEffect(() => {
    setSelectedVariantImage(null);
    setActiveVariantName(null);
    setCopied(false);
    setEquippedNotice(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const rarityStyle = getRarityStyle(item);
  const displayImage =
    selectedVariantImage ||
    item.images.featured ||
    item.images.icon ||
    item.images.smallIcon;

  const handleCopyId = () => {
    soundFX.playClick();
    navigator.clipboard?.writeText(item.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEquip = () => {
    soundFX.playEquip();
    onEquipToLocker?.(item);
    setEquippedNotice(true);
    setTimeout(() => setEquippedNotice(false), 2000);
  };

  const handleSelectVariant = (name: string, image?: string) => {
    soundFX.playClick();
    setActiveVariantName(name);
    if (image) {
      setSelectedVariantImage(image);
    }
  };

  const formattedDate = item.added
    ? new Date(item.added).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const handleDownload = () => {
    soundFX.playClick();
    if (!displayImage) return;
    window.open(displayImage, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-4xl bg-gradient-to-b ${rarityStyle.cardBg} border ${rarityStyle.cardBorder} rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto`}
        style={{
          boxShadow: `0 20px 50px -10px ${rarityStyle.glowColor}`,
        }}
      >
        {/* Top Header Bar */}
        <div className={`px-6 py-4 bg-gradient-to-r ${rarityStyle.headerGradient} flex items-center justify-between border-b border-white/10`}>
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${rarityStyle.badgeBg} ${rarityStyle.badgeText} shadow-sm`}>
              {rarityStyle.label}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {item.type?.displayValue || item.type?.value || 'Cosmetic'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {displayImage && (
              <button
                onClick={handleDownload}
                title="Download PNG Render"
                className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors flex items-center gap-1 text-xs"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">PNG</span>
              </button>
            )}
            {onToggleWishlist && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  onToggleWishlist(item);
                }}
                title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 p-6 gap-6 sm:gap-8 items-center">
          {/* Left Column: Visual Showcase */}
          <div className="md:col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative w-full aspect-square max-h-[380px] flex items-center justify-center p-4 rounded-xl bg-slate-950/40 border border-white/5 overflow-hidden group">
              {/* Subtle background glow */}
              <div
                className="absolute inset-0 opacity-30 blur-2xl rounded-full"
                style={{ background: rarityStyle.glowColor }}
              />

              {displayImage ? (
                <img
                  src={displayImage}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] z-10 transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="text-center p-6 z-10 text-slate-400">
                  <ShieldCheck className="w-16 h-16 mx-auto mb-2 opacity-30 text-blue-400" />
                  <p className="text-sm font-semibold">{item.name}</p>
                </div>
              )}

              {activeVariantName && (
                <div className="absolute bottom-3 left-3 right-3 text-center bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-lg py-1 px-2 text-xs font-medium text-blue-300 z-20">
                  Active Style: {activeVariantName}
                </div>
              )}
            </div>

            {/* If styles exist, show selectable thumbnails below */}
            {item.variants && item.variants.length > 0 && (
              <div className="w-full mt-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Selectable Styles & Variants</span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                  {/* Default Option */}
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedVariantImage(null);
                      setActiveVariantName(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      !selectedVariantImage
                        ? 'bg-blue-600 text-white font-bold shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    Default
                  </button>

                  {/* Specific variant options */}
                  {item.variants.flatMap((v) =>
                    v.options.map((opt) => {
                      const isSelected = activeVariantName === opt.name;
                      return (
                        <button
                          key={`${v.channel}_${opt.tag}`}
                          onClick={() => handleSelectVariant(opt.name, opt.image)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white font-bold shadow-md'
                              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                          }`}
                        >
                          {opt.image && (
                            <img
                              src={opt.image}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-4 h-4 rounded-full object-cover shrink-0"
                            />
                          )}
                          <span>{opt.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Specs & Actions */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
                {item.name}
              </h2>

              <p className="mt-2 text-sm text-slate-300 italic border-l-2 border-blue-500/50 pl-3 py-0.5">
                "{item.description || 'No description provided in game files.'}"
              </p>

              {/* Set information */}
              {item.set && (
                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-xs text-slate-400">Set</span>
                      <p className="text-sm font-semibold text-white">{item.set.value}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenSetShowcase ? (
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          onOpenSetShowcase(item.set?.value || '');
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-xs font-semibold text-blue-300 hover:text-white border border-blue-500/30 flex items-center gap-1 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                        <span>Showcase Set</span>
                      </button>
                    ) : onFilterSet ? (
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          onFilterSet(item.set?.value || '');
                          onClose();
                        }}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                      >
                        View Set
                      </button>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Metadata attributes grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Added to Game</span>
                  </div>
                  <p className="font-semibold text-slate-200">{formattedDate || 'Original'}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Battle Pass Season</span>
                  </div>
                  <p className="font-semibold text-slate-200">
                    {item.introduction?.text || (item.introduction?.chapter ? `Chapter ${item.introduction.chapter}, Season ${item.introduction.season}` : 'Item Shop')}
                  </p>
                </div>
              </div>

              {/* Technical Game ID */}
              <div className="mt-3 text-[11px] font-mono text-slate-400 flex items-center justify-between bg-slate-950/30 p-2 rounded border border-slate-800/60">
                <span className="truncate pr-2">ID: {item.id}</span>
                <button
                  onClick={handleCopyId}
                  className="text-blue-400 hover:text-blue-300 shrink-0 font-sans text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy ID'}</span>
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
              {onEquipToLocker && (
                <button
                  onClick={handleEquip}
                  className={`flex-1 py-3 px-4 rounded-xl font-heading font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                    equippedNotice
                      ? 'bg-emerald-500 text-slate-950 scale-102'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {equippedNotice ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Equipped to Locker!</span>
                    </>
                  ) : (
                    <>
                      <Box className="w-4 h-4" />
                      <span>Equip in Locker</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm uppercase tracking-wider border border-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
