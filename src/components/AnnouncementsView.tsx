import React, { useState } from 'react';
import { Announcement, Role } from '../types/index.ts';
import { Bell, Pin, Plus, Trash2, Calendar, User, X, Check } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  userRole?: Role;
  onPostAnnouncement: (data: { title: string; content: string; category: any; pinned: boolean }) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  userRole,
  onPostAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Notice');
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  const canManage = userRole === 'admin' || userRole === 'coordinator';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    try {
      await onPostAnnouncement({ title, content, category, pinned });
      setTitle('');
      setContent('');
      setPinned(false);
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wider uppercase mb-1">
            <Bell className="w-3.5 h-3.5" />
            <span>OFFICIAL PHYSICAL EDUCATION CIRCULARS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-tight">
            Sports Arena Announcements & Notices
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official notices regarding draws, venue updates, equipment rules, and match trials
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Post Circular</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`glass-panel rounded-xl p-5 border transition-all ${
              ann.pinned
                ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-[#0b142c] to-[#0b142c]'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-4 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                {ann.pinned && (
                  <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    <span>PINNED NOTICE</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                  {ann.category}
                </span>
                <span className="text-slate-500 text-xs">·</span>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{ann.date}</span>
                </div>
              </div>

              {canManage && (
                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded"
                  title="Delete circular"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <h3 className="text-base font-bold text-white font-display mt-1">{ann.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-400">
              <User className="w-3 h-3 text-slate-500" />
              <span>Issued by: <strong className="text-slate-300">{ann.author}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b142c] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-tight">
                Post Sports Arena Circular
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Volleyball Court Maintenance & Draw Announcement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                  >
                    <option value="Notice">Notice</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Schedule">Schedule</option>
                    <option value="Registration">Registration</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-[#00e599] focus:ring-0"
                    />
                    <span>Pin to top of feed</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  placeholder="Full text of the sports announcement..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'Posting...' : 'Publish Circular'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
