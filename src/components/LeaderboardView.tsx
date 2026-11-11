import React from 'react';
import { Department } from '../types/index.ts';
import { Trophy, Medal, Award, Flame, Info } from 'lucide-react';

interface LeaderboardViewProps {
  departments: Department[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ departments }) => {
  // Sort descending by totalPoints
  const sorted = [...departments].sort((a, b) => b.totalPoints - a.totalPoints);
  const topThree = sorted.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase mb-1">
          <Trophy className="w-3.5 h-3.5 text-[#00e599]" />
          <span>PSCMRCET OVERALL ATHLETIC CHAMPIONSHIP</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-tight">
          Department Leaderboard & Standings
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Cumulative branch points, verified medal tallies, and sports championship rankings
        </p>
      </div>

      {/* Top 3 Podium Showcase */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          {/* 2nd Place (Silver) */}
          <div className="order-2 md:order-1 glass-panel rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between relative overflow-hidden md:translate-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                2nd Place · Silver Podium
              </span>
              <div className="w-7 h-7 rounded-full bg-slate-300/10 border border-slate-300/30 flex items-center justify-center font-bold text-slate-300 text-xs">
                2
              </div>
            </div>

            <div className="py-5 text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xl font-display mx-auto">
                {topThree[1].code}
              </div>
              <h3 className="text-base font-bold text-white font-display">{topThree[1].name}</h3>
              <p className="text-3xl font-black text-white font-mono tabular-nums">
                {topThree[1].totalPoints} <span className="text-xs text-slate-400 font-sans font-normal">pts</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-around text-xs text-slate-300">
              <div className="text-center">
                <span className="font-bold text-amber-400 font-mono tabular-nums">{topThree[1].goldMedals}</span>
                <span className="block text-[10px] text-slate-500">Gold</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-slate-300 font-mono tabular-nums">{topThree[1].silverMedals}</span>
                <span className="block text-[10px] text-slate-500">Silver</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-amber-700 font-mono tabular-nums">{topThree[1].bronzeMedals}</span>
                <span className="block text-[10px] text-slate-500">Bronze</span>
              </div>
            </div>
          </div>

          {/* 1st Place (Gold Champion) */}
          <div className="order-1 md:order-2 glass-panel rounded-2xl p-7 border-2 border-amber-400/50 bg-gradient-to-b from-amber-500/10 via-[#0b142c] to-[#0b142c] flex flex-col justify-between relative shadow-xl shadow-amber-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
              <Trophy className="w-3 h-3 text-slate-950" />
              <span>OVERALL LEADER</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                1st Place · Gold Champion
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center font-black text-amber-300 text-sm">
                1
              </div>
            </div>

            <div className="py-6 text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center font-black text-amber-300 text-2xl font-display mx-auto shadow-lg shadow-amber-500/20">
                {topThree[0].code}
              </div>
              <h3 className="text-lg font-black text-white font-display">{topThree[0].name}</h3>
              <p className="text-4xl font-black text-amber-300 font-mono tabular-nums">
                {topThree[0].totalPoints} <span className="text-xs text-slate-400 font-sans font-normal">pts</span>
              </p>
              <span className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>{topThree[0].matchesWon} Wins from {topThree[0].matchesPlayed} Matches</span>
              </span>
            </div>

            <div className="pt-3 border-t border-amber-400/20 flex items-center justify-around text-xs text-slate-200">
              <div className="text-center">
                <span className="font-bold text-amber-300 font-mono text-sm tabular-nums">{topThree[0].goldMedals}</span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Gold</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-slate-200 font-mono text-sm tabular-nums">{topThree[0].silverMedals}</span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Silver</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-amber-600 font-mono text-sm tabular-nums">{topThree[0].bronzeMedals}</span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Bronze</span>
              </div>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="order-3 glass-panel rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between relative overflow-hidden md:translate-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                3rd Place · Bronze Podium
              </span>
              <div className="w-7 h-7 rounded-full bg-amber-700/20 border border-amber-700/40 flex items-center justify-center font-bold text-amber-600 text-xs">
                3
              </div>
            </div>

            <div className="py-5 text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 text-xl font-display mx-auto">
                {topThree[2].code}
              </div>
              <h3 className="text-base font-bold text-white font-display">{topThree[2].name}</h3>
              <p className="text-3xl font-black text-white font-mono tabular-nums">
                {topThree[2].totalPoints} <span className="text-xs text-slate-400 font-sans font-normal">pts</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-around text-xs text-slate-300">
              <div className="text-center">
                <span className="font-bold text-amber-400 font-mono tabular-nums">{topThree[2].goldMedals}</span>
                <span className="block text-[10px] text-slate-500">Gold</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-slate-300 font-mono tabular-nums">{topThree[2].silverMedals}</span>
                <span className="block text-[10px] text-slate-500">Silver</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-amber-700 font-mono tabular-nums">{topThree[2].bronzeMedals}</span>
                <span className="block text-[10px] text-slate-500">Bronze</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Department Standings Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-display">
            Full Department Rankings Table
          </h3>
          <span className="text-xs text-slate-400">9 Active Branches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 text-center w-14">Rank</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5 text-center">Gold (🥇)</th>
                <th className="px-5 py-3.5 text-center">Silver (🥈)</th>
                <th className="px-5 py-3.5 text-center">Bronze (🥉)</th>
                <th className="px-5 py-3.5 text-right">Played</th>
                <th className="px-5 py-3.5 text-right">Won</th>
                <th className="px-5 py-3.5 text-right">Win Rate</th>
                <th className="px-5 py-3.5 text-right">Athletes</th>
                <th className="px-5 py-3.5 text-right font-bold text-[#00e599]">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {sorted.map((dept, index) => {
                const winRate =
                  dept.matchesPlayed > 0
                    ? Math.round((dept.matchesWon / dept.matchesPlayed) * 100)
                    : 0;

                return (
                  <tr
                    key={dept.id}
                    className={`hover:bg-slate-800/30 transition-colors ${
                      index === 0 ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <td className="px-5 py-4 text-center font-display font-bold text-sm">
                      {index === 0 ? (
                        <span className="text-amber-400">#1</span>
                      ) : index === 1 ? (
                        <span className="text-slate-300">#2</span>
                      ) : index === 2 ? (
                        <span className="text-amber-600">#3</span>
                      ) : (
                        <span className="text-slate-500 font-mono">#{index + 1}</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                          style={{
                            backgroundColor: `${dept.color}20`,
                            border: `1px solid ${dept.color}60`,
                            color: dept.color,
                          }}
                        >
                          {dept.code}
                        </span>
                        <div>
                          <span className="font-semibold text-white block text-sm">{dept.name}</span>
                          <span className="text-[11px] text-slate-400">
                            HOD: {dept.hod} · Coord: {dept.coordinator}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center font-mono font-bold text-amber-400 tabular-nums">
                      {dept.goldMedals}
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-slate-300 tabular-nums">
                      {dept.silverMedals}
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-amber-600 tabular-nums">
                      {dept.bronzeMedals}
                    </td>
                    <td className="px-5 py-4 text-right font-mono tabular-nums text-slate-300">
                      {dept.matchesPlayed}
                    </td>
                    <td className="px-5 py-4 text-right font-mono tabular-nums text-emerald-400 font-semibold">
                      {dept.matchesWon}
                    </td>
                    <td className="px-5 py-4 text-right font-mono tabular-nums text-slate-300">
                      {winRate}%
                    </td>
                    <td className="px-5 py-4 text-right font-mono tabular-nums text-slate-400">
                      {dept.studentAthleteCount}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-black text-base text-[#00e599] tabular-nums">
                      {dept.totalPoints}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Points Calculation Rules Explainer */}
      <div className="glass-panel rounded-xl p-5 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-[#00e599] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-200 block uppercase tracking-wider text-[11px]">
            PSCMRCET Sports Arena Scoring Standard:
          </span>
          <p className="leading-relaxed">
            Overall championship points are automatically computed: Each Gold Medal award grants <strong className="text-amber-400">10 points</strong>, Silver Medal grants <strong className="text-slate-200">5 points</strong>, Bronze Medal grants <strong className="text-amber-600">3 points</strong>, and each verified tournament match victory adds <strong className="text-emerald-400">2 points</strong> to the department tally.
          </p>
        </div>
      </div>
    </div>
  );
};
