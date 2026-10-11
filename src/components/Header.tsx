import React, { useState } from 'react';
import {
  Music2,
  Search,
  Bell,
  Download,
  Cloud,
  Wifi,
  WifiOff,
  User,
  Shield,
  Layers,
  Flame,
} from 'lucide-react';
import { UserProfile, Category } from '../types/music';

interface HeaderProps {
  user: UserProfile;
  categories: Category[];
  searchQuery: string;
  selectedCategorySlug: string;
  onSearchChange: (q: string) => void;
  onCategoryFilterChange: (slug: string) => void;
  unreadNotifsCount: number;
  activeDownloadsCount: number;
  isOfflineMode: boolean;
  cloudSyncStatus: 'synced' | 'syncing' | 'error';
  onToggleOfflineMode: () => void;
  onOpenNotifications: () => void;
  onOpenDownloadManager: () => void;
  onOpenCloudSync: () => void;
  onOpenPlaylists: () => void;
  onOpenAuthModal: () => void;
  onOpenAdminDashboard: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  categories,
  searchQuery,
  selectedCategorySlug,
  onSearchChange,
  onCategoryFilterChange,
  unreadNotifsCount,
  activeDownloadsCount,
  isOfflineMode,
  cloudSyncStatus,
  onToggleOfflineMode,
  onOpenNotifications,
  onOpenDownloadManager,
  onOpenCloudSync,
  onOpenPlaylists,
  onOpenAuthModal,
  onOpenAdminDashboard,
  onHomeClick,
}) => {
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInput);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner & Marquee Notification Ticker */}
      <div className="bg-slate-900 text-slate-200 px-3 py-1.5 text-xs flex items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase shrink-0">
            Updates
          </span>
          <div className="truncate text-[11px] sm:text-xs text-amber-200 font-medium">
            🔥 Lal Ghaghra Competition Vibration Mix (DJ Surendra) 320 Kbps HQ Released! • All Songs Tested On Dual Subwoofers • High Speed Cloud CDN Active
          </div>
        </div>

        {/* Status Pills */}
        <div className="hidden sm:flex items-center gap-3 shrink-0 text-[11px]">
          {/* Offline Mode Toggle */}
          <button
            onClick={onToggleOfflineMode}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors font-medium ${
              isOfflineMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Toggle offline playback testing"
          >
            {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isOfflineMode ? 'Offline Mode ON' : 'Online'}</span>
          </button>

          {/* Cloud Sync Status */}
          <button
            onClick={onOpenCloudSync}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            title="Cloud Synchronization across devices"
          >
            <Cloud className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'text-amber-400 animate-spin' : 'text-sky-400'}`} />
            <span>Cloud Sync</span>
          </button>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={onHomeClick}
          className="cursor-pointer flex items-center gap-2.5 select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm ring-2 ring-amber-400/20">
            <Music2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                Oye<span className="text-amber-600">Dj</span>Surendra
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200 uppercase">
                MP3 Portal
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              A to Z High Quality DJ Remix & Song Downloading Network
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Playlists Button */}
          <button
            onClick={onOpenPlaylists}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Layers className="w-4 h-4 text-slate-600" />
            <span>Playlists</span>
          </button>

          {/* Download Manager Button */}
          <button
            onClick={onOpenDownloadManager}
            className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Fast Download Manager"
          >
            <Download className="w-4 h-4" />
            {activeDownloadsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {activeDownloadsCount}
              </span>
            )}
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="New Releases & Announcements"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard (if admin) */}
          {user.role === 'admin' && (
            <button
              onClick={onOpenAdminDashboard}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* User Profile / Auth Toggle */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700"
          >
            <div className={`w-6 h-6 rounded-full ${user.avatarBg} text-white flex items-center justify-center text-[10px] font-bold`}>
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <span className="block font-semibold text-slate-900 truncate max-w-[90px]">{user.name}</span>
              <span className="text-[10px] text-amber-600 font-bold uppercase">{user.role}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Classic PHP Search Box Bar */}
      <div className="bg-slate-100 border-t border-slate-200 px-3 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            {/* Category Select Filter */}
            <div className="w-full sm:w-60 shrink-0">
              <select
                value={selectedCategorySlug}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
              >
                <option value="">📁 All Categories (Search Everywhere)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} ({c.trackCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword Input & Button */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search song title, singer, DJ remixer (e.g. Kamariya, Pawan Singh, Retro)..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (e.target.value === '') {
                      onSearchChange('');
                    }
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold transition-colors shrink-0 shadow-2xs"
              >
                Search Song
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};
