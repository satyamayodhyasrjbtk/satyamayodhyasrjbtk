import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NoticeBoard } from './components/NoticeBoard';
import { CategoryBrowser } from './components/CategoryBrowser';
import { TrackTable } from './components/TrackTable';
import { TrackDetailModal } from './components/TrackDetailModal';
import { AudioPlayer } from './components/AudioPlayer';
import { DownloadManagerDrawer } from './components/DownloadManagerDrawer';
import { PlaylistModal } from './components/PlaylistModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { OfflineLibraryModal } from './components/OfflineLibraryModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

import {
  Track,
  Category,
  Playlist,
  NotificationItem,
  UserProfile,
  DownloadTask,
  AudioQuality,
  CachedOfflineTrack,
} from './types/music';

import { INITIAL_CATEGORIES } from './data/initialSongs';
import { StorageService } from './services/storage';
import { audioEngine } from './services/audioEngine';

export default function App() {
  // Main Data States
  const [tracks, setTracks] = useState<Track[]>(() => StorageService.getTracks());
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [playlists, setPlaylists] = useState<Playlist[]>(() => StorageService.getPlaylists());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageService.getNotifications()
  );
  const [user, setUser] = useState<UserProfile>(() => StorageService.getUser());
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => StorageService.getLikedTracks());
  const [offlineTracks, setOfflineTracks] = useState<CachedOfflineTrack[]>(() =>
    StorageService.getOfflineTracks()
  );
  const [cloudSyncInfo, setCloudSyncInfo] = useState(() => StorageService.getCloudSyncInfo());

  // Filter & Search States
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Audio Playback States
  const [currentTrack, setCurrentTrack] = useState<Track | null>(tracks[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Download Manager States
  const [downloadTasks, setDownloadTasks] = useState<DownloadTask[]>([]);
  const [isDownloadDrawerOpen, setIsDownloadDrawerOpen] = useState<boolean>(false);

  // Active Modals
  const [detailModalTrack, setDetailModalTrack] = useState<Track | null>(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<Track | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [isCloudSyncModalOpen, setIsCloudSyncModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Offline Simulation Mode State
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Playback Control Handlers
  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      audioEngine.resume();
      setIsPlaying(true);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      audioEngine.playTrack(
        track,
        0,
        undefined,
        () => handleNextTrack()
      );
    }
  };

  const handlePauseTrack = () => {
    audioEngine.pause();
    setIsPlaying(false);
  };

  const handleNextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handlePlayTrack(tracks[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handlePlayTrack(tracks[prevIndex]);
  };

  // Liked Tracks Handler
  const handleToggleLike = (trackId: string) => {
    const updated = StorageService.toggleLikedTrack(trackId);
    setLikedTrackIds(updated);
    showToast(updated.includes(trackId) ? 'Added to favorites ❤️' : 'Removed from favorites');
  };

  // Offline Caching Handler
  const handleToggleOffline = (track: Track) => {
    const isCached = offlineTracks.some((item) => item.trackId === track.id);
    if (isCached) {
      const updated = StorageService.removeOfflineTrack(track.id);
      setOfflineTracks(updated);
      showToast(`Removed "${track.title}" from offline storage`);
    } else {
      const updated = StorageService.saveOfflineTrack(track);
      setOfflineTracks(updated);
      showToast(`Saved "${track.title}" for offline playback! 📲`);
    }
  };

  const handleRemoveCachedTrack = (trackId: string) => {
    const updated = StorageService.removeOfflineTrack(trackId);
    setOfflineTracks(updated);
  };

  // Fast Download Manager Logic
  const handleStartDownload = async (track: Track, quality: AudioQuality = '320kbps') => {
    const taskId = `dl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const calcSizeMb =
      quality === '320kbps'
        ? track.sizeMb
        : quality === '192kbps'
        ? Number((track.sizeMb * 0.6).toFixed(1))
        : quality === '128kbps'
        ? Number((track.sizeMb * 0.4).toFixed(1))
        : 1.2;

    const newTask: DownloadTask = {
      id: taskId,
      trackId: track.id,
      trackTitle: track.title,
      quality,
      sizeMb: calcSizeMb,
      progress: 5,
      speedMb: 14.5 + Math.random() * 6.5,
      status: 'downloading',
      startedAt: Date.now(),
    };

    setDownloadTasks((prev) => [newTask, ...prev]);
    setIsDownloadDrawerOpen(true);
    showToast(`Downloading "${track.title}" (${quality})... ⬇️`);

    // Increment track download hits
    const updatedTracks = tracks.map((t) =>
      t.id === track.id ? { ...t, downloadCount: t.downloadCount + 1 } : t
    );
    setTracks(updatedTracks);
    StorageService.saveTracks(updatedTracks);
    StorageService.recordDownload(track.id, quality);

    // Simulate fast progressive download steps
    let currentProgress = 5;
    const interval = setInterval(async () => {
      currentProgress += Math.floor(Math.random() * 25) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        // Generate actual playable Audio Blob and trigger real browser download
        try {
          const blob = await audioEngine.generateAudioBlob(track, quality);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const cleanName = track.title.replace(/[^a-zA-Z0-9_-]/g, '_');
          a.download = `${cleanName}_${quality}_OyeDjSurendra.wav`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        } catch (err) {
          console.warn('Real blob generation fallback', err);
        }

        setDownloadTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, progress: 100, status: 'completed' }
              : t
          )
        );
        showToast(`Download finished: "${track.title}" saved to disk! ✅`);
      } else {
        setDownloadTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  progress: currentProgress,
                  speedMb: 12 + Math.random() * 8,
                }
              : t
          )
        );
      }
    }, 450);
  };

  const handlePauseDownloadTask = (id: string) => {
    setDownloadTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'paused' } : t))
    );
  };

  const handleResumeDownloadTask = (id: string) => {
    setDownloadTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'downloading' } : t))
    );
  };

  const handleCancelDownloadTask = (id: string) => {
    setDownloadTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompletedDownloads = () => {
    setDownloadTasks((prev) => prev.filter((t) => t.status !== 'completed'));
  };

  // Playlists Handlers
  const handleCreatePlaylist = (name: string, description: string) => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name,
      description,
      trackIds: selectedTrackForPlaylist ? [selectedTrackForPlaylist.id] : [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      coverGradient: 'from-amber-500 to-orange-600',
    };
    const updated = [newPl, ...playlists];
    setPlaylists(updated);
    StorageService.savePlaylists(updated);
    showToast(`Created playlist "${name}"`);
  };

  const handleDeletePlaylist = (id: string) => {
    const updated = playlists.filter((p) => p.id !== id);
    setPlaylists(updated);
    StorageService.savePlaylists(updated);
    showToast('Playlist deleted');
  };

  const handleAddTrackToPlaylist = (playlistId: string, trackId: string) => {
    const updated = playlists.map((p) => {
      if (p.id === playlistId && !p.trackIds.includes(trackId)) {
        return { ...p, trackIds: [...p.trackIds, trackId] };
      }
      return p;
    });
    setPlaylists(updated);
    StorageService.savePlaylists(updated);
    showToast('Track added to playlist! 🎵');
  };

  const handleRemoveTrackFromPlaylist = (playlistId: string, trackId: string) => {
    const updated = playlists.map((p) => {
      if (p.id === playlistId) {
        return { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) };
      }
      return p;
    });
    setPlaylists(updated);
    StorageService.savePlaylists(updated);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    const firstTrack = tracks.find((t) => playlist.trackIds.includes(t.id));
    if (firstTrack) {
      handlePlayTrack(firstTrack);
      showToast(`Playing playlist: "${playlist.name}"`);
    } else {
      showToast('Playlist has no tracks yet');
    }
  };

  // Admin Actions Handlers
  const handleAddTrackAdmin = (trackData: Omit<Track, 'id'>, broadcastRelease: boolean) => {
    const newTrack: Track = {
      ...trackData,
      id: `track-${Date.now()}`,
    };
    const updated = [newTrack, ...tracks];
    setTracks(updated);
    StorageService.saveTracks(updated);

    if (broadcastRelease) {
      handleBroadcastNotification(
        `🔥 New Release: ${newTrack.title}`,
        `${newTrack.remixer} has just published this fresh DJ mix in 320 Kbps HQ!`,
        newTrack.id
      );
    }
    showToast(`Song "${newTrack.title}" published to portal! 🚀`);
  };

  const handleUpdateTrackAdmin = (updatedTrack: Track) => {
    const updated = tracks.map((t) => (t.id === updatedTrack.id ? updatedTrack : t));
    setTracks(updated);
    StorageService.saveTracks(updated);
    showToast('Track metadata updated');
  };

  const handleDeleteTrackAdmin = (trackId: string) => {
    const updated = tracks.filter((t) => t.id !== trackId);
    setTracks(updated);
    StorageService.saveTracks(updated);
    showToast('Track deleted from database');
  };

  const handleBroadcastNotification = (title: string, message: string, trackId?: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      trackId,
      timestamp: 'Just now',
      read: false,
      type: 'release',
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    StorageService.saveNotifications(updated);
    showToast(`📢 Announcement sent: ${title}`);
  };

  // Notifications Handlers
  const handleMarkAllNotifsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const handleClearNotifs = () => {
    setNotifications([]);
    StorageService.saveNotifications([]);
  };

  const handleSelectTrackNotification = (trackId: string) => {
    const found = tracks.find((t) => t.id === trackId);
    if (found) {
      setDetailModalTrack(found);
      handlePlayTrack(found);
    }
  };

  // Cloud Sync Handler
  const handleTriggerCloudSync = () => {
    const updatedInfo = {
      lastSynced: 'Just now',
      devicesCount: 2,
      status: 'synced' as const,
    };
    setCloudSyncInfo(updatedInfo);
    StorageService.updateCloudSync(updatedInfo);
    showToast('Playlists & favorites synced with cloud! ☁️');
  };

  // Filtered Tracks
  const filteredTracks = tracks.filter((t) => {
    // If in simulated offline mode, filter to only offline tracks unless browsing all
    if (isOfflineMode) {
      const isCached = offlineTracks.some((off) => off.trackId === t.id);
      if (!isCached) return false;
    }

    if (selectedCategorySlug && t.categorySlug !== selectedCategorySlug) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchArtist = t.originalArtist.toLowerCase().includes(q);
      const matchRemixer = t.remixer.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      return matchTitle || matchArtist || matchRemixer || matchCat;
    }

    return true;
  });

  const selectedCategoryObj = categories.find((c) => c.slug === selectedCategorySlug);
  const activeDownloadsCount = downloadTasks.filter((t) => t.status === 'downloading').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans pb-28 md:pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        user={user}
        categories={categories}
        searchQuery={searchQuery}
        selectedCategorySlug={selectedCategorySlug}
        onSearchChange={(q) => setSearchQuery(q)}
        onCategoryFilterChange={(slug) => setSelectedCategorySlug(slug)}
        unreadNotifsCount={unreadNotifsCount}
        activeDownloadsCount={activeDownloadsCount}
        isOfflineMode={isOfflineMode}
        cloudSyncStatus={cloudSyncInfo.status}
        onToggleOfflineMode={() => {
          setIsOfflineMode(!isOfflineMode);
          showToast(
            !isOfflineMode
              ? 'Offline playback simulation activated! 📲'
              : 'Online connection restored 🌐'
          );
        }}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
        onOpenDownloadManager={() => setIsDownloadDrawerOpen(true)}
        onOpenCloudSync={() => setIsCloudSyncModalOpen(true)}
        onOpenPlaylists={() => {
          setSelectedTrackForPlaylist(null);
          setIsPlaylistModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminDashboard={() => setIsAdminModalOpen(true)}
        onHomeClick={() => {
          setSelectedCategorySlug('');
          setSearchQuery('');
        }}
      />

      {/* Offline Mode Banner Warning (if active) */}
      {isOfflineMode && (
        <div className="bg-amber-600 text-white text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center gap-2">
          <span>⚠️ SIMULATED OFFLINE MODE: Showing {offlineTracks.length} tracks cached in IndexedDB. Internet disconnected.</span>
          <button
            onClick={() => setIsOfflineMode(false)}
            className="underline text-amber-100 hover:text-white"
          >
            Turn Back Online
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-4 space-y-4 flex-1">
        {/* Notice Board & Quick Access */}
        <NoticeBoard
          onCategorySelect={(slug) => setSelectedCategorySlug(slug)}
          onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
        />

        {/* Directory Categorized Folders (Classic PHP Portal layout) */}
        {!searchQuery && !selectedCategorySlug && (
          <CategoryBrowser
            categories={categories}
            selectedCategorySlug={selectedCategorySlug}
            onSelectCategory={(slug) => setSelectedCategorySlug(slug)}
            totalTracks={tracks.length}
          />
        )}

        {/* Filter Breadcrumbs if Category or Search is selected */}
        {(selectedCategorySlug || searchQuery) && (
          <div className="bg-white border border-slate-200 rounded-md px-3.5 py-2 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">
                {selectedCategorySlug
                  ? `Category: ${selectedCategoryObj?.name}`
                  : `Search Results: "${searchQuery}"`}
              </span>
              <span className="text-slate-400">({filteredTracks.length} songs found)</span>
            </div>
            <button
              onClick={() => {
                setSelectedCategorySlug('');
                setSearchQuery('');
              }}
              className="text-amber-700 hover:text-amber-900 font-bold underline"
            >
              Back to All Categories
            </button>
          </div>
        )}

        {/* Tracks Table */}
        <TrackTable
          tracks={filteredTracks}
          currentTrackId={currentTrack?.id}
          isPlaying={isPlaying}
          likedTrackIds={likedTrackIds}
          offlineTrackIds={offlineTracks.map((i) => i.trackId)}
          activeCategoryName={selectedCategoryObj?.name}
          searchQuery={searchQuery}
          onPlayTrack={handlePlayTrack}
          onPauseTrack={handlePauseTrack}
          onOpenTrackDetail={(track) => setDetailModalTrack(track)}
          onStartDownload={handleStartDownload}
          onToggleLike={handleToggleLike}
          onOpenAddToPlaylist={(track) => {
            setSelectedTrackForPlaylist(track);
            setIsPlaylistModalOpen(true);
          }}
          onToggleOfflineSave={handleToggleOffline}
          onResetFilters={() => {
            setSelectedCategorySlug('');
            setSearchQuery('');
          }}
        />
      </main>

      {/* Floating Bottom Audio Player */}
      <AudioPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        onPlay={() => {
          if (currentTrack) handlePlayTrack(currentTrack);
        }}
        onPause={handlePauseTrack}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        onOpenTrackDetail={(track) => setDetailModalTrack(track)}
        onStartDownload={handleStartDownload}
        onOpenAddToPlaylist={(track) => {
          setSelectedTrackForPlaylist(track);
          setIsPlaylistModalOpen(true);
        }}
        onToggleLike={handleToggleLike}
        isLiked={currentTrack ? likedTrackIds.includes(currentTrack.id) : false}
      />

      {/* Mobile Bottom Thumb Navigation */}
      <MobileBottomNav
        onHomeClick={() => {
          setSelectedCategorySlug('');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCategories={() => {
          setSelectedCategorySlug('');
          setSearchQuery('');
          window.scrollTo({ top: 180, behavior: 'smooth' });
        }}
        onFocusSearch={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenOffline={() => setIsOfflineModalOpen(true)}
        onOpenDownloads={() => setIsDownloadDrawerOpen(true)}
        onOpenPlaylists={() => {
          setSelectedTrackForPlaylist(null);
          setIsPlaylistModalOpen(true);
        }}
        activeDownloadsCount={activeDownloadsCount}
      />

      {/* Modals */}
      {/* 1. Track Detail & Fast Download Page (matching uploaded screenshot) */}
      {detailModalTrack && (
        <TrackDetailModal
          track={detailModalTrack}
          isPlaying={isPlaying}
          isCurrentPlayingThis={currentTrack?.id === detailModalTrack.id && isPlaying}
          isLiked={likedTrackIds.includes(detailModalTrack.id)}
          isOfflineCached={offlineTracks.some((i) => i.trackId === detailModalTrack.id)}
          relatedTracks={tracks.filter(
            (t) =>
              t.categorySlug === detailModalTrack.categorySlug &&
              t.id !== detailModalTrack.id
          )}
          onClose={() => setDetailModalTrack(null)}
          onPlayTrack={handlePlayTrack}
          onPauseTrack={handlePauseTrack}
          onStartDownload={handleStartDownload}
          onToggleLike={handleToggleLike}
          onToggleOffline={handleToggleOffline}
          onOpenAddToPlaylist={(track) => {
            setSelectedTrackForPlaylist(track);
            setIsPlaylistModalOpen(true);
          }}
          onSelectRelatedTrack={(rTrack) => setDetailModalTrack(rTrack)}
        />
      )}

      {/* 2. Download Manager Drawer */}
      <DownloadManagerDrawer
        tasks={downloadTasks}
        isOpen={isDownloadDrawerOpen}
        onClose={() => setIsDownloadDrawerOpen(false)}
        onPauseTask={handlePauseDownloadTask}
        onResumeTask={handleResumeDownloadTask}
        onCancelTask={handleCancelDownloadTask}
        onClearCompleted={handleClearCompletedDownloads}
        onPlayDownloadedTrack={(trackId) => {
          const found = tracks.find((t) => t.id === trackId);
          if (found) handlePlayTrack(found);
        }}
      />

      {/* 3. Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => {
          setIsPlaylistModalOpen(false);
          setSelectedTrackForPlaylist(null);
        }}
        playlists={playlists}
        allTracks={tracks}
        onPlayPlaylist={handlePlayPlaylist}
        onCreatePlaylist={handleCreatePlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
        selectedTrackToAdd={selectedTrackForPlaylist}
        onAddTrackToPlaylist={handleAddTrackToPlaylist}
      />

      {/* 4. Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        tracks={tracks}
        categories={categories}
        onAddTrack={handleAddTrackAdmin}
        onUpdateTrack={handleUpdateTrackAdmin}
        onDeleteTrack={handleDeleteTrackAdmin}
        onBroadcastNotification={handleBroadcastNotification}
      />

      {/* 5. Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotifsRead}
        onClearNotifications={handleClearNotifs}
        onSelectTrackNotification={handleSelectTrackNotification}
      />

      {/* 6. Offline Library Modal */}
      <OfflineLibraryModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        cachedTracks={offlineTracks}
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={() => setIsOfflineMode(!isOfflineMode)}
        onPlayTrack={handlePlayTrack}
        onRemoveCachedTrack={handleRemoveCachedTrack}
      />

      {/* 7. Cloud Sync Modal */}
      <CloudSyncModal
        isOpen={isCloudSyncModalOpen}
        onClose={() => setIsCloudSyncModalOpen(false)}
        lastSynced={cloudSyncInfo.lastSynced}
        devicesCount={cloudSyncInfo.devicesCount}
        playlistsCount={playlists.length}
        favoritesCount={likedTrackIds.length}
        downloadsCount={StorageService.getDownloadHistory().length}
        onTriggerSync={handleTriggerCloudSync}
      />

      {/* 8. User Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onLogin={(newUser) => {
          setUser(newUser);
          StorageService.saveUser(newUser);
          showToast(`Logged in as ${newUser.name} (${newUser.role})`);
        }}
        onLogout={() => {
          setUser({
            id: 'usr-guest',
            name: 'Guest Listener',
            email: 'guest@oyedj.com',
            role: 'user',
            avatarBg: 'bg-slate-600',
            joinedDate: 'Just now',
            totalDownloads: 0,
          });
          showToast('Signed out');
        }}
      />

      {/* Portal Footer */}
      <Footer
        categories={categories}
        onSelectCategory={(slug) => {
          setSelectedCategorySlug(slug);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
