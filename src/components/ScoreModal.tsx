import React, { useState } from 'react';
import { Match, DepartmentCode } from '../types/index.ts';
import { X, Check, Award, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScoreModalProps {
  match: Match | null;
  onClose: () => void;
  onSave: (matchId: string, data: any) => Promise<void>;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  match,
  onClose,
  onSave,
}) => {
  if (!match) return null;

  const [teamAScore, setTeamAScore] = useState(match.teamA.score || '');
  const [teamADetail, setTeamADetail] = useState(match.teamA.detail || '');
  const [teamBScore, setTeamBScore] = useState(match.teamB.score || '');
  const [teamBDetail, setTeamBDetail] = useState(match.teamB.detail || '');
  const [status, setStatus] = useState<Match['status']>(match.status);
  const [winnerTeamId, setWinnerTeamId] = useState(match.winnerId || '');

  const [pomName, setPomName] = useState(match.playerOfTheMatch?.name || '');
  const [pomDept, setPomDept] = useState<DepartmentCode>(match.playerOfTheMatch?.department || match.teamA.department);
  const [pomRollNo, setPomRollNo] = useState(match.playerOfTheMatch?.rollNo || '');
  const [pomSnippet, setPomSnippet] = useState(match.playerOfTheMatch?.statsSnippet || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const winnerDepartment =
        winnerTeamId === match.teamA.id
          ? match.teamA.department
          : winnerTeamId === match.teamB.id
          ? match.teamB.department
          : undefined;

      const playerOfTheMatch = pomName
        ? {
            name: pomName,
            department: pomDept,
            rollNo: pomRollNo,
            statsSnippet: pomSnippet || 'Outstanding game contribution',
          }
        : undefined;

      await onSave(match.id, {
        teamAScore,
        teamADetail,
        teamBScore,
        teamBDetail,
        status,
        winnerId: winnerTeamId || undefined,
        winnerDepartment,
        playerOfTheMatch,
      });

      if (status === 'Completed' && winnerDepartment) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00e599', '#3b82f6', '#f59e0b'],
        });
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update match score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b142c] border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white font-display uppercase tracking-tight">
              Update Match Score & Status
            </h3>
            <p className="text-xs text-slate-400">
              {match.sport} · {match.round} · {match.venue}
            </p>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Match Status
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Scheduled', 'Live', 'Completed', 'Postponed'] as const).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    status === st
                      ? 'bg-[#00e599] text-slate-950 border-[#00e599]'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Team Scores */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            {/* Team A */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase">
                  {match.teamA.name} ({match.teamA.department})
                </span>
                <span className="text-[11px] text-slate-400">Score & Breakdown</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="e.g. 178/5 or 21-18"
                  value={teamAScore}
                  onChange={(e) => setTeamAScore(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#00e599]"
                />
                <input
                  type="text"
                  placeholder="e.g. 20.0 ov or Game 1"
                  value={teamADetail}
                  onChange={(e) => setTeamADetail(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#00e599]"
                />
              </div>
            </div>

            {/* Team B */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase">
                  {match.teamB.name} ({match.teamB.department})
                </span>
                <span className="text-[11px] text-slate-400">Score & Breakdown</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="e.g. 154/9 or 18-21"
                  value={teamBScore}
                  onChange={(e) => setTeamBScore(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#00e599]"
                />
                <input
                  type="text"
                  placeholder="e.g. 20.0 ov or Game 2"
                  value={teamBDetail}
                  onChange={(e) => setTeamBDetail(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#00e599]"
                />
              </div>
            </div>
          </div>

          {/* Winner Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Declare Winner (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWinnerTeamId(winnerTeamId === match.teamA.id ? '' : match.teamA.id)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  winnerTeamId === match.teamA.id
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{match.teamA.department} Winner</span>
                  <span className="text-[11px] opacity-75">{match.teamA.name}</span>
                </div>
                {winnerTeamId === match.teamA.id && <Trophy className="w-4 h-4 text-blue-400" />}
              </button>

              <button
                type="button"
                onClick={() => setWinnerTeamId(winnerTeamId === match.teamB.id ? '' : match.teamB.id)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  winnerTeamId === match.teamB.id
                    ? 'bg-emerald-600/20 border-emerald-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{match.teamB.department} Winner</span>
                  <span className="text-[11px] opacity-75">{match.teamB.name}</span>
                </div>
                {winnerTeamId === match.teamB.id && <Trophy className="w-4 h-4 text-[#00e599]" />}
              </button>
            </div>
          </div>

          {/* Player of the Match Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Player of the Match (Award)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Student Player Name"
                value={pomName}
                onChange={(e) => setPomName(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              />
              <input
                type="text"
                placeholder="Roll No (e.g. 22HP1A0542)"
                value={pomRollNo}
                onChange={(e) => setPomRollNo(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              />
            </div>
            <input
              type="text"
              placeholder="Highlight Stat (e.g. 64 runs off 38 balls & 3 wickets)"
              value={pomSnippet}
              onChange={(e) => setPomSnippet(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save & Publish Score'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
