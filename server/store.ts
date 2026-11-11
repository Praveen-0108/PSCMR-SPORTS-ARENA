import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  Department,
  Tournament,
  Team,
  Player,
  Match,
  Announcement,
  User,
  DashboardStats,
  DepartmentCode,
} from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'sports_arena_db.json');

export interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  departments: Department[];
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  announcements: Announcement[];
}

const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-cse',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hod: 'Dr. K. Srinivas Rao',
    coordinator: 'Prof. M. Ramesh',
    color: '#3B82F6',
    goldMedals: 4,
    silverMedals: 2,
    bronzeMedals: 1,
    totalPoints: 57,
    matchesPlayed: 14,
    matchesWon: 11,
    studentAthleteCount: 68,
  },
  {
    id: 'dept-ece',
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    hod: 'Dr. A. Sudhakar',
    coordinator: 'Prof. P. Ravi Teja',
    color: '#10B981',
    goldMedals: 3,
    silverMedals: 3,
    bronzeMedals: 2,
    totalPoints: 51,
    matchesPlayed: 15,
    matchesWon: 10,
    studentAthleteCount: 56,
  },
  {
    id: 'dept-csm',
    code: 'CSM',
    name: 'CSE (Artificial Intelligence & Machine Learning)',
    hod: 'Dr. B. Prasad',
    coordinator: 'Prof. T. Suresh',
    color: '#8B5CF6',
    goldMedals: 2,
    silverMedals: 4,
    bronzeMedals: 1,
    totalPoints: 43,
    matchesPlayed: 12,
    matchesWon: 8,
    studentAthleteCount: 45,
  },
  {
    id: 'dept-aids',
    code: 'AI & DS',
    name: 'Artificial Intelligence & Data Science',
    hod: 'Dr. V. Lakshmi',
    coordinator: 'Prof. G. Venkat',
    color: '#06B6D4',
    goldMedals: 2,
    silverMedals: 1,
    bronzeMedals: 3,
    totalPoints: 34,
    matchesPlayed: 11,
    matchesWon: 6,
    studentAthleteCount: 42,
  },
  {
    id: 'dept-cai',
    code: 'CAI',
    name: 'CSE (Computer Science & Artificial Intelligence)',
    hod: 'Dr. N. Chandrasekhar',
    coordinator: 'Prof. K. Satish',
    color: '#F59E0B',
    goldMedals: 1,
    silverMedals: 2,
    bronzeMedals: 2,
    totalPoints: 26,
    matchesPlayed: 10,
    matchesWon: 5,
    studentAthleteCount: 38,
  },
  {
    id: 'dept-eee',
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    hod: 'Dr. Ch. Mohan',
    coordinator: 'Prof. S. Nagaraju',
    color: '#EC4899',
    goldMedals: 1,
    silverMedals: 1,
    bronzeMedals: 3,
    totalPoints: 24,
    matchesPlayed: 9,
    matchesWon: 4,
    studentAthleteCount: 34,
  },
  {
    id: 'dept-csd',
    code: 'CSD',
    name: 'CSE (Data Science)',
    hod: 'Dr. S. Bhavani',
    coordinator: 'Prof. J. Kiran',
    color: '#14B8A6',
    goldMedals: 1,
    silverMedals: 1,
    bronzeMedals: 1,
    totalPoints: 18,
    matchesPlayed: 8,
    matchesWon: 3,
    studentAthleteCount: 32,
  },
  {
    id: 'dept-iot',
    code: 'IoT',
    name: 'Internet of Things',
    hod: 'Dr. M. Sridhar',
    coordinator: 'Prof. Y. Krishna',
    color: '#6366F1',
    goldMedals: 0,
    silverMedals: 1,
    bronzeMedals: 2,
    totalPoints: 11,
    matchesPlayed: 7,
    matchesWon: 2,
    studentAthleteCount: 28,
  },
  {
    id: 'dept-mba',
    code: 'MBA',
    name: 'Master of Business Administration',
    hod: 'Dr. R. Vijay Kumar',
    coordinator: 'Prof. D. Anusha',
    color: '#E11D48',
    goldMedals: 0,
    silverMedals: 0,
    bronzeMedals: 2,
    totalPoints: 6,
    matchesPlayed: 6,
    matchesWon: 1,
    studentAthleteCount: 24,
  },
];

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tour-001',
    title: 'PSCMRCET Annual T20 Cricket Championship 2026',
    sport: 'Cricket',
    format: 'Knockout',
    genderCategory: 'Boys',
    subCategory: 'T20 Knockout (11s)',
    participatingDepartments: ['CSE', 'ECE', 'CSM', 'AI & DS', 'CAI', 'EEE', 'CSD', 'IoT'],
    startDate: '2026-11-15',
    endDate: '2026-11-24',
    registrationDeadline: '2026-11-13',
    venue: 'PSCMRCET Main Stadium & Ground 1',
    status: 'Ongoing',
    rules: '20 overs a side, standard ICC collegiate rules with powerplay. Spikes allowed on turf. 15-man registered squad required.',
    maxTeams: 8,
    currentTeamsCount: 8,
    bannerImage: '/src/assets/images/cricket_tournament_1794402506074.jpg',
  },
  {
    id: 'tour-002',
    title: 'Vijayawada Collegiate Badminton Championship',
    sport: 'Badminton',
    format: 'Knockout',
    genderCategory: 'Mixed',
    subCategory: 'Singles, Doubles & Mixed',
    participatingDepartments: ['CSE', 'ECE', 'CSM', 'AI & DS', 'CAI', 'EEE', 'MBA', 'IoT'],
    startDate: '2026-11-18',
    endDate: '2026-11-21',
    registrationDeadline: '2026-11-16',
    venue: 'PSCMR Indoor Sports Complex Court 1 & 2',
    status: 'Ongoing',
    rules: 'Best of 3 sets to 21 points (BWF rules). Yonex Aerosensa 30 feather shuttlecocks used.',
    maxTeams: 16,
    currentTeamsCount: 12,
    bannerImage: '/src/assets/images/badminton_indoor_1794402506729.jpg',
  },
  {
    id: 'tour-003',
    title: 'PSCMR Premier Inter-Branch Football League',
    sport: 'Football',
    format: 'League',
    genderCategory: 'Boys',
    subCategory: '11-a-side Full Pitch',
    participatingDepartments: ['CSE', 'ECE', 'CSM', 'AI & DS', 'EEE', 'CAI'],
    startDate: '2026-11-25',
    endDate: '2026-12-05',
    registrationDeadline: '2026-11-22',
    venue: 'PSCMRCET Athletic Arena Football Field',
    status: 'Upcoming',
    rules: 'FIFA standard 90 min (45+45). 3 points for win, 1 point for draw. 5 substitutions allowed.',
    maxTeams: 8,
    currentTeamsCount: 6,
    bannerImage: '/src/assets/images/football_college_1794402507338.jpg',
  },
  {
    id: 'tour-004',
    title: 'Krishna District Inter-College Kabaddi Cup',
    sport: 'Kabaddi',
    format: 'Knockout',
    genderCategory: 'Boys',
    subCategory: '7-a-side Pro Kabaddi Rules',
    participatingDepartments: ['CSE', 'ECE', 'EEE', 'CSM', 'MBA', 'CSD'],
    startDate: '2026-10-10',
    endDate: '2026-10-14',
    registrationDeadline: '2026-10-07',
    venue: 'PSCMRCET Outdoor Kabaddi Clay Court',
    status: 'Completed',
    rules: '20-minute halves, bonus line active, super tackle 2 points.',
    maxTeams: 8,
    currentTeamsCount: 8,
    winnerDepartment: 'CSE',
    runnerUpDepartment: 'ECE',
    bannerImage: '/src/assets/images/hero_sports_stadium_1794402504660.jpg',
  },
  {
    id: 'tour-005',
    title: 'PSCMRCET Inter-Branch Chess Open 2026',
    sport: 'Chess',
    format: 'League',
    genderCategory: 'Mixed',
    subCategory: 'Rapid 15min + 10s increment',
    participatingDepartments: ['CSE', 'ECE', 'CSM', 'AI & DS', 'CAI', 'CSD', 'IoT', 'MBA'],
    startDate: '2026-11-28',
    endDate: '2026-11-30',
    registrationDeadline: '2026-11-26',
    venue: 'Seminar Hall 2 & Student Activity Center',
    status: 'Upcoming',
    rules: 'FIDE standard swiss system tournament, 5 rounds total.',
    maxTeams: 16,
    currentTeamsCount: 14,
  },
  {
    id: 'tour-006',
    title: 'PSCMR Volleyball Super League (Boys & Girls)',
    sport: 'Volleyball',
    format: 'Knockout',
    genderCategory: 'Girls',
    subCategory: '6-a-side Court Rules',
    participatingDepartments: ['CSE', 'ECE', 'CSM', 'AI & DS'],
    startDate: '2026-12-02',
    endDate: '2026-12-06',
    registrationDeadline: '2026-11-30',
    venue: 'PSCMRCET Volleyball Floodlit Court',
    status: 'Upcoming',
    rules: 'Best of 5 sets, 25 points each set, deciding 5th set 15 points.',
    maxTeams: 8,
    currentTeamsCount: 4,
  },
];

