/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NewsData, MOTDItem } from '../types/fortnite';
import { fetchFortniteNews } from '../services/fortniteApi';
import { soundFX } from '../utils/rarity';
import { Newspaper, Calendar, RefreshCw, Sparkles, ExternalLink, Flame } from 'lucide-react';

export const FortniteNewsView: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMotd, setSelectedMotd] = useState<MOTDItem | null>(null);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await fetchFortniteNews();
      if (data) {
        setNewsData(data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <RefreshCw className="w-10 h-10 text-blue-400 animate-spin mb-4" />
        <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider">
          Fetching Battle Royale News...
        </h3>
        <p className="text-sm text-slate-400 mt-1">Downloading official in-game news bulletins and patch updates.</p>
      </div>
    );
  }

  const formattedDate = newsData?.date
    ? new Date(newsData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Latest Update';

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600/15 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Flame className="w-4 h-4" />
            <span>Official Epic Games Feed</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Battle Royale News & Updates
          </h2>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Published {formattedDate}</span>
          </p>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            loadNews();
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Featured Header / Animated MOTD Banner */}
      {newsData?.image && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
          <img
            src={newsData.image}
            alt="Fortnite News Header"
            referrerPolicy="no-referrer"
            className="w-full max-h-[360px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 sm:p-8">
            <div className="max-w-2xl">
              <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[11px] uppercase tracking-wider shadow-md">
                Featured Bulletin
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-wide mt-2">
                Today on the Island
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Official server notices, event announcements, and latest Battle Royale season highlights.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MOTD Bulletins Grid */}
      {newsData && newsData.motds && newsData.motds.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Newspaper className="w-4 h-4 text-blue-400" />
            <h3 className="font-heading font-black text-xl text-white uppercase tracking-wider">
              Messages of the Day ({newsData.motds.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.motds.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  soundFX.playInspect();
                  setSelectedMotd(item);
                }}
                className="group bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-200 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image || item.tileImage}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  <div className="p-5">
                    <h4 className="font-heading font-black text-lg text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-blue-400 font-semibold group-hover:underline">
                  <span>Read Full Notice</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-white">No Bulletins Posted</h3>
          <p className="text-sm text-slate-400 mt-1">Check back soon for new Fortnite patch notes and season updates.</p>
        </div>
      )}

      {/* MOTD Detail Modal */}
      {selectedMotd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedMotd(null)}
            aria-hidden="true"
          />

          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 my-auto">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={selectedMotd.image || selectedMotd.tileImage}
                alt={selectedMotd.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedMotd(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider">
                Official Fortnite Notice
              </span>
              <h3 className="font-heading font-black text-2xl text-white">
                {selectedMotd.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedMotd.body}
              </p>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedMotd(null)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Close Bulletin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
