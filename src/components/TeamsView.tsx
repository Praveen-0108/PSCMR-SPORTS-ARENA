import React, { useState } from 'react';
import { Team, Player, Tournament, Role, DepartmentCode, SportCategory } from '../types/index.ts';
import { Users, Plus, QrCode, Trash2, Edit2, Shield, Award, Search, Phone, Mail } from 'lucide-react';
import { generateQrCodeDataUrl } from '../lib/qrHelper.ts';

interface TeamsViewProps {
  teams: Team[];
  players: Player[];
  tournaments: Tournament[];
  userRole?: Role;
  onOpenTeamModal: () => void;
  onOpenPlayerModal: (team: Team, player?: Player) => void;
  onDeletePlayer: (playerId: string) => Promise<void>;
  onDeleteTeam: (teamId: string) => Promise<void>;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  players,
  tournaments,
  userRole,
  onOpenTeamModal,
  onOpenPlayerModal,
  onDeletePlayer,
  onDeleteTeam,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('teams');

  // QR Modal State
  const [qrModalData, setQrModalData] = useState<{ title: string; qrUrl: string } | null>(null);

  const departments: DepartmentCode[] = [
    'CSE',
    'ECE',
    'EEE',
    'CSM',
    'CAI',
    'AI & DS',
    'CSD',
    'IoT',
    'MBA',
  ];

  const sportsList: SportCategory[] = [
    'Cricket',
    'Badminton',
    'Football',
    'Volleyball',
    'Basketball',
    'Kabaddi',
    'Chess',
    'Table Tennis',
  ];

  const filteredTeams = teams.filter((t) => {
    if (selectedDept !== 'All' && t.department !== selectedDept) return false;
    if (selectedSport !== 'All' && t.sport !== selectedSport) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredPlayers = players.filter((p) => {
    if (selectedDept !== 'All' && p.department !== selectedDept) return false;
    if (selectedSport !== 'All' && p.sport !== selectedSport) return false;
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleShowQr = async (team: Team) => {
    const qrPayload = JSON.stringify({
      college: 'PSCMRCET',
      teamId: team.id,
      teamName: team.name,
      department: team.department,
      sport: team.sport,
      captain: team.captain.name,
      rollNo: team.captain.rollNo,
    });
    const url = await generateQrCodeDataUrl(qrPayload);
    setQrModalData({
      title: `${team.name} (${team.department}) Verification Pass`,
      qrUrl: url,
    });
  };

  const canEdit = userRole === 'admin' || userRole === 'coordinator' || userRole === 'student';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-tight">
            Teams & Player Rosters
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Department-wise student squads, captains, jersey rosters, and tournament passes
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'teams' ? 'bg-[#00e599] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Teams ({filteredTeams.length})
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'players' ? 'bg-[#00e599] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Players ({filteredPlayers.length})
            </button>
          </div>

          <button
            onClick={onOpenTeamModal}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Team</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'teams' ? 'Search team name...' : 'Search player name or roll number (e.g. 22HP1A0542)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00e599]"
            />
          </div>

          {/* Sport Selector */}
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#00e599]"
          >
            <option value="All">All Sports</option>
            {sportsList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Department Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedDept('All')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedDept === 'All'
                ? 'bg-[#00e599] text-slate-950'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Departments
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedDept === dept
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Teams Tab */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.length === 0 ? (
            <div className="col-span-full glass-panel rounded-xl p-12 text-center border border-slate-800">
              <Users className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-300">No teams registered</h4>
              <p className="text-xs text-slate-500 mt-1">Click "Create Team" to register a squad.</p>
            </div>
          ) : (
            filteredTeams.map((team) => {
              const teamPlayerList = players.filter((p) => p.teamId === team.id);

              return (
                <div
                  key={team.id}
                  className="glass-panel glass-panel-hover rounded-xl p-5 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Dept & Sport */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-xs">
                          {team.department}
                        </span>
                        <div>
                          <span className="text-[11px] font-bold text-[#00e599] uppercase tracking-wider block">
                            {team.sport}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {team.genderCategory} {team.subCategory ? `· ${team.subCategory}` : ''}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleShowQr(team)}
                        title="View Official Team QR Verification Pass"
                        className="p-1.5 text-slate-400 hover:text-[#00e599] bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Team Name */}
                    <div className="py-3">
                      <h3 className="text-base font-bold text-white font-display">{team.name}</h3>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {team.tournamentTitle || 'Tournament Participant'}
                      </p>
                    </div>

                    {/* Captain Information */}
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">Team Captain:</span>
                        <span className="font-semibold text-slate-200">{team.captain.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Roll Number:</span>
                        <span className="font-mono text-slate-300">{team.captain.rollNo}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Contact:</span>
                        <span className="text-slate-300">{team.captain.phone}</span>
                      </div>
                    </div>

                    {/* Quick Roster Count */}
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>Squad Strength:</span>
                      <span className="font-bold text-white font-mono tabular-nums">
                        {teamPlayerList.length} Players Registered
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenPlayerModal(team)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#00e599]" />
                      <span>Add Player</span>
                    </button>

                    {(userRole === 'admin' || userRole === 'coordinator') && (
                      <button
                        onClick={() => onDeleteTeam(team.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete team"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Players Tab */}
      {activeTab === 'players' && (
        <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Dept</th>
                  <th className="px-4 py-3">Sport</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Jersey #</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Matches</th>
                  <th className="px-4 py-3 text-right">MVP</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                      No players matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((player) => {
                    const team = teams.find((t) => t.id === player.teamId);

                    return (
                      <tr key={player.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
                              alt={player.name}
                              className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 object-cover"
                            />
                            <span className="font-semibold text-white">{player.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400">{player.rollNo}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-[10px]">
                            {player.department}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-emerald-400">{player.sport}</td>
                        <td className="px-4 py-3 text-slate-300">{team?.name || player.teamName || '—'}</td>
                        <td className="px-4 py-3 font-mono font-bold text-white tabular-nums">
                          #{player.jerseyNo}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{player.role}</td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-200">
                          {player.stats.matches}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-amber-400 font-semibold">
                          {player.stats.mvpCount}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {team && (
                              <button
                                onClick={() => onOpenPlayerModal(team, player)}
                                className="p-1 text-slate-400 hover:text-white rounded"
                                title="Edit player"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => onDeletePlayer(player.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 rounded"
                              title="Delete player"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Code Pass Modal */}
      {qrModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b142c] border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="text-base font-bold text-white font-display">{qrModalData.title}</h3>
            <div className="p-4 bg-white rounded-xl inline-block shadow-inner mx-auto">
              <img src={qrModalData.qrUrl} alt="Team QR Pass" className="w-48 h-48 mx-auto" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan this QR code at the match pavilion desk for instant squad verification and attendance recording.
            </p>
            <button
              onClick={() => setQrModalData(null)}
              className="w-full py-2 text-xs font-semibold text-slate-950 bg-[#00e599] rounded-lg hover:bg-[#00c985] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
