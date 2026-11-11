import {
  User,
  Department,
  Tournament,
  Team,
  Player,
  Match,
  Announcement,
  DashboardStats,
  Role,
  DepartmentCode,
} from '../types/index.ts';

const TOKEN_KEY = 'pscmrcet_auth_token';
const USER_KEY = 'pscmrcet_user_data';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    async register(data: {
      name: string;
      email: string;
      password: string;
      role: Role;
      department: DepartmentCode;
      rollNo?: string;
      phone?: string;
    }): Promise<{ token: string; user: User }> {
      const res = await request<{ token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
      return res;
    },
    async login(email: string, password: string): Promise<{ token: string; user: User }> {
      const res = await request<{ token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
      return res;
    },
    async getMe(): Promise<{ user: User }> {
      return request<{ user: User }>('/api/auth/me');
    },
    logout() {
      authStorage.clear();
    },
  },

  // Departments
  departments: {
    getAll(): Promise<Department[]> {
      return request<Department[]>('/api/departments');
    },
    getByCode(code: string): Promise<Department> {
      return request<Department>(`/api/departments/${code}`);
    },
  },

  // Tournaments
  tournaments: {
    getAll(): Promise<Tournament[]> {
      return request<Tournament[]>('/api/tournaments');
    },
    getById(id: string): Promise<Tournament> {
      return request<Tournament>(`/api/tournaments/${id}`);
    },
    create(data: Partial<Tournament>): Promise<Tournament> {
      return request<Tournament>('/api/tournaments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id: string, data: Partial<Tournament>): Promise<Tournament> {
      return request<Tournament>(`/api/tournaments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete(id: string): Promise<{ message: string }> {
      return request<{ message: string }>(`/api/tournaments/${id}`, {
        method: 'DELETE',
      });
    },
    generateFixtures(id: string): Promise<{ message: string; matches: Match[] }> {
      return request<{ message: string; matches: Match[] }>(`/api/tournaments/${id}/generate-fixtures`, {
        method: 'POST',
      });
    },
  },

  // Teams
  teams: {
    getAll(params?: { tournamentId?: string; department?: string }): Promise<Team[]> {
      const search = new URLSearchParams();
      if (params?.tournamentId) search.append('tournamentId', params.tournamentId);
      if (params?.department) search.append('department', params.department);
      const q = search.toString();
      return request<Team[]>(`/api/teams${q ? `?${q}` : ''}`);
    },
    getById(id: string): Promise<Team> {
      return request<Team>(`/api/teams/${id}`);
    },
    create(data: Partial<Team>): Promise<Team> {
      return request<Team>('/api/teams', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id: string, data: Partial<Team>): Promise<Team> {
      return request<Team>(`/api/teams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete(id: string): Promise<{ message: string }> {
      return request<{ message: string }>(`/api/teams/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Players
  players: {
    getAll(params?: { teamId?: string; department?: string; sport?: string }): Promise<Player[]> {
      const search = new URLSearchParams();
      if (params?.teamId) search.append('teamId', params.teamId);
      if (params?.department) search.append('department', params.department);
      if (params?.sport) search.append('sport', params.sport);
      const q = search.toString();
      return request<Player[]>(`/api/players${q ? `?${q}` : ''}`);
    },
    create(data: Partial<Player>): Promise<Player> {
      return request<Player>('/api/players', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id: string, data: Partial<Player>): Promise<Player> {
      return request<Player>(`/api/players/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete(id: string): Promise<{ message: string }> {
      return request<{ message: string }>(`/api/players/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Matches & Scores
  matches: {
    getAll(params?: { tournamentId?: string; status?: string }): Promise<Match[]> {
      const search = new URLSearchParams();
      if (params?.tournamentId) search.append('tournamentId', params.tournamentId);
      if (params?.status) search.append('status', params.status);
      const q = search.toString();
      return request<Match[]>(`/api/matches${q ? `?${q}` : ''}`);
    },
    getById(id: string): Promise<Match> {
      return request<Match>(`/api/matches/${id}`);
    },
    create(data: Partial<Match>): Promise<Match> {
      return request<Match>('/api/matches', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id: string, data: Partial<Match>): Promise<Match> {
      return request<Match>(`/api/matches/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    updateScore(id: string, scoreData: {
      teamAScore?: string;
      teamADetail?: string;
      teamBScore?: string;
      teamBDetail?: string;
      status?: Match['status'];
      winnerId?: string;
      winnerDepartment?: DepartmentCode;
      playerOfTheMatch?: Match['playerOfTheMatch'];
    }): Promise<{ message: string; match: Match }> {
      return request<{ message: string; match: Match }>(`/api/matches/${id}/score`, {
        method: 'PUT',
        body: JSON.stringify(scoreData),
      });
    },
    delete(id: string): Promise<{ message: string }> {
      return request<{ message: string }>(`/api/matches/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Leaderboard
  leaderboard: {
    get(): Promise<Department[]> {
      return request<Department[]>('/api/leaderboard');
    },
  },

  // Announcements
  announcements: {
    getAll(): Promise<Announcement[]> {
      return request<Announcement[]>('/api/announcements');
    },
    create(data: Partial<Announcement>): Promise<Announcement> {
      return request<Announcement>('/api/announcements', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    delete(id: string): Promise<{ message: string }> {
      return request<{ message: string }>(`/api/announcements/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Stats
  stats: {
    getDashboard(): Promise<DashboardStats> {
      return request<DashboardStats>('/api/stats/dashboard');
    },
  },

  // Reset
  async resetDemo(): Promise<{ message: string }> {
    return request<{ message: string }>('/api/reset-demo', { method: 'POST' });
  },
};
