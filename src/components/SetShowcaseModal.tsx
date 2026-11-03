/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CosmeticItem } from '../types/fortnite';
import { getRarityStyle, soundFX } from '../utils/rarity';
import { Layers, X, Box, Check, Eye } from 'lucide-react';

interface SetShowcaseModalProps {
  setName: string | null;
  allCosmetics: CosmeticItem[];
  onClose: () => void;
  onInspectItem: (item: CosmeticItem) => void;
  onEquipItem: (item: CosmeticItem) => void;
  onEquipFullSet: (items: CosmeticItem[]) => void;
}

export const SetShowcaseModal: React.FC<SetShowcaseModalProps> = ({
  setName,
  allCosmetics,
  onClose,
  onInspectItem,
  onEquipItem,
  onEquipFullSet,
}) => {
  if (!setName) return null;

  const setItems = allCosmetics.filter(
    (c) => c.set?.value?.toLowerCase() === setName.toLowerCase()
  );

  const handleEquipAll = () => {
    soundFX.playEquip();
    onEquipFullSet(setItems);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              <Layers className="w-4 h-4" />
              <span>Official Cosmetic Set</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              {setName} Set
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Found {setItems.length} matching battle items released as part of this theme.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {setItems.length > 1 && (
              <button
                onClick={handleEquipAll}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all hover:scale-102"
              >
                <Box className="w-3.5 h-3.5" />
                <span>Equip Full Set</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Set Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {setItems.map((item) => {
            const style = getRarityStyle(item);
            const imageUrl = item.images.featured || item.images.icon || item.images.smallIcon;

            return (
              <div
                key={item.id}
                onClick={() => {
                  soundFX.playInspect();
                  onInspectItem(item);
                }}
                className={`group rounded-xl border ${style.cardBorder} bg-gradient-to-b ${style.cardBg} p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between overflow-hidden`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 truncate">
                  <span>{item.type?.displayValue || item.type?.value}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] ${style.badgeBg} ${style.badgeText}`}>
                    {style.label}
                  </span>
                </div>

                <div className="relative aspect-square w-full rounded-lg bg-black/20 p-2 flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)] group-hover:scale-108 transition-transform"
                    />
                  ) : (
                    <span className="text-slate-500 font-bold">FN</span>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                  <h4 className="font-heading font-bold text-xs text-white truncate group-hover:text-blue-300">
                    {item.name}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playEquip();
                      onEquipItem(item);
                    }}
                    className="p-1 rounded bg-slate-950 hover:bg-blue-600 text-slate-400 hover:text-white transition-colors"
                    title="Equip to Locker"
                  >
                    <Box className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
