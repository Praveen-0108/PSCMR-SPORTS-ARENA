import React, { useState, useEffect } from 'react';
import {
  User,
  Department,
  Tournament,
  Team,
  Player,
  Match,
  Announcement,
  DashboardStats,
} from './types/index.ts';
import { api, authStorage } from './lib/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { LiveMatches } from './components/LiveMatches.tsx';
import { TournamentsView } from './components/TournamentsView.tsx';
import { BracketView } from './components/BracketView.tsx';
import { TeamsView } from './components/TeamsView.tsx';
import { LeaderboardView } from './components/LeaderboardView.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AnnouncementsView } from './components/AnnouncementsView.tsx';
import { SportsGallery } from './components/SportsGallery.tsx';
import { ScoreModal } from './components/ScoreModal.tsx';
import { TeamRegisterModal } from './components/TeamRegisterModal.tsx';
import { PlayerModal } from './components/PlayerModal.tsx';
import { CreateTournamentModal } from './components/CreateTournamentModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Footer } from './components/Footer.tsx';
import { Trophy, ArrowRight, Bell, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(authStorage.getUser());

  // Data State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [scoreModalMatch, setScoreModalMatch] = useState<Match | null>(null);
  const [teamModalTournament, setTeamModalTournament] = useState<Tournament | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState<boolean>(false);
  const [playerModalData, setPlayerModalData] = useState<{ team: Team; player?: Player } | null>(null);
  const [createTournamentModalOpen, setCreateTournamentModalOpen] = useState<boolean>(false);
  const [selectedBracketTournament, setSelectedBracketTournament] = useState<Tournament | null>(null);

  // Load all initial data from REST API
  const loadAllData = async () => {
    try {
      const [
        deptsData,
        tournsData,
        teamsData,
        playersData,
        matchesData,
        annData,
        statsData,
      ] = await Promise.all([
        api.departments.getAll(),
        api.tournaments.getAll(),
        api.teams.getAll(),
        api.players.getAll(),
        api.matches.getAll(),
        api.announcements.getAll(),
        api.stats.getDashboard(),
      ]);

      setDepartments(deptsData);
      setTournaments(tournsData);
      setTeams(teamsData);
      setPlayers(playersData);
      setMatches(matchesData);
      setAnnouncements(annData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching initial application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();

    // Verify token with backend
    if (authStorage.getToken()) {
      api.auth
        .getMe()
        .then((res) => setCurrentUser(res.user))
        .catch(() => {
          authStorage.clear();
          setCurrentUser(null);
        });
    }
  }, []);

  // Auth Handlers
  const handleLogin = async (email: string, pass: string) => {
    const res = await api.auth.login(email, pass);
    setCurrentUser(res.user);
  };

  const handleRegister = async (data: any) => {
    const res = await api.auth.register(data);
    setCurrentUser(res.user);
    loadAllData();
  };

  const handleLogout = () => {
    api.auth.logout();
    setCurrentUser(null);
    if (currentTab === 'dashboard') {
      setCurrentTab('home');
    }
  };

  // Tournament Handlers
  const handleCreateTournament = async (tournamentData: any) => {
    await api.tournaments.create(tournamentData);
    await loadAllData();
  };

  const handleGenerateFixtures = async (tournamentId: string) => {
    await api.tournaments.generateFixtures(tournamentId);
    await loadAllData();
  };

  // Team & Player Handlers
  const handleRegisterTeam = async (teamData: any) => {
    await api.teams.create(teamData);
    await loadAllData();
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Delete this team and its registered roster?')) {
      await api.teams.delete(teamId);
      await loadAllData();
    }
  };

  const handleSavePlayer = async (playerData: any) => {
    if (playerModalData?.player) {
      await api.players.update(playerModalData.player.id, playerData);
    } else {
      await api.players.create(playerData);
    }
    await loadAllData();
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (window.confirm('Remove this player from the squad roster?')) {
      await api.players.delete(playerId);
      await loadAllData();
    }
  };

  // Score Handlers
  const handleSaveScore = async (matchId: string, scoreData: any) => {
    await api.matches.updateScore(matchId, scoreData);
    await loadAllData();
  };

  // Announcements Handlers
  const handlePostAnnouncement = async (annData: any) => {
    await api.announcements.create(annData);
    await loadAllData();
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await api.announcements.delete(id);
    await loadAllData();
  };

  // Reset Demo
  const handleResetDemo = async () => {
    await api.resetDemo();
    await loadAllData();
  };

  const featuredMatch = matches.find((m) => m.status === 'Live') || matches[0];

  return (
    <div className="min-h-screen bg-[#050b18] text-slate-100 flex flex-col selection:bg-[#00e599] selection:text-slate-950 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'fixtures') {
            setSelectedBracketTournament(null);
          }
        }}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#00e599] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
              CONNECTING TO PSCMRCET ARENA SERVER...
            </p>
          </div>
        ) : (
          <>
            {/* TAB: HOME */}
            {currentTab === 'home' && (
              <div className="space-y-16 pb-16">
                {/* Hero Section */}
                <Hero
                  onExploreTournaments={() => setCurrentTab('tournaments')}
                  onRegisterTeam={() => {
                    setTeamModalTournament(tournaments[0] || null);
                    setTeamModalOpen(true);
                  }}
                  featuredMatch={featuredMatch}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                  {/* Live & Upcoming Matches Preview */}
                  <LiveMatches
                    matches={matches}
                    userRole={currentUser?.role}
                    onOpenScoreModal={(match) => setScoreModalMatch(match)}
                  />

                  {/* Department Leaderboard Preview */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-tight">
                          Top Department Standings
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                          Current race for the annual PSCMRCET Champion Trophy
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentTab('leaderboard')}
                        className="text-xs font-semibold text-[#00e599] hover:text-[#00c985] flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Full Leaderboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {departments.slice(0, 3).map((dept, index) => (
                        <div
                          key={dept.id}
                          className="glass-panel glass-panel-hover rounded-xl p-5 border border-slate-800 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-display font-black text-xl text-amber-400">
                              #{index + 1}
                            </span>
                            <div>
                              <h4 className="font-bold text-white text-sm">{dept.name}</h4>
                              <span className="text-[11px] text-slate-400">
                                🥇{dept.goldMedals} 🥈{dept.silverMedals} 🥉{dept.bronzeMedals} · {dept.matchesWon} Wins
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-black text-lg text-[#00e599] tabular-nums">
                            {dept.totalPoints} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sports Announcements & Notices Preview */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-tight">
                          Latest Sports Circulars
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                          Official notifications from the Department of Physical Education
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {announcements.slice(0, 2).map((ann) => (
                        <div
                          key={ann.id}
                          className="glass-panel rounded-xl p-5 border border-slate-800 space-y-2"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                              {ann.category}
                            </span>
                            <span className="text-slate-500">·</span>
                            <span className="text-slate-400 text-[11px]">{ann.date}</span>
                          </div>
                          <h4 className="font-bold text-white text-sm font-display">{ann.title}</h4>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {ann.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TOURNAMENTS */}
            {currentTab === 'tournaments' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <TournamentsView
                  tournaments={tournaments}
                  matches={matches}
                  userRole={currentUser?.role}
                  onOpenCreateModal={() => setCreateTournamentModalOpen(true)}
                  onOpenRegisterTeamModal={(tourn) => {
                    setTeamModalTournament(tourn);
                    setTeamModalOpen(true);
                  }}
                  onGenerateFixtures={handleGenerateFixtures}
                  onViewBracket={(tourn) => {
                    setSelectedBracketTournament(tourn);
                    setCurrentTab('fixtures');
                  }}
                />
              </div>
            )}

            {/* TAB: FIXTURES */}
            {currentTab === 'fixtures' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {selectedBracketTournament ? (
                  <BracketView
                    tournament={selectedBracketTournament}
                    matches={matches}
                    userRole={currentUser?.role}
                    onBack={() => setSelectedBracketTournament(null)}
                    onOpenScoreModal={(match) => setScoreModalMatch(match)}
                  />
                ) : (
                  <div className="space-y-8">
                    {/* Tournament Bracket Selector Strip */}
                    <div className="glass-panel rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block uppercase tracking-wider">
                          Knockout Tree Brackets
                        </span>
                        <span className="text-xs text-slate-400">
                          Select a tournament to inspect interactive tournament brackets
                        </span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {tournaments.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedBracketTournament(t)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-xs font-semibold text-slate-200 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {t.sport} Bracket
                          </button>
                        ))}
                      </div>
                    </div>

                    <LiveMatches
                      matches={matches}
                      userRole={currentUser?.role}
                      onOpenScoreModal={(match) => setScoreModalMatch(match)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB: TEAMS */}
            {currentTab === 'teams' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <TeamsView
                  teams={teams}
                  players={players}
                  tournaments={tournaments}
                  userRole={currentUser?.role}
                  onOpenTeamModal={() => {
                    setTeamModalTournament(tournaments[0] || null);
                    setTeamModalOpen(true);
                  }}
                  onOpenPlayerModal={(team, player) => {
                    setPlayerModalData({ team, player });
                  }}
                  onDeletePlayer={handleDeletePlayer}
                  onDeleteTeam={handleDeleteTeam}
                />
              </div>
            )}

            {/* TAB: LEADERBOARD */}
            {currentTab === 'leaderboard' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <LeaderboardView departments={departments} />
              </div>
            )}

            {/* TAB: GALLERY */}
            {currentTab === 'gallery' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <SportsGallery tournaments={tournaments} />
              </div>
            )}

            {/* TAB: DASHBOARD (ADMIN & COORDINATOR) */}
            {currentTab === 'dashboard' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <AdminDashboard
                  stats={stats}
                  currentUser={currentUser}
                  tournaments={tournaments}
                  teams={teams}
                  matches={matches}
                  onOpenCreateTournament={() => setCreateTournamentModalOpen(true)}
                  onOpenCreateTeam={() => {
                    setTeamModalTournament(tournaments[0] || null);
                    setTeamModalOpen(true);
                  }}
                  onOpenPostAnnouncement={() => setCurrentTab('home')}
                  onResetDemo={handleResetDemo}
                  onOpenScoreModal={(match) => setScoreModalMatch(match)}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setCurrentTab(tab)} />

      {/* Modals */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {scoreModalMatch && (
        <ScoreModal
          match={scoreModalMatch}
          onClose={() => setScoreModalMatch(null)}
          onSave={handleSaveScore}
        />
      )}

      {teamModalOpen && (
        <TeamRegisterModal
          tournaments={tournaments}
          defaultTournament={teamModalTournament}
          onClose={() => setTeamModalOpen(false)}
          onSubmit={handleRegisterTeam}
        />
      )}

      {playerModalData && (
        <PlayerModal
          team={playerModalData.team}
          player={playerModalData.player}
          onClose={() => setPlayerModalData(null)}
          onSubmit={handleSavePlayer}
        />
      )}

      {createTournamentModalOpen && (
        <CreateTournamentModal
          onClose={() => setCreateTournamentModalOpen(false)}
          onSubmit={handleCreateTournament}
        />
      )}
    </div>
  );
}
