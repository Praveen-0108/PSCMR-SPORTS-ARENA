import React, { useState } from 'react';
import { Match, Role } from '../types/index.ts';
import { Calendar, MapPin, Award, Edit3, Clock, CheckCircle2 } from 'lucide-react';

interface LiveMatchesProps {
  matches: Match[];
  userRole?: Role;
  onOpenScoreModal: (match: Match) => void;
}

export const LiveMatches: React.FC<LiveMatchesProps> = ({
  matches,
  userRole,
  onOpenScoreModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'Live' | 'Scheduled' | 'Completed'>('all');

  const filteredMatches = matches.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const canEditScore = userRole === 'admin' || userRole === 'coordinator';

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-tight">
            Match Fixtures & Live Arena
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time score updates, match schedules, and official college results
          </p>
        </div>

        {/* Segmented Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-lg self-start sm:self-auto">
          {(['all', 'Live', 'Scheduled', 'Completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filter === status
                  ? 'bg-[#00e599] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'All Matches' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Matches */}
      {filteredMatches.length === 0 ? (
        <div className="glass-panel rounded-xl p-12 text-center border border-slate-800">
          <Clock className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No matches found</h3>
          <p className="text-xs text-slate-400 mt-1">There are currently no matches under this category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.map((m) => {
            const isLive = m.status === 'Live';
            const isCompleted = m.status === 'Completed';

            return (
              <div
                key={m.id}
                className="glass-panel glass-panel-hover rounded-xl p-5 border border-slate-800 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Status Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <span className="flex items-center gap-1.5 text-rose-400 font-bold tracking-wider uppercase text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        LIVE NOW
                      </span>
                    ) : isCompleted ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-medium">Scheduled</span>
                    )}
                  </div>
                  <span className="text-slate-400 font-medium text-[11px] truncate max-w-[150px]">
                    {m.sport} · {m.round}
                  </span>
                </div>

                {/* Score Section */}
                <div className="py-4 space-y-3 flex-1">
                  {/* Team A */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 shrink-0">
                        {m.teamA.department}
                      </span>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${m.winnerDepartment === m.teamA.department ? 'text-[#00e599]' : 'text-slate-100'}`}>
                          {m.teamA.name}
                        </p>
                        {m.teamA.detail && (
                          <p className="text-[11px] text-slate-400 truncate">{m.teamA.detail}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-base font-bold text-white font-mono tabular-nums shrink-0 ml-2">
                      {m.teamA.score || '—'}
                    </span>
                  </div>

                  {/* Team B */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 shrink-0">
                        {m.teamB.department}
                      </span>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${m.winnerDepartment === m.teamB.department ? 'text-[#00e599]' : 'text-slate-100'}`}>
                          {m.teamB.name}
                        </p>
                        {m.teamB.detail && (
                          <p className="text-[11px] text-slate-400 truncate">{m.teamB.detail}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-base font-bold text-white font-mono tabular-nums shrink-0 ml-2">
                      {m.teamB.score || '—'}
                    </span>
                  </div>

                  {/* Player of the Match (if completed) */}
                  {m.playerOfTheMatch && (
                    <div className="mt-3 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-2 text-xs">
                      <Award className="w-3.5 h-3.5 text-[#00e599] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-semibold text-emerald-400 block truncate">
                          Player of the Match: {m.playerOfTheMatch.name} ({m.playerOfTheMatch.department})
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {m.playerOfTheMatch.statsSnippet}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer details & Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate text-[11px]">{m.venue}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-medium text-slate-300">
                      {m.scheduledDate.split('-').slice(1).join('/')} {m.scheduledTime}
                    </span>

                    {canEditScore && (
                      <button
                        onClick={() => onOpenScoreModal(m)}
                        title="Update Live Score or Winner"
                        className="p-1.5 text-slate-400 hover:text-[#00e599] hover:bg-emerald-500/10 rounded transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
