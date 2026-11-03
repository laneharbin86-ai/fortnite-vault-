/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MapData, MapPOI } from '../types/fortnite';
import { fetchFortniteMap } from '../services/fortniteApi';
import { soundFX } from '../utils/rarity';
import { MapPin, ZoomIn, ZoomOut, RotateCcw, Search, Compass, Sparkles, RefreshCw, Layers } from 'lucide-react';

export const MinimapView: React.FC = () => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapMode, setMapMode] = useState<'pois' | 'blank'>('pois');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchPOI, setSearchPOI] = useState('');
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);
  const [pinnedCoord, setPinnedCoord] = useState<{ xPct: number; yPct: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    fetchFortniteMap().then((data) => {
      if (isMounted) {
        setMapData(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleZoom = (delta: number) => {
    soundFX.playClick();
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.8), 3));
  };

  const handleResetZoom = () => {
    soundFX.playClick();
    setZoomLevel(1);
    setPinnedCoord(null);
    setSelectedPOI(null);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    soundFX.playEquip();
    setPinnedCoord({ xPct, yPct });
  };

  const filteredPOIs = (mapData?.pois || []).filter((p) =>
    p.name.toLowerCase().includes(searchPOI.trim().toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <RefreshCw className="w-10 h-10 text-blue-400 animate-spin mb-4" />
        <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider">
          Retrieving Island Satellite Map...
        </h3>
        <p className="text-sm text-slate-400 mt-1">Loading real-time Battle Royale terrain & POI data.</p>
      </div>
    );
  }

  const currentMapImage =
    mapMode === 'pois'
      ? mapData?.images.pois || 'https://fortnite-api.com/images/map_en.png'
      : mapData?.images.blank || 'https://fortnite-api.com/images/map.png';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>Fortnite Battle Royale Tactical Satellite</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Island Minimap & Coordinates
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Real-time high-resolution island map directly from the Fortnite API. Explore named locations, inspect terrain elevation, and pin drop coordinates.
          </p>
        </div>

        {/* View Switchers & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                soundFX.playClick();
                setMapMode('pois');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                mapMode === 'pois'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              POI Map
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setMapMode('blank');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                mapMode === 'blank'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite Blank
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleZoom(0.25)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-0.25)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + POI Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Map Viewport (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Click anywhere on the map to drop a tactical landing pin</span>
            </span>
            <span className="font-mono text-sky-400 font-bold">
              Zoom: {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          <div
            ref={containerRef}
            onClick={handleMapClick}
            className="relative aspect-square w-full overflow-hidden bg-slate-950 cursor-crosshair select-none flex items-center justify-center"
          >
            <img
              src={currentMapImage}
              alt="Fortnite Island Map"
              referrerPolicy="no-referrer"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Custom Dropped Marker Pin */}
            {pinnedCoord && (
              <div
                className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-30 animate-bounce"
                style={{
                  left: `${pinnedCoord.xPct}%`,
                  top: `${pinnedCoord.yPct}%`,
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-lg uppercase whitespace-nowrap mb-0.5">
                    Drop Target ({Math.round(pinnedCoord.xPct)}%, {Math.round(pinnedCoord.yPct)}%)
                  </div>
                  <MapPin className="w-7 h-7 text-blue-500 fill-blue-500 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* POI Directory Sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-lg text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Points of Interest ({mapData?.pois.length || 0})</span>
            </h3>
          </div>

          {/* Search POIs */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchPOI}
              onChange={(e) => setSearchPOI(e.target.value)}
              placeholder="Search island locations..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Selected POI Details Card */}
          {selectedPOI && (
            <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/40 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-sky-300">
                  {selectedPOI.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Z: {Math.round(selectedPOI.location.z)}m
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 grid grid-cols-2 gap-2 bg-slate-950/60 p-2 rounded">
                <div>X: {Math.round(selectedPOI.location.x)}</div>
                <div>Y: {Math.round(selectedPOI.location.y)}</div>
              </div>
            </div>
          )}

          {/* POI List */}
          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredPOIs.map((poi) => {
              const isSelected = selectedPOI?.id === poi.id;
              return (
                <div
                  key={poi.id}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedPOI(poi);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-semibold truncate">{poi.name}</span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {Math.round(poi.location.z)}m
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
