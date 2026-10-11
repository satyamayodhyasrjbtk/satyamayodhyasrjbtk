import React from 'react';
import { Volume2, ShieldCheck, Flame, Smartphone, Radio } from 'lucide-react';

interface NoticeBoardProps {
  onCategorySelect?: (slug: string) => void;
  onOpenOfflineModal: () => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ onCategorySelect, onOpenOfflineModal }) => {
  return (
    <div className="space-y-3">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white rounded-lg p-3 shadow-sm border border-amber-400/40">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 bg-black/20 rounded-md shrink-0 mt-0.5">
            <Volume2 className="w-5 h-5 text-amber-100" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <p className="font-bold tracking-wide flex items-center gap-1.5">
              <span>★ OyeDjSurendra.com - Official DJ Song Download Portal ★</span>
              <span className="bg-red-700 text-white text-[10px] uppercase font-bold px-1.5 py-0.2 rounded">
                2026 Edition
              </span>
            </p>
            <p className="text-amber-50/90 text-[11px] sm:text-xs mt-0.5 leading-relaxed">
              Welcome to the fastest music downloading network! High Definition 320 Kbps MP3 Audio, competition sound check tracks, car subwoofer bass, and mobile ringtones. All tracks free to download & stream.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Flame className="w-4 h-4 text-amber-600" />
          <span>Quick Folders:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onCategorySelect && onCategorySelect('bhojpuri-dj')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 transition-colors font-medium"
          >
            Bhojpuri 2026
          </button>
          <button
            onClick={() => onCategorySelect && onCategorySelect('bollywood-mashup')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-200 transition-colors font-medium"
          >
            Bollywood Mashup
          </button>
          <button
            onClick={() => onCategorySelect && onCategorySelect('haryanvi-bass')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-200 transition-colors font-medium"
          >
            Haryanvi Bass
          </button>
          <button
            onClick={() => onCategorySelect && onCategorySelect('ringtones')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-200 transition-colors font-medium"
          >
            Call Ringtones
          </button>
          <button
            onClick={onOpenOfflineModal}
            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 transition-colors font-medium flex items-center gap-1"
          >
            <Smartphone className="w-3 h-3 text-emerald-600" />
            Offline Mode
          </button>
        </div>
      </div>
    </div>
  );
};
