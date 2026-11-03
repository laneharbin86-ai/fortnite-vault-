/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CosmeticItem, LockerPreset } from '../types/fortnite';
import { getRarityStyle, soundFX } from '../utils/rarity';
import { Dices, Trash2, Share2, Check, Sparkles, Plus, Bookmark, Download } from 'lucide-react';

interface LockerBuilderProps {
  allCosmetics: CosmeticItem[];
  onInspectItem: (item: CosmeticItem) => void;
  onOpenCategory: (cat: string) => void;
}

const STORAGE_KEY = 'fortnite_vault_presets_v1';
const ACTIVE_PRESET_KEY = 'fortnite_vault_active_preset_v1';

export const LockerBuilder: React.FC<LockerBuilderProps> = ({
  allCosmetics,
  onInspectItem,
  onOpenCategory,
}) => {
  const [presets, setPresets] = useState<LockerPreset[]>([]);
  const [activePreset, setActivePreset] = useState<LockerPreset>({
    id: 'default',
    name: 'Primary Locker',
    outfit: null,
    backpack: null,
    pickaxe: null,
    glider: null,
    shoes: null,
    wrap: null,
    emotes: [null, null, null, null, null, null],
  });
  const [presetNameInput, setPresetNameInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem(STORAGE_KEY);
      if (savedPresets) {
        setPresets(JSON.parse(savedPresets));
      }
      const savedActive = localStorage.getItem(ACTIVE_PRESET_KEY);
      if (savedActive) {
        setActivePreset(JSON.parse(savedActive));
      } else if (allCosmetics.length > 0) {
        // Seed default combo with Solid Snake or first outfit
        const defaultOutfit = allCosmetics.find((c) => c.id.includes('AbstractMirror') || c.type?.value === 'outfit');
        const defaultBack = allCosmetics.find((c) => c.type?.value === 'backpack');
        const defaultPick = allCosmetics.find((c) => c.type?.value === 'pickaxe');
        const defaultGlider = allCosmetics.find((c) => c.type?.value === 'glider');

        if (defaultOutfit) {
          setActivePreset((prev) => ({
            ...prev,
            outfit: defaultOutfit,
            backpack: defaultBack || null,
            pickaxe: defaultPick || null,
            glider: defaultGlider || null,
          }));
        }
      }
    } catch {
      // Ignore storage error
    }
  }, [allCosmetics]);

  const saveActive = (newPreset: LockerPreset) => {
    setActivePreset(newPreset);
    try {
      localStorage.setItem(ACTIVE_PRESET_KEY, JSON.stringify(newPreset));
    } catch {
      // Ignore storage error
    }
  };

  const handleClearSlot = (slotKey: keyof LockerPreset, emoteIndex?: number) => {
    soundFX.playClick();
    if (slotKey === 'emotes' && typeof emoteIndex === 'number') {
      const nextEmotes = [...(activePreset.emotes || [null, null, null, null, null, null])];
      nextEmotes[emoteIndex] = null;
      saveActive({ ...activePreset, emotes: nextEmotes });
    } else {
      saveActive({ ...activePreset, [slotKey]: null });
    }
  };

  const handleRandomize = () => {
    soundFX.playEquip();
    if (allCosmetics.length === 0) return;

    const outfits = allCosmetics.filter((c) => (c.type?.value || '').includes('outfit'));
    const backpacks = allCosmetics.filter((c) => (c.type?.value || '').includes('backpack'));
    const pickaxes = allCosmetics.filter((c) => (c.type?.value || '').includes('pickaxe'));
    const gliders = allCosmetics.filter((c) => (c.type?.value || '').includes('glider'));
    const wraps = allCosmetics.filter((c) => (c.type?.value || '').includes('wrap'));
    const emotes = allCosmetics.filter((c) => (c.type?.value || '').includes('emote'));

    const randomPick = <T,>(arr: T[]): T | null =>
      arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

    const randomized: LockerPreset = {
      ...activePreset,
      name: 'Randomized Combo',
      outfit: randomPick(outfits),
      backpack: randomPick(backpacks),
      pickaxe: randomPick(pickaxes),
      glider: randomPick(gliders),
      wrap: randomPick(wraps),
      emotes: [
        randomPick(emotes),
        randomPick(emotes),
        randomPick(emotes),
        randomPick(emotes),
        randomPick(emotes),
        randomPick(emotes),
      ],
    };

    saveActive(randomized);
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetNameInput.trim()) return;
    soundFX.playEquip();

    const newP: LockerPreset = {
      ...activePreset,
      id: `preset_${Date.now()}`,
      name: presetNameInput.trim(),
    };
    const updated = [newP, ...presets];
    setPresets(updated);
    setPresetNameInput('');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
  };

  const handleLoadPreset = (p: LockerPreset) => {
    soundFX.playEquip();
    saveActive(p);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playClick();
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
  };

  const handleShare = () => {
    soundFX.playClick();
    const summary = [
      `🎮 My Fortnite Locker Combo [${activePreset.name}]:`,
      `👕 Skin: ${activePreset.outfit?.name || 'None'}`,
      `🎒 Back Bling: ${activePreset.backpack?.name || 'None'}`,
      `⛏️ Pickaxe: ${activePreset.pickaxe?.name || 'None'}`,
      `🪂 Glider: ${activePreset.glider?.name || 'None'}`,
      `👟 Shoes: ${activePreset.shoes?.name || 'None'}`,
      `🎨 Wrap: ${activePreset.wrap?.name || 'None'}`,
    ].join('\n');

    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCard = async () => {
    setIsExporting(true);
    soundFX.playClick();
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 675;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background gradient: dark navy/indigo to slate-950
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 675);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 675);

      // Angled blue accent polygon
      ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(800, 0);
      ctx.lineTo(600, 675);
      ctx.lineTo(0, 675);
      ctx.closePath();
      ctx.fill();

      // Outer border
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 1180, 655);

      // Header Title
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('FORTNITE BATTLE ROYALE · LOCKER COMBO', 50, 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px sans-serif';
      ctx.fillText(activePreset.name.toUpperCase(), 50, 105);

      // Helper to load image
      const loadImage = (url?: string): Promise<HTMLImageElement | null> => {
        if (!url) return Promise.resolve(null);
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = url;
        });
      };

      // Load outfit image
      const outfitImgUrl = activePreset.outfit?.images.featured || activePreset.outfit?.images.icon || activePreset.outfit?.images.smallIcon;
      const outfitImg = await loadImage(outfitImgUrl);

      // Draw Outfit Card (left side)
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(50, 140, 360, 480, 16);
      ctx.fill();
      ctx.stroke();

      if (outfitImg) {
        try {
          ctx.drawImage(outfitImg, 70, 160, 320, 360);
        } catch {
          // Fallback
        }
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(activePreset.outfit?.name || 'No Outfit Equipped', 70, 560);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText(activePreset.outfit?.set?.value || activePreset.outfit?.type?.displayValue || 'Outfit', 70, 590);

      // Draw Gear Slots on the right
      const gearSlots = [
        { label: 'BACK BLING', item: activePreset.backpack },
        { label: 'PICKAXE', item: activePreset.pickaxe },
        { label: 'GLIDER', item: activePreset.glider },
        { label: 'SHOES', item: activePreset.shoes },
        { label: 'WRAP', item: activePreset.wrap },
      ];

      for (let i = 0; i < gearSlots.length; i++) {
        const slot = gearSlots[i];
        const x = 440 + (i % 3) * 230;
        const y = 140 + Math.floor(i / 3) * 160;

        ctx.fillStyle = '#090d16';
        ctx.strokeStyle = slot.item ? '#334155' : '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, y, 215, 140, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(slot.label, x + 15, y + 25);

        ctx.fillStyle = slot.item ? '#ffffff' : '#475569';
        ctx.font = 'bold 15px sans-serif';
        const name = slot.item?.name || 'Empty';
        ctx.fillText(name.length > 18 ? name.slice(0, 16) + '...' : name, x + 15, y + 120);

        const slotImgUrl = slot.item?.images.smallIcon || slot.item?.images.icon;
        const slotImg = await loadImage(slotImgUrl);
        if (slotImg) {
          try {
            ctx.drawImage(slotImg, x + 65, y + 25, 80, 80);
          } catch {
            // Ignore
          }
        }
      }

      // Emote Wheel summary
      const emoteX = 440;
      const emoteY = 480;
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(emoteX, emoteY, 700, 140, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('EMOTE WHEEL (6 DANCES)', emoteX + 15, emoteY + 25);

      for (let j = 0; j < 6; j++) {
        const em = activePreset.emotes?.[j];
        const ex = emoteX + 15 + j * 112;
        const ey = emoteY + 38;

        ctx.fillStyle = '#020617';
        ctx.strokeStyle = em ? '#2563eb' : '#1e293b';
        ctx.beginPath();
        ctx.roundRect(ex, ey, 100, 85, 8);
        ctx.fill();
        ctx.stroke();

        const emImg = await loadImage(em?.images.smallIcon || em?.images.icon);
        if (emImg) {
          try {
            ctx.drawImage(emImg, ex + 25, ey + 8, 50, 50);
          } catch {
            // Ignore
          }
        }

        ctx.fillStyle = em ? '#e2e8f0' : '#475569';
        ctx.font = '10px sans-serif';
        const emName = em?.name || `Slot ${j + 1}`;
        ctx.fillText(emName.length > 12 ? emName.slice(0, 10) + '..' : emName, ex + 8, ey + 75);
      }

      // Watermark
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('FORTNITE COSMETICS VAULT', 960, 60);

      // Export & Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Fortnite-Locker-${activePreset.name.replace(/\s+/g, '_')}.png`;
      a.click();
      soundFX.playVictory();
    } catch (err) {
      console.error('Failed to export locker card:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const renderSlot = (
    label: string,
    catId: string,
    item: CosmeticItem | null | undefined,
    slotKey: keyof LockerPreset,
    emoteIndex?: number
  ) => {
    const rarityStyle = item ? getRarityStyle(item) : null;
    const imageUrl = item ? item.images.featured || item.images.icon || item.images.smallIcon : null;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>{label}</span>
          {item && (
            <button
              onClick={() => handleClearSlot(slotKey, emoteIndex)}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Remove item"
            >
              Clear
            </button>
          )}
        </div>

        <div
          onClick={() => {
            if (item) {
              soundFX.playInspect();
              onInspectItem(item);
            } else {
              soundFX.playClick();
              onOpenCategory(catId);
            }
          }}
          className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-200 group overflow-hidden ${
            item
              ? `${rarityStyle?.cardBorder} bg-gradient-to-b ${rarityStyle?.cardBg} hover:-translate-y-1 shadow-lg`
              : 'border-dashed border-slate-700 bg-slate-900/40 hover:border-blue-500 hover:bg-slate-900/80'
          }`}
        >
          {item && imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-slate-950/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-center">
                <span className="text-[11px] font-heading font-bold text-white truncate block">
                  {item.name}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors text-center p-2">
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Select {label}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="bg-gradient-to-r from-blue-600/10 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Interactive Battle Royale Locker</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            {activePreset.name}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Equip any skin, back bling, pickaxe, glider, and dances into your active combo.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCard}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-300 hover:text-white border border-blue-500/30 hover:border-blue-500 font-heading font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>{isExporting ? 'Generating...' : 'Download Card (PNG)'}</span>
          </button>

          <button
            onClick={handleRandomize}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all hover:scale-102"
          >
            <Dices className="w-4 h-4" />
            <span>Randomize Combo</span>
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied Text' : 'Share Text'}</span>
          </button>
        </div>
      </div>

      {/* Main Locker Grid: Primary Gear (Skin, Back Bling, Harvesting Tool, Glider, Shoes, Wrap) */}
      <div>
        <h3 className="font-heading font-black text-xl text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
          Equipped Battle Gear
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {renderSlot('Outfit (Skin)', 'outfit', activePreset.outfit, 'outfit')}
          {renderSlot('Back Bling', 'backpack', activePreset.backpack, 'backpack')}
          {renderSlot('Pickaxe', 'pickaxe', activePreset.pickaxe, 'pickaxe')}
          {renderSlot('Glider', 'glider', activePreset.glider, 'glider')}
          {renderSlot('Shoes / Kicks', 'shoes', activePreset.shoes, 'shoes')}
          {renderSlot('Weapon Wrap', 'wrap', activePreset.wrap, 'wrap')}
        </div>
      </div>

      {/* Emote Wheel (6 Slots) */}
      <div>
        <h3 className="font-heading font-black text-xl text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Emote Wheel (6 Slots)</span>
          <span className="text-xs font-mono text-slate-400 font-normal">Equip favorite dances</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const emoteItem = activePreset.emotes?.[idx] || null;
            return (
              <React.Fragment key={idx}>
                {renderSlot(`Emote Slot ${idx + 1}`, 'emote', emoteItem, 'emotes', idx)}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Preset Manager: Save & Load Saved Combos */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="font-heading font-bold text-lg text-white uppercase tracking-wide flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-400" />
              <span>Saved Locker Presets</span>
            </h4>
            <p className="text-xs text-slate-400">Save custom loadouts to quick-swap anytime.</p>
          </div>

          <form onSubmit={handleSavePreset} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={presetNameInput}
              onChange={(e) => setPresetNameInput(e.target.value)}
              placeholder="e.g. Tryhard Sweat Combo..."
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!presetNameInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-500 disabled:opacity-40 whitespace-nowrap"
            >
              Save Current
            </button>
          </form>
        </div>

        {presets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {presets.map((p) => (
              <div
                key={p.id}
                onClick={() => handleLoadPreset(p)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-2.5 truncate">
                  {p.outfit?.images.smallIcon && (
                    <img
                      src={p.outfit.images.smallIcon}
                      alt=""
                      className="w-8 h-8 rounded-lg object-contain bg-slate-900 shrink-0"
                    />
                  )}
                  <div className="truncate">
                    <span className="font-heading font-bold text-xs text-white block truncate group-hover:text-blue-400">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {p.outfit?.name || 'Custom Setup'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeletePreset(p.id, e)}
                  className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                  title="Delete preset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No saved presets yet. Type a name above to save your first loadout.</p>
        )}
      </div>
    </div>
  );
};