const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-cse-cric',
    name: 'CSE Cyber Strikers',
    department: 'CSE',
    sport: 'Cricket',
    genderCategory: 'Boys',
    subCategory: 'T20 Knockout (11s)',
    tournamentId: 'tour-001',
    tournamentTitle: 'PSCMRCET Annual T20 Cricket Championship 2026',
    captain: {
      name: 'V. Sai Tharun',
      rollNo: '22HP1A0542',
      phone: '+91 98480 22334',
      email: 'saitharun.cse@pscmr.ac.in',
    },
    playerCount: 15,
    status: 'Verified',
    createdAt: '2026-11-01',
  },
  {
    id: 'team-ece-cric',
    name: 'ECE Electro Titans',
    department: 'ECE',
    sport: 'Cricket',
    genderCategory: 'Boys',
    subCategory: 'T20 Knockout (11s)',
    tournamentId: 'tour-001',
    tournamentTitle: 'PSCMRCET Annual T20 Cricket Championship 2026',
    captain: {
      name: 'K. Naga Teja',
      rollNo: '22HP1A0418',
      phone: '+91 94401 55678',
      email: 'nagateja.ece@pscmr.ac.in',
    },
    playerCount: 15,
    status: 'Verified',
    createdAt: '2026-11-02',
  },
  {
    id: 'team-csm-cric',
    name: 'CSM AI Rangers',
    department: 'CSM',
    sport: 'Cricket',
    genderCategory: 'Boys',
    subCategory: 'T20 Knockout (11s)',
    tournamentId: 'tour-001',
    tournamentTitle: 'PSCMRCET Annual T20 Cricket Championship 2026',
    captain: {
      name: 'B. Harsha Vardhan',
      rollNo: '22HP1A4209',
      phone: '+91 91211 44556',
      email: 'harsha.csm@pscmr.ac.in',
    },
    playerCount: 15,
    status: 'Verified',
    createdAt: '2026-11-03',
  },
  {
    id: 'team-aids-cric',
    name: 'AI&DS Data Wizards',
    department: 'AI & DS',
    sport: 'Cricket',
    genderCategory: 'Boys',
    subCategory: 'T20 Knockout (11s)',
    tournamentId: 'tour-001',
    tournamentTitle: 'PSCMRCET Annual T20 Cricket Championship 2026',
    captain: {
      name: 'M. Pavan Kalyan',
      rollNo: '22HP1A5432',
      phone: '+91 98660 77889',
      email: 'pavan.aids@pscmr.ac.in',
    },
    playerCount: 14,
    status: 'Verified',
    createdAt: '2026-11-04',
  },
  {
    id: 'team-cse-badm',
    name: 'CSE Smashers',
    department: 'CSE',
    sport: 'Badminton',
    genderCategory: 'Mixed',
    subCategory: 'Singles, Doubles & Mixed',
    tournamentId: 'tour-002',
    tournamentTitle: 'Vijayawada Collegiate Badminton Championship',
    captain: {
      name: 'P. Ananya',
      rollNo: '23HP1A0512',
      phone: '+91 97003 12456',
      email: 'ananya.cse@pscmr.ac.in',
    },
    playerCount: 6,
    status: 'Verified',
    createdAt: '2026-11-05',
  },
  {
    id: 'team-ece-badm',
    name: 'ECE Shuttle Aces',
    department: 'ECE',
    sport: 'Badminton',
    genderCategory: 'Mixed',
    subCategory: 'Singles, Doubles & Mixed',
    tournamentId: 'tour-002',
    tournamentTitle: 'Vijayawada Collegiate Badminton Championship',
    captain: {
      name: 'Ch. Akhil Kumar',
      rollNo: '23HP1A0445',
      phone: '+91 99890 33441',
      email: 'akhil.ece@pscmr.ac.in',
    },
    playerCount: 6,
    status: 'Verified',
    createdAt: '2026-11-06',
  },
  {
    id: 'team-cse-foot',
    name: 'CSE Red Dragons',
    department: 'CSE',
    sport: 'Football',
    genderCategory: 'Boys',
    subCategory: '11-a-side Full Pitch',
    tournamentId: 'tour-003',
    tournamentTitle: 'PSCMR Premier Inter-Branch Football League',
    captain: {
      name: 'S. Rohith',
      rollNo: '22HP1A0589',
      phone: '+91 94901 88990',
      email: 'rohith.cse@pscmr.ac.in',
    },
    playerCount: 16,
    status: 'Registered',
    createdAt: '2026-11-08',
  },
  {
    id: 'team-cai-foot',
    name: 'CAI Neural Knights',
    department: 'CAI',
    sport: 'Football',
    genderCategory: 'Boys',
    subCategory: '11-a-side Full Pitch',
    tournamentId: 'tour-003',
    tournamentTitle: 'PSCMR Premier Inter-Branch Football League',
    captain: {
      name: 'D. Karthik',
      rollNo: '22HP1A4302',
      phone: '+91 98492 66778',
      email: 'karthik.cai@pscmr.ac.in',
    },
    playerCount: 15,
    status: 'Registered',
    createdAt: '2026-11-09',
  },
];

