import React, { useState } from 'react';
import { Team, Player } from '../types/index.ts';
import { X, Check, UserCheck } from 'lucide-react';

interface PlayerModalProps {
  team: Team;
  player?: Player;
  onClose: () => void;
  onSubmit: (playerData: any) => Promise<void>;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  team,
  player,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(player?.name || '');
  const [rollNo, setRollNo] = useState(player?.rollNo || '');
  const [jerseyNo, setJerseyNo] = useState(player?.jerseyNo?.toString() || '10');
  const [gender, setGender] = useState<'Male' | 'Female'>(player?.gender || 'Male');
  const [role, setRole] = useState(player?.role || 'Player');

  // Stats
  const [matches, setMatches] = useState(player?.stats.matches?.toString() || '0');
  const [mvpCount, setMvpCount] = useState(player?.stats.mvpCount?.toString() || '0');
  const [pointsOrRuns, setPointsOrRuns] = useState(player?.stats.pointsOrRuns?.toString() || '0');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(player);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rollNo) {
      setError('Player name and roll number are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        name,
        rollNo,
        department: team.department,
        sport: team.sport,
        teamId: team.id,
        teamName: team.name,
        gender,
        jerseyNo: parseInt(jerseyNo, 10) || 10,
        role,
        stats: {
          matches: parseInt(matches, 10) || 0,
          mvpCount: parseInt(mvpCount, 10) || 0,
          pointsOrRuns: parseInt(pointsOrRuns, 10) || 0,
          goalsOrWickets: 0,
        },
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save player details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b142c] border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-4 h-4 text-[#00e599]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display uppercase tracking-tight">
                {isEditing ? 'Edit Athlete Profile' : 'Add Squad Athlete'}
              </h3>
              <p className="text-xs text-slate-400">
                {team.name} ({team.department})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Student Athlete Name</label>
            <input
              type="text"
              placeholder="e.g. M. Pavan Kalyan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College Roll No</label>
              <input
                type="text"
                placeholder="22HP1A0501"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Jersey Number</label>
              <input
                type="number"
                placeholder="7"
                value={jerseyNo}
                onChange={(e) => setJerseyNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tactical Role</label>
              <input
                type="text"
                placeholder="e.g. Fast Bowler / Striker"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Matches</label>
              <input
                type="number"
                value={matches}
                onChange={(e) => setMatches(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">MVP Awards</label>
              <input
                type="number"
                value={mvpCount}
                onChange={(e) => setMvpCount(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Points/Runs</label>
              <input
                type="number"
                value={pointsOrRuns}
                onChange={(e) => setPointsOrRuns(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Player'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
