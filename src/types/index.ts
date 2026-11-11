export type Role = 'admin' | 'coordinator' | 'student';

export type SportCategory =
  | 'Cricket'
  | 'Badminton'
  | 'Football'
  | 'Volleyball'
  | 'Basketball'
  | 'Kabaddi'
  | 'Chess'
  | 'Table Tennis';

export type DepartmentCode =
  | 'CSE'
  | 'ECE'
  | 'EEE'
  | 'CSM'
  | 'CAI'
  | 'AI & DS'
  | 'CSD'
  | 'IoT'
  | 'MBA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: DepartmentCode;
  rollNo?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  code: DepartmentCode;
  name: string;
  hod: string;
  coordinator: string;
  color: string;
  goldMedals: number;
  silverMedals: number;
  bronzeMedals: number;
  totalPoints: number;
  matchesPlayed: number;
  matchesWon: number;
  studentAthleteCount: number;
}

export interface Tournament {
  id: string;
  title: string;
  sport: SportCategory;
  format: 'Knockout' | 'League';
  genderCategory: 'Boys' | 'Girls' | 'Mixed';
  subCategory?: string; // Singles, Doubles, Team 11s, etc.
  participatingDepartments: DepartmentCode[];
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  venue: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  rules: string;
  maxTeams: number;
  currentTeamsCount: number;
  bannerImage?: string;
  winnerDepartment?: DepartmentCode;
  runnerUpDepartment?: DepartmentCode;
}

export interface Team {
  id: string;
  name: string;
  department: DepartmentCode;
  sport: SportCategory;
  genderCategory: 'Boys' | 'Girls' | 'Mixed';
  subCategory?: string;
  tournamentId: string;
  tournamentTitle?: string;
  captain: {
    name: string;
    rollNo: string;
    phone: string;
    email: string;
  };
  logo?: string;
  playerCount: number;
  status: 'Registered' | 'Verified' | 'Eliminated' | 'Champion' | 'Runner-up';
  createdAt: string;
}

export interface Player {
  id: string;
  name: string;
  rollNo: string;
  department: DepartmentCode;
  sport: SportCategory;
  teamId: string;
  teamName?: string;
  gender: 'Male' | 'Female';
  jerseyNo: number;
  role: string;
  avatar?: string;
  stats: {
    matches: number;
    mvpCount: number;
    pointsOrRuns: number;
    goalsOrWickets: number;
  };
}

export interface MatchScoreDetail {
  summary: string;
  statsTeamA?: string; // e.g. "148/6 (20 ov)" or "21, 19, 21"
  statsTeamB?: string; // e.g. "142/8 (20 ov)" or "18, 21, 15"
}

export interface Match {
  id: string;
  tournamentId: string;
  tournamentTitle?: string;
  sport: SportCategory;
  round: string; // e.g. "Quarter-Final 1", "Semi-Final 1", "Grand Final"
  bracketNodeId?: number;
  teamA: {
    id: string;
    name: string;
    department: DepartmentCode;
    score?: string;
    detail?: string;
  };
  teamB: {
    id: string;
    name: string;
    department: DepartmentCode;
    score?: string;
    detail?: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  venue: string;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Postponed';
  winnerId?: string;
  winnerDepartment?: DepartmentCode;
  playerOfTheMatch?: {
    name: string;
    department: DepartmentCode;
    rollNo: string;
    statsSnippet: string;
  };
  nextMatchId?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Tournament' | 'Schedule' | 'Registration' | 'Notice' | 'Urgent';
  author: string;
  date: string;
  pinned: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeams: number;
  totalTournaments: number;
  totalMatches: number;
  upcomingMatchesCount: number;
  completedMatchesCount: number;
  liveMatchesCount: number;
  departmentStats: {
    department: DepartmentCode;
    teams: number;
    points: number;
    gold: number;
    silver: number;
    bronze: number;
  }[];
}
