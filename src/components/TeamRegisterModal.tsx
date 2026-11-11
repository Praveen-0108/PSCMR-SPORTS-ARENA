import React, { useState } from 'react';
import { Tournament, DepartmentCode, SportCategory } from '../types/index.ts';
import { X, Check, Users } from 'lucide-react';

interface TeamRegisterModalProps {
  tournaments: Tournament[];
  defaultTournament?: Tournament | null;
  onClose: () => void;
  onSubmit: (teamData: any) => Promise<void>;
}

export const TeamRegisterModal: React.FC<TeamRegisterModalProps> = ({
  tournaments,
  defaultTournament,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<DepartmentCode>('CSE');
  const [tournamentId, setTournamentId] = useState(defaultTournament ? defaultTournament.id : tournaments[0]?.id || '');
  const [genderCategory, setGenderCategory] = useState<'Boys' | 'Girls' | 'Mixed'>('Boys');
  const [subCategory, setSubCategory] = useState('Standard Team');

  // Captain Details
  const [captainName, setCaptainName] = useState('');
  const [captainRollNo, setCaptainRollNo] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const selectedTournament = tournaments.find((t) => t.id === tournamentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !captainName || !captainRollNo) {
      setError('Please provide team name, captain name, and captain roll number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        name,
        department,
        sport: selectedTournament?.sport || 'Cricket',
        genderCategory,
        subCategory,
        tournamentId,
        tournamentTitle: selectedTournament?.title || 'Inter-Department Tournament',
        captain: {
          name: captainName,
          rollNo: captainRollNo,
          phone: captainPhone || '+91 98480 12345',
          email: captainEmail || `${captainRollNo.toLowerCase()}@pscmr.ac.in`,
        },
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b142c] border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4 text-[#00e599]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display uppercase tracking-tight">
                Register Department Team
              </h3>
              <p className="text-xs text-slate-400">PSCMRCET Sports Arena Squad Entry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Tournament Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Select Tournament
            </label>
            <select
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.sport} · {t.genderCategory})
                </option>
              ))}
            </select>
          </div>

          {/* Department & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentCode)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Gender Category
              </label>
              <select
                value={genderCategory}
                onChange={(e) => setGenderCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              >
                <option value="Boys">Boys Squad</option>
                <option value="Girls">Girls Squad</option>
                <option value="Mixed">Mixed Squad</option>
              </select>
            </div>
          </div>

          {/* Team Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Official Team Name
            </label>
            <input
              type="text"
              placeholder="e.g. CSE Cyber Strikers or ECE Electro Titans"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              required
            />
          </div>

          {/* Badminton Subcategory (if Badminton) */}
          {selectedTournament?.sport === 'Badminton' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Badminton Category Type
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              >
                <option value="Singles">Singles</option>
                <option value="Doubles">Doubles</option>
                <option value="Mixed Doubles">Mixed Doubles</option>
              </select>
            </div>
          )}

          {/* Captain Details Section */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Team Captain Details
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Captain Name</label>
                <input
                  type="text"
                  placeholder="Full Student Name"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. 22HP1A0542"
                  value={captainRollNo}
                  onChange={(e) => setCaptainRollNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98480 12345"
                  value={captainPhone}
                  onChange={(e) => setCaptainPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">College Email</label>
                <input
                  type="email"
                  placeholder="captain@pscmr.ac.in"
                  value={captainEmail}
                  onChange={(e) => setCaptainEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Registering...' : 'Confirm Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
