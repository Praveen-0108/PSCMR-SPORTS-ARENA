import React from 'react';
import { ArrowRight, Trophy, Users, Shield, Calendar, Award } from 'lucide-react';
import { Match } from '../types/index.ts';

interface HeroProps {
  onExploreTournaments: () => void;
  onRegisterTeam: () => void;
  featuredMatch?: Match;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreTournaments,
  onRegisterTeam,
  featuredMatch,
}) => {
  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-slate-800">
      {/* Background Stadium Image with Measured Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_sports_stadium_1794402504660.jpg"
          alt="PSCMRCET Sports Arena Stadium"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-[#050b18]/70 to-[#050b18]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Branding, Tagline, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Institution Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-[#00e599]" />
              <span>PSCMR COLLEGE OF ENGINEERING & TECHNOLOGY · VIJAYAWADA</span>
            </div>

            {/* Tagline & Main Headline */}
            <div className="space-y-2">
              <p className="text-sm font-semibold tracking-widest uppercase text-slate-300">
                ONE COLLEGE · MANY TEAMS · ONE CHAMPION
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display uppercase leading-[1.08] text-balance">
                PLAY. COMPETE. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#00e599]">
                  MAKE HISTORY.
                </span>
              </h1>
            </div>

            {/* Subtext description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              The official centralized sports arena of PSCMRCET. Track live scores, knockout brackets,
              department-wise rosters, and student athlete leaderboards in real time.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreTournaments}
                className="px-6 py-3.5 text-sm font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group whitespace-nowrap cursor-pointer"
              >
                <span>Explore Tournaments</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onRegisterTeam}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Register Your Team</span>
              </button>
            </div>

            {/* Proof metrics row */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-4 gap-4 max-w-lg">
              <div>
                <span className="block text-2xl font-bold text-white font-display tabular-nums">9</span>
                <span className="text-xs text-slate-400">Branches</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white font-display tabular-nums">8</span>
                <span className="text-xs text-slate-400">Sports</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white font-display tabular-nums">500+</span>
                <span className="text-xs text-slate-400">Athletes</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-[#00e599] font-display tabular-nums">1</span>
                <span className="text-xs text-slate-400">Champion Cup</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Live / Highlight Match Spotlight */}
          <div className="lg:col-span-5">
            {featuredMatch ? (
              <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold tracking-wider uppercase">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>{featuredMatch.status === 'Live' ? 'MATCH IN PROGRESS' : 'MATCH SPOTLIGHT'}</span>
                  </div>
                  <span className="text-slate-400">{featuredMatch.sport} · {featuredMatch.round}</span>
                </div>

                <div className="py-6 space-y-5">
                  {/* Team A */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-sm">
                        {featuredMatch.teamA.department}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-base leading-tight">
                          {featuredMatch.teamA.name}
                        </h4>
                        <span className="text-xs text-slate-400">{featuredMatch.teamA.detail || 'First Innings'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-white font-mono tabular-nums">
                        {featuredMatch.teamA.score || '0/0'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                    <div className="h-[1px] bg-slate-800 flex-1" />
                    <span>VS</span>
                    <div className="h-[1px] bg-slate-800 flex-1" />
                  </div>

                  {/* Team B */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm">
                        {featuredMatch.teamB.department}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-base leading-tight">
                          {featuredMatch.teamB.name}
                        </h4>
                        <span className="text-xs text-slate-400">{featuredMatch.teamB.detail || 'Target Chasing'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-white font-mono tabular-nums">
                        {featuredMatch.teamB.score || '0/0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Match Venue & Time */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{featuredMatch.venue}</span>
                  </div>
                  <span className="text-emerald-400 font-medium shrink-0">
                    {featuredMatch.scheduledTime}
                  </span>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-8 border border-slate-700/60 text-center space-y-4">
                <Trophy className="w-12 h-12 text-[#00e599] mx-auto opacity-80" />
                <h3 className="text-lg font-bold text-white font-display">PSCMRCET Annual Sports Fest 2026</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Join the inter-department athletic clash. Badminton, Cricket, Kabaddi, Chess, and Football registrations are now active.
                </p>
                <button
                  onClick={onRegisterTeam}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-[#00e599] rounded-lg hover:bg-[#00c985] transition-colors"
                >
                  Register Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
