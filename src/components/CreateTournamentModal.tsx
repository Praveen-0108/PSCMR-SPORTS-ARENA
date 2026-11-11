import React, { useState } from 'react';
import { DepartmentCode, SportCategory, Tournament } from '../types/index.ts';
import { X, Check, Trophy } from 'lucide-react';

interface CreateTournamentModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<SportCategory>('Cricket');
  const [format, setFormat] = useState<'Knockout' | 'League'>('Knockout');
  const [genderCategory, setGenderCategory] = useState<'Boys' | 'Girls' | 'Mixed'>('Boys');
  const [subCategory, setSubCategory] = useState('');
  const [startDate, setStartDate] = useState('2026-11-20');
  const [endDate, setEndDate] = useState('2026-11-25');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-11-18');
  const [venue, setVenue] = useState('PSCMRCET Main Stadium');
  const [rules, setRules] = useState('Standard university tournament rules apply. College ID cards mandatory.');
  const [maxTeams, setMaxTeams] = useState('8');

  const allDepts: DepartmentCode[] = ['CSE', 'ECE', 'EEE', 'CSM', 'CAI', 'AI & DS', 'CSD', 'IoT', 'MBA'];
  const [selectedDepts, setSelectedDepts] = useState<DepartmentCode[]>([...allDepts]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleToggleDept = (dept: DepartmentCode) => {
    if (selectedDepts.includes(dept)) {
      setSelectedDepts(selectedDepts.filter((d) => d !== dept));
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Tournament title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        title,
        sport,
        format,
        genderCategory,
        subCategory: subCategory || `${sport} Championship`,
        participatingDepartments: selectedDepts,
        startDate,
        endDate,
        registrationDeadline,
        venue,
        rules,
        maxTeams: parseInt(maxTeams, 10) || 8,
        status: 'Upcoming',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b142c] border border-slate-700/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-4 h-4 text-[#00e599]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display uppercase tracking-tight">
                Create New Tournament
              </h3>
              <p className="text-xs text-slate-400">Inter-Department Sports Schedule</p>
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Championship Title</label>
            <input
              type="text"
              placeholder="e.g. PSCMRCET Inter-Branch Basketball Cup 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sport</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value as SportCategory)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              >
                {sportsList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              >
                <option value="Knockout">Knockout</option>
                <option value="League">League / Round-Robin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
              <select
                value={genderCategory}
                onChange={(e) => setGenderCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subcategory / Style</label>
              <input
                type="text"
                placeholder="e.g. Singles, Doubles or T20"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Max Teams</label>
              <input
                type="number"
                value={maxTeams}
                onChange={(e) => setMaxTeams(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Reg Deadline</label>
              <input
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Ground</label>
            <input
              type="text"
              placeholder="e.g. PSCMRCET Indoor Arena Court 1"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              required
            />
          </div>

          {/* Participating Branches */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Participating Departments
            </label>
            <div className="grid grid-cols-3 gap-2">
              {allDepts.map((dept) => {
                const isSelected = selectedDepts.includes(dept);
                return (
                  <button
                    type="button"
                    key={dept}
                    onClick={() => handleToggleDept(dept)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Rules & Regulations</label>
            <textarea
              rows={2}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
            />
          </div>

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
              <span>{loading ? 'Creating...' : 'Create Tournament'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
