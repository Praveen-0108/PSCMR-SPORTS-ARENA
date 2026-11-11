import React, { useState } from 'react';
import { User } from '../types/index.ts';
import { Shield, User as UserIcon, LogOut, Menu, X, Trophy } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'fixtures', label: 'Fixtures' },
    { id: 'teams', label: 'Teams' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'gallery', label: 'Gallery' },
    ...(currentUser?.role === 'admin' || currentUser?.role === 'coordinator'
      ? [{ id: 'dashboard', label: 'Dashboard' }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#050b18]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <button
          onClick={() => setCurrentTab('home')}
          className="text-left flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
            <Trophy className="w-5 h-5 text-[#00e599]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-display uppercase">
            PSCMRCET <span className="text-[#00e599]">ARENA</span>
          </span>
        </button>

        {/* Zone 2: 4-6 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#00e599] font-semibold'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00e599] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {currentUser.department} · {currentUser.role}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Portal Login</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#070e20] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                currentTab === item.id
                  ? 'bg-slate-800/80 text-[#00e599]'
                  : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          {!currentUser && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full mt-2 px-3 py-2 text-center text-xs font-semibold text-slate-950 bg-[#00e599] rounded-md"
            >
              Portal Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};
