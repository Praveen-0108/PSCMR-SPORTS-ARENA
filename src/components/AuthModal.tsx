import React, { useState } from 'react';
import { Role, DepartmentCode } from '../types/index.ts';
import { X, Lock, Mail, User, Shield, Check, Phone, Hash } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (data: any) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLogin,
  onRegister,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [department, setDepartment] = useState<DepartmentCode>('CSE');
  const [rollNo, setRollNo] = useState('');
  const [phone, setPhone] = useState('');

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

  const handleQuickDemo = (demoRole: Role) => {
    setMode('login');
    if (demoRole === 'admin') {
      setEmail('admin@pscmr.ac.in');
      setPassword('admin123');
    } else if (demoRole === 'coordinator') {
      setEmail('coordinator@pscmr.ac.in');
      setPassword('coord123');
    } else {
      setEmail('student@pscmr.ac.in');
      setPassword('student123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        await onRegister({
          name,
          email,
          password,
          role,
          department,
          rollNo: role === 'student' ? rollNo : undefined,
          phone,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b142c] border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4 text-[#00e599]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display uppercase tracking-tight">
                PSCMRCET Sports Portal
              </h3>
              <p className="text-xs text-slate-400">Academic FSD Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg mt-4">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              mode === 'login' ? 'bg-[#00e599] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Portal Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              mode === 'register' ? 'bg-[#00e599] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            New Student / Staff
          </button>
        </div>

        {/* 1-Click Demo Accounts Selector */}
        {mode === 'login' && (
          <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              1-Click Demo Credentials:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-1.5 px-2 text-[11px] font-semibold rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('coordinator')}
                className="py-1.5 px-2 text-[11px] font-semibold rounded-md bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-colors"
              >
                Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="py-1.5 px-2 text-[11px] font-semibold rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                Student
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Student / Faculty Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                  >
                    <option value="student">Student / Player</option>
                    <option value="coordinator">Sports Coordinator</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
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
              </div>

              {role === 'student' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">College Roll No</label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. 22HP1A0542"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+91 98480 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">College Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@pscmr.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                required
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                {loading
                  ? 'Verifying...'
                  : mode === 'login'
                  ? 'Sign In to Arena Portal'
                  : 'Register Account'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
