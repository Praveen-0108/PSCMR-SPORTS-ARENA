import React, { useState } from 'react';
import { Tournament, Match, Role, SportCategory } from '../types/index.ts';
import { Trophy, Plus, FileDown, GitFork, Users, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { downloadFixturePDF } from '../lib/pdfGenerator.ts';

interface TournamentsViewProps {
  tournaments: Tournament[];
  matches: Match[];
  userRole?: Role;
  onOpenCreateModal: () => void;
  onOpenRegisterTeamModal: (tournament: Tournament) => void;
  onGenerateFixtures: (tournamentId: string) => Promise<void>;
  onViewBracket: (tournament: Tournament) => void;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({
  tournaments,
  matches,
  userRole,
  onOpenCreateModal,
  onOpenRegisterTeamModal,
  onGenerateFixtures,
  onViewBracket,
}) => {
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const sportsList: ('All' | SportCategory)[] = [
    'All',
    'Cricket',
    'Badminton',
    'Football',
    'Volleyball',
    'Kabaddi',
    'Chess',
    'Basketball',
    'Table Tennis',
  ];

  const filteredTournaments = tournaments.filter((t) => {
    if (selectedSport !== 'All' && t.sport !== selectedSport) return false;
    if (selectedStatus !== 'All' && t.status !== selectedStatus) return false;
    return true;
  });

  const canManage = userRole === 'admin' || userRole === 'coordinator';

  const handleGenerate = async (tournamentId: string) => {
    try {
      setGeneratingId(tournamentId);
      await onGenerateFixtures(tournamentId);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDownloadPDF = (tournament: Tournament) => {
    const tournamentMatches = matches.filter((m) => m.tournamentId === tournament.id);
    downloadFixturePDF(tournament, tournamentMatches);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-tight">
            Championship Tournaments
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and participate in inter-department college sporting events at PSCMRCET
          </p>
        </div>

        {canManage && (
          <button
            onClick={onOpenCreateModal}
            className="self-start md:self-auto px-4 py-2.5 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tournament</span>
          </button>
        )}
      </div>

      {/* Sport Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sportsList.map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedSport === sport
                ? 'bg-emerald-500/15 text-[#00e599] border border-emerald-500/30'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No tournaments found</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting a different sport or status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTournaments.map((tournament) => {
            const tournamentMatches = matches.filter((m) => m.tournamentId === tournament.id);

            return (
              <div
                key={tournament.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
              >
                {/* Banner Header Image (if present) */}
                {tournament.bannerImage && (
                  <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={tournament.bannerImage}
                      alt={tournament.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-[0.65]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b142c] via-[#0b142c]/50 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#050b18]/80 backdrop-blur-md text-[#00e599] border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
                        {tournament.sport}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700 text-[11px] font-medium">
                        {tournament.genderCategory} · {tournament.format}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-lg font-bold text-white font-display leading-snug drop-shadow-md">
                        {tournament.title}
                      </h3>
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  {!tournament.bannerImage && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold text-[#00e599] uppercase tracking-wider">
                          {tournament.sport}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11px] text-slate-400">{tournament.format}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11px] text-slate-400">{tournament.genderCategory}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white font-display">{tournament.title}</h3>
                    </div>
                  )}

                  {/* Details strip */}
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{tournament.startDate} to {tournament.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{tournament.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{tournament.currentTeamsCount || 0} / {tournament.maxTeams} Teams</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500/80" />
                      <span className="text-amber-400/90 text-[11px]">Due: {tournament.registrationDeadline}</span>
                    </div>
                  </div>

                  {/* Rules preview */}
                  {tournament.rules && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                      {tournament.rules}
                    </p>
                  )}

                  {/* Participating Branches */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Participating Departments:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tournament.participatingDepartments.map((dept) => (
                        <span
                          key={dept}
                          className="px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700/60 text-[11px] font-semibold text-slate-200"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Winner showcase if completed */}
                  {tournament.winnerDepartment && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <div>
                          <span className="font-bold text-amber-300 block">CHAMPION: Department of {tournament.winnerDepartment}</span>
                          {tournament.runnerUpDepartment && (
                            <span className="text-[11px] text-slate-400">Runner-Up: Dept of {tournament.runnerUpDepartment}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Tournament Won</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* View Bracket */}
                      <button
                        onClick={() => onViewBracket(tournament)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <GitFork className="w-3.5 h-3.5 text-[#00e599]" />
                        <span>View Bracket</span>
                      </button>

                      {/* PDF Fixture Sheet */}
                      <button
                        onClick={() => handleDownloadPDF(tournament)}
                        title="Download official PDF fixture sheet"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800 cursor-pointer"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {canManage && (
                        <button
                          onClick={() => handleGenerate(tournament.id)}
                          disabled={generatingId === tournament.id}
                          className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <GitFork className="w-3.5 h-3.5 text-blue-400" />
                          <span>{generatingId === tournament.id ? 'Generating...' : 'Auto Fixtures'}</span>
                        </button>
                      )}

                      {tournament.status !== 'Completed' && (
                        <button
                          onClick={() => onOpenRegisterTeamModal(tournament)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Register Team</span>
                        </button>
                      )}
                    </div>
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
