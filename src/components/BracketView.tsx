import React from 'react';
import { Tournament, Match, Role } from '../types/index.ts';
import { ArrowLeft, Trophy, Calendar, Award, Edit3, FileDown } from 'lucide-react';
import { downloadFixturePDF } from '../lib/pdfGenerator.ts';

interface BracketViewProps {
  tournament: Tournament;
  matches: Match[];
  userRole?: Role;
  onBack: () => void;
  onOpenScoreModal: (match: Match) => void;
}

export const BracketView: React.FC<BracketViewProps> = ({
  tournament,
  matches,
  userRole,
  onBack,
  onOpenScoreModal,
}) => {
  const tournamentMatches = matches.filter((m) => m.tournamentId === tournament.id);

  // Separate matches by round
  const quarterFinals = tournamentMatches.filter(
    (m) => m.round.toLowerCase().includes('quarter') || m.bracketNodeId === 1 || m.bracketNodeId === 2
  );
  const semiFinals = tournamentMatches.filter((m) => m.round.toLowerCase().includes('semi') || m.bracketNodeId === 3);
  const finals = tournamentMatches.filter((m) => m.round.toLowerCase().includes('final') && !m.round.toLowerCase().includes('semi') && !m.round.toLowerCase().includes('quarter'));

  // If matches aren't explicitly marked with rounds, distribute them into rounds
  const displayRounds = [
    { title: 'Quarter-Finals', matches: quarterFinals.length > 0 ? quarterFinals : tournamentMatches.slice(0, 2) },
    { title: 'Semi-Finals', matches: semiFinals.length > 0 ? semiFinals : tournamentMatches.slice(2, 4) },
    { title: 'Championship Final', matches: finals.length > 0 ? finals : tournamentMatches.slice(4, 5) },
  ];

  const canEdit = userRole === 'admin' || userRole === 'coordinator';

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              <span>{tournament.sport} Knockout Bracket</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{tournament.genderCategory}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              {tournament.title}
            </h2>
          </div>
        </div>

        <button
          onClick={() => downloadFixturePDF(tournament, tournamentMatches)}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FileDown className="w-4 h-4 text-[#00e599]" />
          <span>Download Fixture PDF</span>
        </button>
      </div>

      {tournamentMatches.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-display">No Fixtures Generated Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Once participating department teams are registered, the tournament coordinator can automatically generate the knockout bracket.
          </p>
        </div>
      ) : (
        /* Interactive Knockout Bracket Tree */
        <div className="overflow-x-auto pb-6">
          <div className="min-w-[850px] grid grid-cols-3 gap-8 items-center py-4">
            {displayRounds.map((col, colIdx) => (
              <div key={col.title} className="space-y-6">
                <div className="text-center pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-[#00e599] uppercase tracking-wider">
                    {col.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {col.matches.length} {col.matches.length === 1 ? 'Match' : 'Matches'}
                  </span>
                </div>

                <div className="space-y-6">
                  {col.matches.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                      Awaiting Round Progression
                    </div>
                  ) : (
                    col.matches.map((match) => {
                      const isTeamAWinner = match.winnerDepartment === match.teamA.department;
                      const isTeamBWinner = match.winnerDepartment === match.teamB.department;

                      return (
                        <div
                          key={match.id}
                          className="glass-panel rounded-xl p-4 border border-slate-800 shadow-lg relative group transition-all hover:border-slate-700"
                        >
                          {/* Round Info */}
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                            <span className="font-semibold">{match.round}</span>
                            <div className="flex items-center gap-2">
                              {match.status === 'Live' ? (
                                <span className="text-rose-400 font-bold uppercase text-[10px] animate-pulse">
                                  LIVE
                                </span>
                              ) : match.status === 'Completed' ? (
                                <span className="text-emerald-400 text-[10px]">Finished</span>
                              ) : (
                                <span className="text-slate-500 text-[10px]">{match.scheduledTime}</span>
                              )}

                              {canEdit && (
                                <button
                                  onClick={() => onOpenScoreModal(match)}
                                  className="text-slate-400 hover:text-[#00e599] transition-colors"
                                  title="Edit score"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Team A */}
                          <div
                            className={`p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                              isTeamAWinner
                                ? 'bg-emerald-500/10 border border-emerald-500/30 font-bold text-white'
                                : 'text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-5 h-5 rounded bg-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {match.teamA.department}
                              </span>
                              <span className="truncate">{match.teamA.name}</span>
                            </div>
                            <span className="font-mono tabular-nums text-slate-100 shrink-0 ml-2">
                              {match.teamA.score || '—'}
                            </span>
                          </div>

                          <div className="my-1.5 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                            VS
                          </div>

                          {/* Team B */}
                          <div
                            className={`p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                              isTeamBWinner
                                ? 'bg-emerald-500/10 border border-emerald-500/30 font-bold text-white'
                                : 'text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-5 h-5 rounded bg-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {match.teamB.department}
                              </span>
                              <span className="truncate">{match.teamB.name}</span>
                            </div>
                            <span className="font-mono tabular-nums text-slate-100 shrink-0 ml-2">
                              {match.teamB.score || '—'}
                            </span>
                          </div>

                          {/* Winner Snippet */}
                          {match.winnerDepartment && (
                            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                              <Trophy className="w-3 h-3 text-[#00e599]" />
                              <span>Advanced: Dept of {match.winnerDepartment}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