const INITIAL_PLAYERS: Player[] = [
  {
    id: 'player-001',
    name: 'V. Sai Tharun',
    rollNo: '22HP1A0542',
    department: 'CSE',
    sport: 'Cricket',
    teamId: 'team-cse-cric',
    teamName: 'CSE Cyber Strikers',
    gender: 'Male',
    jerseyNo: 7,
    role: 'Captain & All-Rounder',
    stats: { matches: 12, mvpCount: 4, pointsOrRuns: 348, goalsOrWickets: 16 },
  },
  {
    id: 'player-002',
    name: 'N. Rajesh Kumar',
    rollNo: '22HP1A0524',
    department: 'CSE',
    sport: 'Cricket',
    teamId: 'team-cse-cric',
    teamName: 'CSE Cyber Strikers',
    gender: 'Male',
    jerseyNo: 18,
    role: 'Top-order Batsman',
    stats: { matches: 12, mvpCount: 2, pointsOrRuns: 412, goalsOrWickets: 0 },
  },
  {
    id: 'player-003',
    name: 'M. Dinesh',
    rollNo: '22HP1A0561',
    department: 'CSE',
    sport: 'Cricket',
    teamId: 'team-cse-cric',
    teamName: 'CSE Cyber Strikers',
    gender: 'Male',
    jerseyNo: 99,
    role: 'Fast Bowler',
    stats: { matches: 11, mvpCount: 3, pointsOrRuns: 45, goalsOrWickets: 21 },
  },
  {
    id: 'player-004',
    name: 'K. Naga Teja',
    rollNo: '22HP1A0418',
    department: 'ECE',
    sport: 'Cricket',
    teamId: 'team-ece-cric',
    teamName: 'ECE Electro Titans',
    gender: 'Male',
    jerseyNo: 10,
    role: 'Captain & Wicketkeeper',
    stats: { matches: 14, mvpCount: 3, pointsOrRuns: 380, goalsOrWickets: 8 },
  },
  {
    id: 'player-005',
    name: 'G. Suresh Babu',
    rollNo: '22HP1A0433',
    department: 'ECE',
    sport: 'Cricket',
    teamId: 'team-ece-cric',
    teamName: 'ECE Electro Titans',
    gender: 'Male',
    jerseyNo: 24,
    role: 'Off-Spin Bowler',
    stats: { matches: 14, mvpCount: 2, pointsOrRuns: 95, goalsOrWickets: 19 },
  },
  {
    id: 'player-006',
    name: 'P. Ananya',
    rollNo: '23HP1A0512',
    department: 'CSE',
    sport: 'Badminton',
    teamId: 'team-cse-badm',
    teamName: 'CSE Smashers',
    gender: 'Female',
    jerseyNo: 1,
    role: 'Singles Specialist',
    stats: { matches: 9, mvpCount: 5, pointsOrRuns: 275, goalsOrWickets: 0 },
  },
  {
    id: 'player-007',
    name: 'Ch. Akhil Kumar',
    rollNo: '23HP1A0445',
    department: 'ECE',
    sport: 'Badminton',
    teamId: 'team-ece-badm',
    teamName: 'ECE Shuttle Aces',
    gender: 'Male',
    jerseyNo: 3,
    role: 'Doubles Specialist',
    stats: { matches: 8, mvpCount: 2, pointsOrRuns: 210, goalsOrWickets: 0 },
  },
  {
    id: 'player-008',
    name: 'S. Rohith',
    rollNo: '22HP1A0589',
    department: 'CSE',
    sport: 'Football',
    teamId: 'team-cse-foot',
    teamName: 'CSE Red Dragons',
    gender: 'Male',
    jerseyNo: 9,
    role: 'Center Forward',
    stats: { matches: 7, mvpCount: 3, pointsOrRuns: 0, goalsOrWickets: 9 },
  },
];

