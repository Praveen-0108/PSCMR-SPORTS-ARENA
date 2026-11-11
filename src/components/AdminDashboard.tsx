import React, { useState } from 'react';
import { DashboardStats, Tournament, Team, Match, Role, User } from '../types/index.ts';
import {
  Users,
  Trophy,
  Calendar,
  Activity,
  Plus,
  RefreshCw,
  Bell,
  Clock,
  ArrowUpRight,
  Shield,
  Award,
} from 'lucide-react';

interface AdminDashboardProps {
  stats: DashboardStats | null;
  currentUser: User | null;
  tournaments: Tournament[];
  teams: Team[];
  matches: Match[];
  onOpenCreateTournament: () => void;
  onOpenCreateTeam: () => void;
  onOpenPostAnnouncement: () => void;
  onResetDemo: () => Promise<void>;
  onOpenScoreModal: (match: Match) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  currentUser,
  tournaments,
  teams,
  matches,
  onOpenCreateTournament,
  onOpenCreateTeam,
  onOpenPostAnnouncement,
  onResetDemo,
  onOpenScoreModal,
}) => {
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset all sports database collections back to the official demo seed?')) {
      setResetting(true);
      try {
        await onResetDemo();
      } finally {
        setResetting(false);
      }
    }
  };

  const recentMatches = matches.slice(0, 5);
  const recentTeams = teams.slice(-4).reverse();

  return (
    <div className="space-y-8">
      {/* Dashboard Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>ROLE: {currentUser?.role?.toUpperCase()} CONTROL CONSOLE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-tight mt-0.5">
            Sports Administration Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Welcome back, {currentUser?.name}. Overall management of college tournaments, schedules, and rosters.
          </p>
        </div>

        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCreateTournament}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Tournament</span>
          </button>

          <button
            onClick={onOpenCreateTeam}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5 text-[#00e599]" />
            <span>Register Team</span>
          </button>

          <button
            onClick={onOpenPostAnnouncement}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Post Notice</span>
          </button>

          <button
            onClick={handleReset}
            disabled={resetting}
            title="Reset database to initial clean seed state"
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin text-[#00e599]' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Athletes */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Student Athletes</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono tabular-nums">
            {stats?.totalStudents || 150}
          </p>
          <span className="text-[11px] text-slate-500 block">Across 9 engineering branches</span>
        </div>

        {/* Total Teams */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Registered Teams</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-[#00e599] font-mono tabular-nums">
            {stats?.totalTeams || teams.length}
          </p>
          <span className="text-[11px] text-slate-500 block">Verified squad rosters</span>
        </div>

        {/* Tournaments */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Championships</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-300 font-mono tabular-nums">
            {stats?.totalTournaments || tournaments.length}
          </p>
          <span className="text-[11px] text-slate-500 block">8 Sports disciplines</span>
        </div>

        {/* Matches */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Matches Total</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-purple-300 font-mono tabular-nums">
            {stats?.totalMatches || matches.length}
          </p>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-rose-400 font-semibold">{stats?.liveMatchesCount || 0} Live</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">{stats?.upcomingMatchesCount || 0} Upcoming</span>
          </div>
        </div>
      </div>

      {/* Department Participation & Performance Breakdown Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Department Participation & Points Share
            </h3>
            <p className="text-xs text-slate-400">Overall ranking points earned across all completed matches</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Max 60 pts</span>
        </div>

        <div className="space-y-3.5">
          {stats?.departmentStats?.map((dept) => {
            const maxPoints = 60;
            const percentage = Math.min(100, Math.round((dept.points / maxPoints) * 100));

            return (
              <div key={dept.department} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-14 font-bold text-slate-200">{dept.department}</span>
                    <span className="text-slate-500 text-[11px]">{dept.teams} Teams registered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      🥇{dept.gold} 🥈{dept.silver} 🥉{dept.bronze}
                    </span>
                    <span className="font-mono font-bold text-white tabular-nums w-12 text-right">
                      {dept.points} pts
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-[#00e599] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Recent Match Logs & Squad Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display">
              Recent Match Schedule & Results
            </h3>
            <span className="text-xs text-slate-400">Active</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentMatches.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {m.teamA.department} vs {m.teamB.department}
                    </span>
                    <span className="text-[10px] text-slate-400">({m.sport})</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">{m.round} · {m.scheduledDate}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      m.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : m.status === 'Live'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {m.status}
                  </span>

                  <button
                    onClick={() => onOpenScoreModal(m)}
                    className="p-1 text-slate-400 hover:text-[#00e599] rounded"
                    title="Edit score"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Registered Squads */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display">
              Recently Registered Squads
            </h3>
            <span className="text-xs text-slate-400">Latest</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentTeams.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                      {t.department}
                    </span>
                    <span className="font-semibold text-white">{t.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Captain: {t.captain.name} ({t.captain.rollNo})
                  </span>
                </div>

                <span className="text-[11px] text-emerald-400 font-medium">
                  {t.sport} · {t.genderCategory}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
