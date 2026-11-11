import React, { useState } from 'react';
import { Tournament, DepartmentCode } from '../types/index.ts';
import { Award, FileDown, Camera, CheckCircle, Trophy, Sparkles } from 'lucide-react';
import { downloadCertificatePDF } from '../lib/pdfGenerator.ts';

interface SportsGalleryProps {
  tournaments: Tournament[];
}

export const SportsGallery: React.FC<SportsGalleryProps> = ({ tournaments }) => {
  // Certificate Generator State
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState<DepartmentCode>('CSE');
  const [tournamentTitle, setTournamentTitle] = useState(
    tournaments[0]?.title || 'PSCMRCET Annual T20 Cricket Championship 2026'
  );
  const [sport, setSport] = useState('Cricket');
  const [position, setPosition] = useState<'Winner' | 'Runner-Up' | 'Participation' | 'Player of the Tournament'>('Winner');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  const galleryItems = [
    {
      title: 'PSCMRCET Main Stadium & Floodlit Arena',
      sport: 'Athletics & Multi-Sports',
      desc: 'State-of-the-art campus athletic track and turf ground during the championship finals ceremony.',
      image: '/src/assets/images/hero_sports_stadium_1794402504660.jpg',
      aspect: '16:9',
    },
    {
      title: 'Inter-Department Cricket Tournament Action',
      sport: 'Cricket T20',
      desc: 'Final powerplay over showdown between CSE Cyber Strikers and ECE Electro Titans.',
      image: '/src/assets/images/cricket_tournament_1794402506074.jpg',
      aspect: '4:3',
    },
    {
      title: 'PSCMR Indoor Badminton Arena',
      sport: 'Badminton Championship',
      desc: 'High velocity smash jump shot in the Mens Singles Quarter-Final clash.',
      image: '/src/assets/images/badminton_indoor_1794402506729.jpg',
      aspect: '4:3',
    },
    {
      title: 'PSCMR Premier Inter-Branch Football Clash',
      sport: 'Football 11s',
      desc: 'Midfield ball battle under stadium floodlights during the opening league fixture.',
      image: '/src/assets/images/football_college_1794402507338.jpg',
      aspect: '4:3',
    },
  ];

  const handleDownloadCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !rollNo) return;

    downloadCertificatePDF({
      studentName,
      rollNo,
      department,
      tournamentTitle,
      sport,
      position,
      issueDate: 'November 2026',
    });

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-12">
      {/* Gallery Section */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase mb-1">
            <Camera className="w-3.5 h-3.5 text-[#00e599]" />
            <span>COLLEGE SPORTS ARCHIVES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-tight">
            PSCMRCET Sports Arena Photo Gallery
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Glimpses of collegiate athletic passion, fierce department rivalries, and championship triumphs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.title}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-800 group transition-all hover:border-emerald-500/40 flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.75] group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b142c] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#050b18]/80 backdrop-blur-md text-[#00e599] text-[11px] font-bold uppercase tracking-wider border border-emerald-500/20">
                  {item.sport}
                </span>
              </div>

              <div className="p-5 space-y-1.5">
                <h3 className="text-base font-bold text-white font-display">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Certificate Generator Tool */}
      <div className="glass-panel rounded-2xl p-6 lg:p-8 border-2 border-emerald-500/30 bg-gradient-to-br from-[#0b142c] via-[#050b18] to-[#0b142c] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display uppercase tracking-tight">
                Official Tournament Merit Certificate Generator
              </h3>
              <p className="text-xs text-slate-400">
                Instant digital issuance with official PSCMRCET Principal and Physical Director seal
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold rounded-lg">
            Printable High-Res PDF
          </span>
        </div>

        <form onSubmit={handleDownloadCertificate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student Full Name</label>
              <input
                type="text"
                placeholder="e.g. V. Sai Tharun"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Roll Number</label>
              <input
                type="text"
                placeholder="22HP1A0542"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                required
              />
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tournament Title</label>
              <select
                value={tournamentTitle}
                onChange={(e) => {
                  setTournamentTitle(e.target.value);
                  const found = tournaments.find((t) => t.title === e.target.value);
                  if (found) setSport(found.sport);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sport Discipline</label>
              <input
                type="text"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Award / Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#00e599]"
              >
                <option value="Winner">Winner (Gold Medalist)</option>
                <option value="Runner-Up">Runner-Up (Silver Medalist)</option>
                <option value="Player of the Tournament">Player of the Tournament (MVP)</option>
                <option value="Participation">Official Certificate of Participation</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Certificates are verified by PSCMRCET Sports Council and include document authentication number.
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-[#00e599] hover:bg-[#00c985] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer whitespace-nowrap"
            >
              <FileDown className="w-4 h-4" />
              <span>Generate & Download Certificate (PDF)</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Official Certificate generated and downloaded successfully!</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
