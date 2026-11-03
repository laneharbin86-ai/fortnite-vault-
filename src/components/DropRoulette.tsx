/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CosmeticItem } from '../types/fortnite';
import { getRarityStyle, soundFX } from '../utils/rarity';
import { Dices, MapPin, Sparkles, Box } from 'lucide-react';

interface DropRouletteProps {
  allCosmetics: CosmeticItem[];
  onInspectItem: (item: CosmeticItem) => void;
  onEquipItem: (item: CosmeticItem) => void;
}

const ICONIC_POIS = [
  { name: 'Tilted Towers', region: 'Central Island', risk: 'High Danger (Hot Drop)' },
  { name: 'Pleasant Park', region: 'Northwest', risk: 'Medium Danger' },
  { name: 'Retail Row', region: 'East', risk: 'Medium Danger' },
  { name: 'Salty Springs', region: 'Central Plains', risk: 'High Danger' },
  { name: 'Mega City', region: 'Southeast Neon', risk: 'High Danger' },
  { name: 'Reckless Railways', region: 'Central Hub', risk: 'High Danger' },
  { name: 'Mount Olympus', region: 'Mythic Summit', risk: 'Mythic Danger' },
  { name: 'Snooty Steppes', region: 'Mediterranean Coast', risk: 'Medium Danger' },
  { name: 'The Raft', region: 'Prison Outpost', risk: 'High Danger' },
  { name: 'Doomstadt', region: 'Latverian Capital', risk: 'High Danger' },
  { name: 'Loot Lake', region: 'Central Waters', risk: 'Medium Danger' },
  { name: 'Greasy Grove', region: 'Southwest Woods', risk: 'Low Danger' },
  { name: 'Frenzy Fields', region: 'Farmlands', risk: 'Medium Danger' },
  { name: 'Paradise Palms', region: 'Desert Dunes', risk: 'Medium Danger' },
];

