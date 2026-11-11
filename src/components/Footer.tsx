import React from 'react';
import { Trophy, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#030712] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Branding & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Trophy className="w-4 h-4 text-[#00e599]" />
              </div>
              <span className="text-base font-bold text-white font-display uppercase tracking-tight">
                PSCMRCET <span className="text-[#00e599]">ARENA</span>
              </span>
            </div>
            <p className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
              "ONE COLLEGE. MANY TEAMS. ONE CHAMPION."
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Centralized athletic tournament portal for student athletes, team managers, and department sports coordinators.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Arena Portal</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#00e599] transition-colors"
                >
                  Home & Live Matches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tournaments')}
                  className="hover:text-[#00e599] transition-colors"
                >
                  Championship Tournaments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('teams')}
                  className="hover:text-[#00e599] transition-colors"
                >
                  Department Teams & Rosters
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('leaderboard')}
                  className="hover:text-[#00e599] transition-colors"
                >
                  Department Leaderboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#00e599] transition-colors"
                >
                  Sports Gallery & Certificates
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Participating Departments */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Engineering Branches</h4>
            <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-400">
              <span>· CSE</span>
              <span>· ECE</span>
              <span>· EEE</span>
              <span>· CSM</span>
              <span>· CAI</span>
              <span>· AI & DS</span>
              <span>· CSD</span>
              <span>· IoT</span>
              <span>· MBA</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-2">
              Annual Inter-Branch Championship running throughout the academic calendar.
            </p>
          </div>

          {/* Column 4: College Contact & Location */}
          <div className="space-y-2 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">College Address</h4>
            <p className="text-slate-300 font-medium leading-relaxed">
              Potti Sriramulu Chalavadi Mallikarjuna Rao College of Engineering & Technology
            </p>
            <div className="flex items-start gap-2 text-slate-400 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>D.No: 7-3-6/1, R.R.Street, Kothapeta, Vijayawada - 520001, A.P.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>+91 866 2498999 / 2498998</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <span>
            © 2026 PSCMR College of Engineering & Technology. Department of Physical Education.
          </span>
          <span className="font-mono text-slate-400">Academic Full Stack Development Project</span>
        </div>
      </div>
    </footer>
  );
};
