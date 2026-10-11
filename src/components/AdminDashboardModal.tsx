import React, { useState } from 'react';
import {
  X,
  Shield,
  Upload,
  Edit,
  Trash2,
  Plus,
  Radio,
  Bell,
  HardDrive,
  BarChart3,
  Check,
  Disc,
} from 'lucide-react';
import { Track, Category, AudioQuality } from '../types/music';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  categories: Category[];
  onAddTrack: (track: Omit<Track, 'id'>, broadcastRelease: boolean) => void;
  onUpdateTrack: (track: Track) => void;
  onDeleteTrack: (trackId: string) => void;
  onBroadcastNotification: (title: string, message: string, trackId?: string) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  tracks,
  categories,
  onAddTrack,
  onUpdateTrack,
  onDeleteTrack,
  onBroadcastNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'broadcast' | 'stats'>('upload');

  // New Track Form State
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newRemixer, setNewRemixer] = useState('Dj Surendra Ayodhya');
  const [newCategorySlug, setNewCategorySlug] = useState('bhojpuri-dj');
  const [newDuration, setNewDuration] = useState(240);
  const [newBpm, setNewBpm] = useState(132);
  const [newBitrate, setNewBitrate] = useState('320 Kbps');
  const [newSizeMb, setNewSizeMb] = useState(9.2);
  const [newPreset, setNewPreset] = useState<Track['audioPreset']>('bhojpuri_beat');
  const [broadcastOnUpload, setBroadcastOnUpload] = useState(true);

  // Edit Track State
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  // Broadcast Notification State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSelectedTrack, setNotifSelectedTrack] = useState('');

  if (!isOpen) return null;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const matchedCategory = categories.find((c) => c.slug === newCategorySlug);

    const trackData: Omit<Track, 'id'> = {
      title: newTitle.trim(),
      originalArtist: newArtist.trim() || 'Various Artists',
      remixer: newRemixer.trim() || 'Dj Surendra',
      category: matchedCategory?.name || 'Bhojpuri DJ Remix Songs (2026)',
      categorySlug: newCategorySlug,
      duration: Number(newDuration),
      releaseYear: 2026,
      bpm: Number(newBpm),
      bitrate: newBitrate,
      sizeMb: Number(newSizeMb),
      downloadCount: 0,
      addedDate: new Date().toISOString().split('T')[0],
      featured: true,
      isTrending: true,
      audioPreset: newPreset,
      description: `Official ${newBitrate} Master DJ Remix by ${newRemixer}`,
    };

    onAddTrack(trackData, broadcastOnUpload);

    // Reset Form
    setNewTitle('');
    setNewArtist('');
    setActiveTab('manage');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;
    onUpdateTrack(editingTrack);
    setEditingTrack(null);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim()) return;
    onBroadcastNotification(
      notifTitle.trim(),
      notifMessage.trim() || 'Check out this new release on OyeDjSurendra!',
      notifSelectedTrack || undefined
    );
    setNotifTitle('');
    setNotifMessage('');
    alert('Release notification successfully broadcast to all users!');
  };

  const totalDownloads = tracks.reduce((acc, t) => acc + t.downloadCount, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">OyeDj Admin Portal Management</h3>
              <p className="text-[10px] text-slate-400">Database & Audio Metadata Controller</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'upload'
                ? 'border-amber-600 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Song</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manage'
                ? 'border-amber-600 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Manage Songs ({tracks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'broadcast'
                ? 'border-amber-600 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Broadcast Releases</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-amber-600 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Portal Analytics</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* 1. Upload New Song Tab */}
          {activeTab === 'upload' && (
            <form onSubmit={handleUploadSubmit} className="max-w-2xl mx-auto bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="font-bold text-sm text-slate-900">Upload & Publish New Song</h4>
                <p className="text-xs text-slate-500">
                  Adds the song to the live database, generates multi-bitrates, and indexes for instant search.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Song Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamariya Kare Lapa Lap (Hard Bass Mix)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DJ / Remixer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dj Surendra Ayodhya"
                    value={newRemixer}
                    onChange={(e) => setNewRemixer(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Singer / Artist</label>
                  <input
                    type="text"
                    placeholder="e.g. Manoj Tiwari, Pawan Singh"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Music Category</label>
                  <select
                    value={newCategorySlug}
                    onChange={(e) => setNewCategorySlug(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tempo (BPM)</label>
                  <input
                    type="number"
                    value={newBpm}
                    onChange={(e) => setNewBpm(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Master Bitrate</label>
                  <select
                    value={newBitrate}
                    onChange={(e) => setNewBitrate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="320 Kbps">320 Kbps (Studio HD)</option>
                    <option value="192 Kbps">192 Kbps (Standard)</option>
                    <option value="128 Kbps">128 Kbps (Compressed)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">File Size (MB)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSizeMb}
                    onChange={(e) => setNewSizeMb(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Audio Synthesis Style Preset</label>
                  <select
                    value={newPreset}
                    onChange={(e) => setNewPreset(e.target.value as Track['audioPreset'])}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="bhojpuri_beat">Bhojpuri Hard Dholki & Bass Drop</option>
                    <option value="bollywood_dholki">Bollywood 90s Groove & Clavinet</option>
                    <option value="haryanvi_bass">Haryanvi Heavy Subwoofer 35Hz</option>
                    <option value="punjabi_dhol">Punjabi Acoustic Dhol & Electro Bhangra</option>
                    <option value="bhakti_special">Devotional / Festive Pachra Bells</option>
                    <option value="club_edm">EDM Melbourne Bounce / Horn Drop</option>
                    <option value="ringtone">Mobile 30s High-Gain Call Cut</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="checkbox"
                  id="broadcastCheck"
                  checked={broadcastOnUpload}
                  onChange={(e) => setBroadcastOnUpload(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="broadcastCheck" className="text-xs text-slate-700 font-medium">
                  Immediately broadcast new release notification to all listening users!
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish Song to Portal</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. Manage Existing Songs Tab */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">
                  Manage Song Metadata ({tracks.length} Tracks in Database)
                </h4>
              </div>

              {/* Edit Modal (if active) */}
              {editingTrack && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-xs text-amber-900">Edit Track: {editingTrack.title}</h5>
                    <button
                      onClick={() => setEditingTrack(null)}
                      className="text-amber-800 hover:text-amber-950 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Title</label>
                      <input
                        type="text"
                        value={editingTrack.title}
                        onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">DJ Remixer</label>
                      <input
                        type="text"
                        value={editingTrack.remixer}
                        onChange={(e) => setEditingTrack({ ...editingTrack, remixer: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Singer / Artist</label>
                      <input
                        type="text"
                        value={editingTrack.originalArtist}
                        onChange={(e) => setEditingTrack({ ...editingTrack, originalArtist: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Downloads / Hits</label>
                      <input
                        type="number"
                        value={editingTrack.downloadCount}
                        onChange={(e) => setEditingTrack({ ...editingTrack, downloadCount: Number(e.target.value) })}
                        className="w-full p-2 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingTrack(null)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded font-medium text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-slate-900 text-white rounded font-bold text-xs"
                      >
                        Save Metadata Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tracks Table */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="px-3 py-2.5 text-left">Track Title</th>
                      <th className="px-3 py-2.5 text-left hidden sm:table-cell">DJ Remixer</th>
                      <th className="px-3 py-2.5 text-left hidden md:table-cell">Category</th>
                      <th className="px-3 py-2.5 text-left">Hits</th>
                      <th className="px-3 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tracks.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-bold text-slate-900 max-w-[200px] truncate">
                          {t.title}
                        </td>
                        <td className="px-3 py-2 text-amber-700 font-medium hidden sm:table-cell">
                          {t.remixer}
                        </td>
                        <td className="px-3 py-2 text-slate-500 hidden md:table-cell truncate max-w-[150px]">
                          {t.category}
                        </td>
                        <td className="px-3 py-2 font-mono tabular-nums text-slate-700">
                          {t.downloadCount.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingTrack(t)}
                              className="p-1 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded"
                              title="Edit metadata"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${t.title}"?`)) {
                                  onDeleteTrack(t.id);
                                }
                              }}
                              className="p-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete track"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Broadcast Releases Tab */}
          {activeTab === 'broadcast' && (
            <div className="max-w-xl mx-auto bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>Broadcast New Release Announcement</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Sends an immediate notification to all active users with a direct jump link to the audio file.
                </p>
              </div>

              <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Notification Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 🔥 New Release: Pawan Singh - Lal Ghaghra (DJ Surendra)"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Announcement Message *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. The official 320 Kbps roadshow club mix is now available for download!"
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attach Track (Optional)</label>
                  <select
                    value={notifSelectedTrack}
                    onChange={(e) => setNotifSelectedTrack(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="">No specific track link</option>
                    {tracks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.remixer})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Announcement</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. Portal Analytics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Total Tracks</span>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{tracks.length}</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Total Hits</span>
                  <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
                    {totalDownloads.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Active CDN Nodes</span>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">12 Nodes</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Bandwidth Saved</span>
                  <p className="text-xl sm:text-2xl font-black text-sky-600 mt-1">4.2 TB</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs text-xs space-y-2">
                <h5 className="font-bold text-slate-800">Server & Database Health</h5>
                <p className="text-slate-600">
                  Audio storage cache is active with high throughput edge nodes. Offline database IndexedDB synchronization is operating at 99.98% reliability.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