export const DropRoulette: React.FC<DropRouletteProps> = ({
  allCosmetics,
  onInspectItem,
  onEquipItem,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [chosenSkin, setChosenSkin] = useState<CosmeticItem | null>(null);
  const [chosenPickaxe, setChosenPickaxe] = useState<CosmeticItem | null>(null);
  const [chosenPoi, setChosenPoi] = useState<(typeof ICONIC_POIS)[0] | null>(null);

  const outfits = allCosmetics.filter((c) => (c.type?.value || '').includes('outfit'));
  const pickaxes = allCosmetics.filter((c) => (c.type?.value || '').includes('pickaxe'));

  const handleSpin = () => {
    if (spinning || outfits.length === 0) return;
    setSpinning(true);
    soundFX.playEquip();

    let rollCount = 0;
    const interval = setInterval(() => {
      rollCount++;
      soundFX.playClick();
      setChosenSkin(outfits[Math.floor(Math.random() * outfits.length)]);
      setChosenPickaxe(pickaxes[Math.floor(Math.random() * pickaxes.length)]);
      setChosenPoi(ICONIC_POIS[Math.floor(Math.random() * ICONIC_POIS.length)]);

      if (rollCount > 18) {
        clearInterval(interval);
        setSpinning(false);
        soundFX.playChest();
      }
    }, 80);
  };

  const handleEquipBoth = () => {
    if (chosenSkin) onEquipItem(chosenSkin);
    if (chosenPickaxe) onEquipItem(chosenPickaxe);
    soundFX.playVictory();
  };

  const skinRarity = chosenSkin ? getRarityStyle(chosenSkin) : null;
  const pickaxeRarity = chosenPickaxe ? getRarityStyle(chosenPickaxe) : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-950/60 via-slate-900 to-blue-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Battle Royale Challenge</span>
        </div>
        <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
          Drop & Skin Roulette
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
          Can't decide what to wear or where to land? Spin the wheel to randomize your match loadout and target drop point!
        </p>

        <button
          onClick={handleSpin}
          disabled={spinning || outfits.length === 0}
          className="mt-6 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-black text-base uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 disabled:opacity-50 inline-flex items-center gap-2"
        >
          <Dices className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
          <span>{spinning ? 'Spinning Destiny...' : 'Spin Drop Roulette!'}</span>
        </button>
      </div>

      {/* Outcome Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slot 1: Skin */}
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Selected Skin / Outfit
          </span>
          <div
            onClick={() => chosenSkin && onInspectItem(chosenSkin)}
            className={`flex-1 aspect-square rounded-2xl border p-4 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all ${
              chosenSkin && skinRarity
                ? `${skinRarity.cardBorder} bg-gradient-to-b ${skinRarity.cardBg} shadow-xl cursor-pointer hover:scale-102`
                : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            {chosenSkin ? (
              <>
                <img
                  src={
                    chosenSkin.images.featured ||
                    chosenSkin.images.icon ||
                    chosenSkin.images.smallIcon
                  }
                  alt={chosenSkin.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-4/5 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
                />
                <div className="mt-2 w-full truncate">
                  <h4 className="font-heading font-black text-base text-white truncate">
                    {chosenSkin.name}
                  </h4>
                  <span className="text-[11px] text-blue-300 font-semibold block">
                    {skinRarity?.label}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-slate-600">
                <Dices className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold">Press Spin to Select</p>
              </div>
            )}
          </div>
          {chosenSkin && (
            <button
              onClick={() => onEquipItem(chosenSkin)}
              className="mt-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400 font-bold text-xs uppercase tracking-wider border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Equip to Locker</span>
            </button>
          )}
        </div>

        {/* Slot 2: Harvesting Tool */}
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Harvesting Tool
          </span>
          <div
            onClick={() => chosenPickaxe && onInspectItem(chosenPickaxe)}
            className={`flex-1 aspect-square rounded-2xl border p-4 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all ${
              chosenPickaxe && pickaxeRarity
                ? `${pickaxeRarity.cardBorder} bg-gradient-to-b ${pickaxeRarity.cardBg} shadow-xl cursor-pointer hover:scale-102`
                : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            {chosenPickaxe ? (
              <>
                <img
                  src={
                    chosenPickaxe.images.featured ||
                    chosenPickaxe.images.icon ||
                    chosenPickaxe.images.smallIcon
                  }
                  alt={chosenPickaxe.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-4/5 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
                />
                <div className="mt-2 w-full truncate">
                  <h4 className="font-heading font-black text-base text-white truncate">
                    {chosenPickaxe.name}
                  </h4>
                  <span className="text-[11px] text-blue-300 font-semibold block">
                    {pickaxeRarity?.label}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-slate-600">
                <Dices className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold">Press Spin to Select</p>
              </div>
            )}
          </div>
          {chosenPickaxe && (
            <button
              onClick={() => onEquipItem(chosenPickaxe)}
              className="mt-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400 font-bold text-xs uppercase tracking-wider border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Equip to Locker</span>
            </button>
          )}
        </div>

        {/* Slot 3: Target Drop Location */}
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Target Drop POI
          </span>
          <div className="flex-1 aspect-square rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 p-6 flex flex-col items-center justify-center text-center shadow-xl">
            {chosenPoi ? (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
                  <MapPin className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-2xl text-white uppercase">
                    {chosenPoi.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{chosenPoi.region}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-blue-300 bg-blue-950 border border-blue-500/40 px-2 py-0.5 rounded">
                    {chosenPoi.risk}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-600">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold">Press Spin to Land</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {chosenSkin && chosenPickaxe && (
        <div className="flex items-center justify-center pt-2 animate-in fade-in">
          <button
            onClick={handleEquipBoth}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
          >
            <Box className="w-4 h-4 stroke-[2.5]" />
            <span>Equip Rolled Combo ({chosenSkin.name} + {chosenPickaxe.name})</span>
          </button>
        </div>
      )}
    </div>
  );
};