const INITIAL_MATCHES: Match[] = [
  {
    id: 'match-101',
    tournamentId: 'tour-001',
    tournamentTitle: 'PSCMRCET Annual T20 Cricket Championship 2026',
    sport: 'Cricket',
    round: 'Quarter-Final 1',
    bracketNodeId: 1,
    teamA: {
      id: 'team-cse-cric',
      name: 'CSE Cyber Strikers',
      department: 'CSE',
      score: '178/5',
      detail: '20.0 ov (RR: 8.90)',
    },
    teamB: {
      id: 'team-aids-cric',
      name: 'AI&DS Data Wizards',
      department: 'AI & DS',
      score: '154/9',
      detail: '20.0 ov (RR: 7.70)',
    },
    scheduledDate: '2026-11-15',
    scheduledTime: '09:30 AM',
    venue: 'PSCMRCET Main Stadium Ground 1',
    status: 'Completed',
    winnerId: 'team-cse-cric',
    winnerDepartment: 'CSE',
    playerOfTheMatch: {
      name: 'V. Sai Tharun',
      department: 'CSE',
      rollNo: '22HP1A0542',
      statsSnippet: '64 runs off 38 balls & 3/24 wickets',
    },
    nextMatchId: 'match-semi-1',
  },
  {
    id: 'match-102',
    tournamentId: 'tour-001',
    tournamentTitle: 'PSCMRCET Annual T20 Cricket Championship 2026',
    sport: 'Cricket',
    round: 'Quarter-Final 2',
    bracketNodeId: 2,
    teamA: {
      id: 'team-ece-cric',
      name: 'ECE Electro Titans',
      department: 'ECE',
      score: '162/6',
      detail: '20.0 ov (RR: 8.10)',
    },
    teamB: {
      id: 'team-csm-cric',
      name: 'CSM AI Rangers',
      department: 'CSM',
      score: '148/8',
      detail: '18.4 ov (Live Target 163)',
    },
    scheduledDate: '2026-11-16',
    scheduledTime: '01:30 PM',
    venue: 'PSCMRCET Main Stadium Ground 1',
    status: 'Live',
    playerOfTheMatch: {
      name: 'K. Naga Teja',
      department: 'ECE',
      rollNo: '22HP1A0418',
      statsSnippet: '52* runs & 2 stumpings',
    },
    nextMatchId: 'match-semi-1',
  },
  {
    id: 'match-103',
    tournamentId: 'tour-001',
    tournamentTitle: 'PSCMRCET Annual T20 Cricket Championship 2026',
    sport: 'Cricket',
    round: 'Semi-Final 1',
    bracketNodeId: 3,
    teamA: {
      id: 'team-cse-cric',
      name: 'CSE Cyber Strikers',
      department: 'CSE',
      score: 'TBD',
    },
    teamB: {
      id: 'team-ece-cric',
      name: 'ECE Electro Titans',
      department: 'ECE',
      score: 'TBD',
    },
    scheduledDate: '2026-11-20',
    scheduledTime: '10:00 AM',
    venue: 'PSCMRCET Main Stadium Pavilion Ground',
    status: 'Scheduled',
    nextMatchId: 'match-final-1',
  },
  {
    id: 'match-201',
    tournamentId: 'tour-002',
    tournamentTitle: 'Vijayawada Collegiate Badminton Championship',
    sport: 'Badminton',
    round: 'Quarter-Final Singles',
    bracketNodeId: 1,
    teamA: {
      id: 'team-cse-badm',
      name: 'CSE Smashers',
      department: 'CSE',
      score: '21-18, 21-16',
      detail: 'Straight sets win (2-0)',
    },
    teamB: {
      id: 'team-ece-badm',
      name: 'ECE Shuttle Aces',
      department: 'ECE',
      score: '18-21, 16-21',
      detail: 'Lost in straight sets',
    },
    scheduledDate: '2026-11-18',
    scheduledTime: '11:00 AM',
    venue: 'PSCMR Indoor Sports Complex Court 1',
    status: 'Completed',
    winnerId: 'team-cse-badm',
    winnerDepartment: 'CSE',
    playerOfTheMatch: {
      name: 'P. Ananya',
      department: 'CSE',
      rollNo: '23HP1A0512',
      statsSnippet: 'Flawless 42 rally points, 14 drop shot winners',
    },
  },
  {
    id: 'match-202',
    tournamentId: 'tour-002',
    tournamentTitle: 'Vijayawada Collegiate Badminton Championship',
    sport: 'Badminton',
    round: 'Doubles Semi-Final',
    bracketNodeId: 2,
    teamA: {
      id: 'team-cse-badm',
      name: 'CSE Smashers',
      department: 'CSE',
      score: '19-21, 21-17, 14-11',
      detail: 'Deciding 3rd set underway',
    },
    teamB: {
      id: 'team-ece-badm',
      name: 'ECE Shuttle Aces',
      department: 'ECE',
      score: '21-19, 17-21, 11-14',
      detail: 'Trailing in set 3',
    },
    scheduledDate: '2026-11-19',
    scheduledTime: '03:00 PM',
    venue: 'PSCMR Indoor Sports Complex Court 2',
    status: 'Live',
  },
  {
    id: 'match-301',
    tournamentId: 'tour-003',
    tournamentTitle: 'PSCMR Premier Inter-Branch Football League',
    sport: 'Football',
    round: 'League Matchday 1',
    teamA: {
      id: 'team-cse-foot',
      name: 'CSE Red Dragons',
      department: 'CSE',
    },
    teamB: {
      id: 'team-cai-foot',
      name: 'CAI Neural Knights',
      department: 'CAI',
    },
    scheduledDate: '2026-11-25',
    scheduledTime: '04:00 PM',
    venue: 'Athletic Arena Football Field',
    status: 'Scheduled',
  },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'PSCMRCET Annual Sports Fest 2026 Official Schedule Released',
    content:
      'The Department of Physical Education proudly announces the fixtures and schedule for Cricket, Badminton, Football, and Kabaddi. All team captains must report to the Physical Director room by 8:30 AM on respective match days.',
    category: 'Tournament',
    author: 'Physical Director, PSCMRCET',
    date: '2026-11-10',
    pinned: true,
  },
  {
    id: 'ann-2',
    title: 'Badminton Championship Draws & Court Assignments',
    content:
      'Badminton fixtures for Singles, Doubles, and Mixed Doubles have been published. Matches commence at 9:00 AM in the Indoor Sports Complex. Non-marking gum rubber shoes are strictly mandatory.',
    category: 'Schedule',
    author: 'Sports Committee Coordinator',
    date: '2026-11-09',
    pinned: true,
  },
  {
    id: 'ann-3',
    title: 'Inter-Branch Football League Team Jersey Verification',
    content:
      'All registered department football teams must complete jersey color approval with the Physical Education staff by Friday afternoon to avoid clash during weekend matches.',
    category: 'Notice',
    author: 'Sports Secretary',
    date: '2026-11-08',
    pinned: false,
  },
  {
    id: 'ann-4',
    title: 'Inter-College Chess Open Registration Deadline Extended',
    content:
      'Due to high demand from 1st and 2nd year students, the online registration portal for PSCMRCET Rapid Chess Championship will remain open until November 26th, 5:00 PM.',
    category: 'Registration',
    author: 'Chess Club Convenor',
    date: '2026-11-06',
    pinned: false,
  },
];

class MemoryStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not load existing db file, initializing seed data:', e);
    }
    return this.seedData();
  }

  private seedData(): DatabaseSchema {
    const defaultPasswordHash = bcrypt.hashSync('admin123', 10);
    const coordPasswordHash = bcrypt.hashSync('coord123', 10);
    const studentPasswordHash = bcrypt.hashSync('student123', 10);

    const initialUsers: (User & { passwordHash: string })[] = [
      {
        id: 'usr-admin',
        name: 'Dr. G. Ravi Kiran',
        email: 'admin@pscmr.ac.in',
        passwordHash: defaultPasswordHash,
        role: 'admin',
        department: 'CSE',
        phone: '+91 866 2498999',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminRavi',
        createdAt: '2026-01-01',
      },
      {
        id: 'usr-coord',
        name: 'Prof. P. Satyanarayana',
        email: 'coordinator@pscmr.ac.in',
        passwordHash: coordPasswordHash,
        role: 'coordinator',
        department: 'ECE',
        phone: '+91 98480 11223',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CoordSatya',
        createdAt: '2026-01-05',
      },
      {
        id: 'usr-student',
        name: 'V. Sai Tharun',
        email: 'student@pscmr.ac.in',
        passwordHash: studentPasswordHash,
        role: 'student',
        department: 'CSE',
        rollNo: '22HP1A0542',
        phone: '+91 98480 22334',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SaiTharun',
        createdAt: '2026-02-10',
      },
    ];

    const seeded: DatabaseSchema = {
      users: initialUsers,
      departments: INITIAL_DEPARTMENTS,
      tournaments: INITIAL_TOURNAMENTS,
      teams: INITIAL_TEAMS,
      players: INITIAL_PLAYERS,
      matches: INITIAL_MATCHES,
      announcements: INITIAL_ANNOUNCEMENTS,
    };

    this.saveData(seeded);
    return seeded;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database file:', e);
    }
  }

  public resetToDemo(): void {
    this.data = this.seedData();
  }

  // --- Users & Auth ---
  public findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  }

  public createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: User['role'];
    department: DepartmentCode;
    rollNo?: string;
    phone?: string;
  }): User {
    const passwordHash = bcrypt.hashSync(userData.password, 10);
    const newUser: User & { passwordHash: string } = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash,
      role: userData.role || 'student',
      department: userData.department,
      rollNo: userData.rollNo,
      phone: userData.phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.data.users.push(newUser);
    this.saveData();

    const { passwordHash: _, ...rest } = newUser;
    return rest;
  }

  // --- Departments ---
  public getDepartments(): Department[] {
    // Sort by totalPoints descending
    return [...this.data.departments].sort((a, b) => b.totalPoints - a.totalPoints);
  }

  public getDepartmentByCode(code: string): Department | undefined {
    return this.data.departments.find((d) => d.code === code);
  }

  public updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const idx = this.data.departments.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.data.departments[idx] = { ...this.data.departments[idx], ...updates };
    this.saveData();
    return this.data.departments[idx];
  }

  // --- Tournaments ---
  public getTournaments(): Tournament[] {
    return this.data.tournaments;
  }

  public getTournamentById(id: string): Tournament | undefined {
    return this.data.tournaments.find((t) => t.id === id);
  }

  public createTournament(tournament: Omit<Tournament, 'id' | 'currentTeamsCount'>): Tournament {
    const newTournament: Tournament = {
      ...tournament,
      id: `tour-${Date.now()}`,
      currentTeamsCount: 0,
    };
    this.data.tournaments.unshift(newTournament);
    this.saveData();
    return newTournament;
  }

  public updateTournament(id: string, updates: Partial<Tournament>): Tournament | null {
    const idx = this.data.tournaments.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.data.tournaments[idx] = { ...this.data.tournaments[idx], ...updates };
    this.saveData();
    return this.data.tournaments[idx];
  }

  public deleteTournament(id: string): boolean {
    const initialLen = this.data.tournaments.length;
    this.data.tournaments = this.data.tournaments.filter((t) => t.id !== id);
    this.data.matches = this.data.matches.filter((m) => m.tournamentId !== id);
    this.data.teams = this.data.teams.filter((tm) => tm.tournamentId !== id);
    this.saveData();
    return this.data.tournaments.length < initialLen;
  }

  // --- Teams ---
  public getTeams(tournamentId?: string, department?: string): Team[] {
    return this.data.teams.filter((t) => {
      if (tournamentId && t.tournamentId !== tournamentId) return false;
      if (department && t.department !== department) return false;
      return true;
    });
  }

  public getTeamById(id: string): Team | undefined {
    return this.data.teams.find((t) => t.id === id);
  }

  public createTeam(teamData: Omit<Team, 'id' | 'createdAt'>): Team {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.data.teams.push(newTeam);

    // Update tournament currentTeamsCount
    const tournament = this.data.tournaments.find((t) => t.id === teamData.tournamentId);
    if (tournament) {
      tournament.currentTeamsCount = (tournament.currentTeamsCount || 0) + 1;
    }

    // Auto-create captain player record if not present
    if (teamData.captain) {
      this.createPlayer({
        name: teamData.captain.name,
        rollNo: teamData.captain.rollNo,
        department: teamData.department,
        sport: teamData.sport,
        teamId: newTeam.id,
        teamName: newTeam.name,
        gender: teamData.genderCategory === 'Girls' ? 'Female' : 'Male',
        jerseyNo: 1,
        role: 'Team Captain',
        stats: { matches: 0, mvpCount: 0, pointsOrRuns: 0, goalsOrWickets: 0 },
      });
    }

    this.saveData();
    return newTeam;
  }

  public updateTeam(id: string, updates: Partial<Team>): Team | null {
    const idx = this.data.teams.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.data.teams[idx] = { ...this.data.teams[idx], ...updates };
    this.saveData();
    return this.data.teams[idx];
  }

  public deleteTeam(id: string): boolean {
    const team = this.data.teams.find((t) => t.id === id);
    if (!team) return false;
    this.data.teams = this.data.teams.filter((t) => t.id !== id);
    this.data.players = this.data.players.filter((p) => p.teamId !== id);

    const tournament = this.data.tournaments.find((t) => t.id === team.tournamentId);
    if (tournament && tournament.currentTeamsCount > 0) {
      tournament.currentTeamsCount -= 1;
    }

    this.saveData();
    return true;
  }

  // --- Players ---
  public getPlayers(teamId?: string, department?: string, sport?: string): Player[] {
    return this.data.players.filter((p) => {
      if (teamId && p.teamId !== teamId) return false;
      if (department && p.department !== department) return false;
      if (sport && p.sport !== sport) return false;
      return true;
    });
  }

  public createPlayer(playerData: Omit<Player, 'id'>): Player {
    const newPlayer: Player = {
      ...playerData,
      id: `player-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(playerData.name)}`,
    };
    this.data.players.push(newPlayer);

    // Update team playerCount
    const team = this.data.teams.find((t) => t.id === playerData.teamId);
    if (team) {
      team.playerCount = (team.playerCount || 0) + 1;
    }

    // Update department athlete count
    const dept = this.data.departments.find((d) => d.code === playerData.department);
    if (dept) {
      dept.studentAthleteCount = (dept.studentAthleteCount || 0) + 1;
    }

    this.saveData();
    return newPlayer;
  }

  public updatePlayer(id: string, updates: Partial<Player>): Player | null {
    const idx = this.data.players.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.players[idx] = { ...this.data.players[idx], ...updates };
    this.saveData();
    return this.data.players[idx];
  }

  public deletePlayer(id: string): boolean {
    const player = this.data.players.find((p) => p.id === id);
    if (!player) return false;
    this.data.players = this.data.players.filter((p) => p.id !== id);

    const team = this.data.teams.find((t) => t.id === player.teamId);
    if (team && team.playerCount > 0) {
      team.playerCount -= 1;
    }

    this.saveData();
    return true;
  }

  // --- Matches & Fixtures ---
  public getMatches(tournamentId?: string, status?: string): Match[] {
    return this.data.matches.filter((m) => {
      if (tournamentId && m.tournamentId !== tournamentId) return false;
      if (status && m.status !== status) return false;
      return true;
    });
  }

  public getMatchById(id: string): Match | undefined {
    return this.data.matches.find((m) => m.id === id);
  }

  public createMatch(matchData: Omit<Match, 'id'>): Match {
    const newMatch: Match = {
      ...matchData,
      id: `match-${Date.now()}`,
    };
    this.data.matches.push(newMatch);
    this.saveData();
    return newMatch;
  }

  public updateMatch(id: string, updates: Partial<Match>): Match | null {
    const idx = this.data.matches.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    const prev = this.data.matches[idx];
    this.data.matches[idx] = { ...prev, ...updates };

    // If match was completed, update department leaderboard stats
    if (updates.status === 'Completed' && updates.winnerDepartment && prev.status !== 'Completed') {
      const winnerDept = this.data.departments.find((d) => d.code === updates.winnerDepartment);
      if (winnerDept) {
        winnerDept.matchesWon += 1;
        winnerDept.matchesPlayed += 1;
        winnerDept.totalPoints += 2; // +2 points for match victory
      }
      const loserDeptCode =
        updates.winnerDepartment === prev.teamA.department
          ? prev.teamB.department
          : prev.teamA.department;
      const loserDept = this.data.departments.find((d) => d.code === loserDeptCode);
      if (loserDept) {
        loserDept.matchesPlayed += 1;
      }
    }

    this.saveData();
    return this.data.matches[idx];
  }

  public deleteMatch(id: string): boolean {
    const initialLen = this.data.matches.length;
    this.data.matches = this.data.matches.filter((m) => m.id !== id);
    this.saveData();
    return this.data.matches.length < initialLen;
  }

  // Auto-generate Knockout Fixtures
  public generateTournamentFixtures(tournamentId: string): Match[] {
    const tournament = this.data.tournaments.find((t) => t.id === tournamentId);
    if (!tournament) return [];

    const teams = this.data.teams.filter((t) => t.tournamentId === tournamentId);
    if (teams.length < 2) return [];

    // Remove existing matches for this tournament to regenerate fresh brackets
    this.data.matches = this.data.matches.filter((m) => m.tournamentId !== tournamentId);

    const generated: Match[] = [];
    const baseDate = new Date(tournament.startDate || Date.now());

    if (tournament.format === 'Knockout') {
      // Create bracket for 4 or 8 teams
      const shuffled = [...teams].sort(() => 0.5 - Math.random());
      const numPairs = Math.floor(shuffled.length / 2);

      for (let i = 0; i < numPairs; i++) {
        const team1 = shuffled[i * 2];
        const team2 = shuffled[i * 2 + 1];
        const matchDate = new Date(baseDate);
        matchDate.setDate(baseDate.getDate() + Math.floor(i / 2));

        const roundName =
          numPairs >= 4
            ? `Quarter-Final ${i + 1}`
            : numPairs === 2
            ? `Semi-Final ${i + 1}`
            : 'Grand Final';

        const match: Match = {
          id: `match-gen-${tournamentId}-${i + 1}`,
          tournamentId,
          tournamentTitle: tournament.title,
          sport: tournament.sport,
          round: roundName,
          bracketNodeId: i + 1,
          teamA: {
            id: team1.id,
            name: team1.name,
            department: team1.department,
          },
          teamB: {
            id: team2.id,
            name: team2.name,
            department: team2.department,
          },
          scheduledDate: matchDate.toISOString().split('T')[0],
          scheduledTime: `${9 + (i % 3) * 2}:30 AM`,
          venue: tournament.venue || 'PSCMRCET Main Stadium',
          status: 'Scheduled',
        };
        generated.push(match);
      }
    } else {
      // Round-robin league fixtures
      let matchCount = 1;
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          const matchDate = new Date(baseDate);
          matchDate.setDate(baseDate.getDate() + Math.floor(matchCount / 2));

          const match: Match = {
            id: `match-gen-${tournamentId}-${matchCount}`,
            tournamentId,
            tournamentTitle: tournament.title,
            sport: tournament.sport,
            round: `Matchday ${Math.ceil(matchCount / 2)}`,
            teamA: {
              id: teams[i].id,
              name: teams[i].name,
              department: teams[i].department,
            },
            teamB: {
              id: teams[j].id,
              name: teams[j].name,
              department: teams[j].department,
            },
            scheduledDate: matchDate.toISOString().split('T')[0],
            scheduledTime: `${10 + (matchCount % 4) * 2}:00 AM`,
            venue: tournament.venue || 'PSCMRCET Arena Grounds',
            status: 'Scheduled',
          };
          generated.push(match);
          matchCount++;
        }
      }
    }

    this.data.matches.push(...generated);
    this.saveData();
    return generated;
  }

  // --- Announcements ---
  public getAnnouncements(): Announcement[] {
    return [...this.data.announcements].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  public createAnnouncement(announcement: Omit<Announcement, 'id' | 'date'>): Announcement {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    this.data.announcements.unshift(newAnn);
    this.saveData();
    return newAnn;
  }

  public deleteAnnouncement(id: string): boolean {
    const len = this.data.announcements.length;
    this.data.announcements = this.data.announcements.filter((a) => a.id !== id);
    this.saveData();
    return this.data.announcements.length < len;
  }

  // --- Dashboard Stats ---
  public getDashboardStats(): DashboardStats {
    const totalStudents = this.data.players.length + 150; // registered pool
    const totalTeams = this.data.teams.length;
    const totalTournaments = this.data.tournaments.length;
    const totalMatches = this.data.matches.length;
    const upcomingMatchesCount = this.data.matches.filter((m) => m.status === 'Scheduled').length;
    const completedMatchesCount = this.data.matches.filter((m) => m.status === 'Completed').length;
    const liveMatchesCount = this.data.matches.filter((m) => m.status === 'Live').length;

    const departmentStats = this.data.departments.map((d) => {
      const teams = this.data.teams.filter((t) => t.department === d.code).length;
      return {
        department: d.code,
        teams,
        points: d.totalPoints,
        gold: d.goldMedals,
        silver: d.silverMedals,
        bronze: d.bronzeMedals,
      };
    });

    return {
      totalStudents,
      totalTeams,
      totalTournaments,
      totalMatches,
      upcomingMatchesCount,
      completedMatchesCount,
      liveMatchesCount,
      departmentStats,
    };
  }
}

export const db = new MemoryStore();
