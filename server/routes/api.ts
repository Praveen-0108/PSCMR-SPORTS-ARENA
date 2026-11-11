import { Router, Request, Response } from 'express';
import { db } from '../store.ts';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// ==================== DEPARTMENTS ====================
router.get('/departments', (_req: Request, res: Response): void => {
  res.json(db.getDepartments());
});

router.get('/departments/:code', (req: Request, res: Response): void => {
  const dept = db.getDepartmentByCode(req.params.code);
  if (!dept) {
    res.status(404).json({ message: 'Department not found' });
    return;
  }
  res.json(dept);
});

// ==================== TOURNAMENTS ====================
router.get('/tournaments', (_req: Request, res: Response): void => {
  res.json(db.getTournaments());
});

router.get('/tournaments/:id', (req: Request, res: Response): void => {
  const tournament = db.getTournamentById(req.params.id);
  if (!tournament) {
    res.status(404).json({ message: 'Tournament not found' });
    return;
  }
  res.json(tournament);
});

router.post('/tournaments', verifyToken, requireRole(['admin', 'coordinator']), (req: AuthRequest, res: Response): void => {
  try {
    const {
      title,
      sport,
      format,
      genderCategory,
      subCategory,
      participatingDepartments,
      startDate,
      endDate,
      registrationDeadline,
      venue,
      rules,
      maxTeams,
      status,
      bannerImage,
    } = req.body;

    if (!title || !sport || !format) {
      res.status(400).json({ message: 'Title, sport, and format are required.' });
      return;
    }

    const created = db.createTournament({
      title,
      sport,
      format,
      genderCategory: genderCategory || 'Boys',
      subCategory: subCategory || 'General',
      participatingDepartments: participatingDepartments || ['CSE', 'ECE', 'CSM', 'AI & DS'],
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      registrationDeadline: registrationDeadline || new Date().toISOString().split('T')[0],
      venue: venue || 'PSCMRCET Main Arena',
      rules: rules || 'Standard university championship athletic rules apply.',
      maxTeams: Number(maxTeams) || 8,
      status: status || 'Upcoming',
      bannerImage,
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tournament' });
  }
});

router.put('/tournaments/:id', verifyToken, requireRole(['admin', 'coordinator']), (req: AuthRequest, res: Response): void => {
  const updated = db.updateTournament(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ message: 'Tournament not found' });
    return;
  }
  res.json(updated);
});

router.delete('/tournaments/:id', verifyToken, requireRole(['admin']), (req: AuthRequest, res: Response): void => {
  const deleted = db.deleteTournament(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Tournament not found' });
    return;
  }
  res.json({ message: 'Tournament deleted successfully' });
});

// Auto-generate fixtures for tournament
router.post('/tournaments/:id/generate-fixtures', verifyToken, requireRole(['admin', 'coordinator']), (req: AuthRequest, res: Response): void => {
  const matches = db.generateTournamentFixtures(req.params.id);
  res.json({ message: `Successfully generated ${matches.length} fixtures`, matches });
});

// ==================== TEAMS ====================
router.get('/teams', (req: Request, res: Response): void => {
  const { tournamentId, department } = req.query as { tournamentId?: string; department?: string };
  res.json(db.getTeams(tournamentId, department));
});

router.get('/teams/:id', (req: Request, res: Response): void => {
  const team = db.getTeamById(req.params.id);
  if (!team) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }
  res.json(team);
});

router.post('/teams', verifyToken, (req: AuthRequest, res: Response): void => {
  try {
    const { name, department, sport, genderCategory, subCategory, tournamentId, tournamentTitle, captain, logo } = req.body;

    if (!name || !department || !sport || !tournamentId || !captain?.name) {
      res.status(400).json({ message: 'Team name, department, sport, tournament, and captain details are required.' });
      return;
    }

    const created = db.createTeam({
      name,
      department,
      sport,
      genderCategory: genderCategory || 'Boys',
      subCategory,
      tournamentId,
      tournamentTitle,
      captain,
      logo,
      playerCount: 1,
      status: 'Registered',
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create team' });
  }
});

router.put('/teams/:id', verifyToken, (req: AuthRequest, res: Response): void => {
  const updated = db.updateTeam(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }
  res.json(updated);
});

router.delete('/teams/:id', verifyToken, requireRole(['admin', 'coordinator']), (req: AuthRequest, res: Response): void => {
  const deleted = db.deleteTeam(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }
  res.json({ message: 'Team deleted successfully' });
});

// ==================== PLAYERS ====================
router.get('/players', (req: Request, res: Response): void => {
  const { teamId, department, sport } = req.query as { teamId?: string; department?: string; sport?: string };
  res.json(db.getPlayers(teamId, department, sport));
});

router.post('/players', verifyToken, (req: AuthRequest, res: Response): void => {
  try {
    const { name, rollNo, department, sport, teamId, teamName, gender, jerseyNo, role } = req.body;

    if (!name || !rollNo || !department || !sport || !teamId) {
      res.status(400).json({ message: 'Name, roll number, department, sport, and teamId are required.' });
      return;
    }

    const created = db.createPlayer({
      name,
      rollNo,
      department,
      sport,
      teamId,
      teamName,
      gender: gender || 'Male',
      jerseyNo: Number(jerseyNo) || 10,
      role: role || 'Player',
      stats: { matches: 0, mvpCount: 0, pointsOrRuns: 0, goalsOrWickets: 0 },
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create player' });
  }
});

router.put('/players/:id', verifyToken, (req: AuthRequest, res: Response): void => {
  const updated = db.updatePlayer(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ message: 'Player not found' });
    return;
  }
  res.json(updated);
});

router.delete('/players/:id', verifyToken, (req: AuthRequest, res: Response): void => {
  const deleted = db.deletePlayer(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Player not found' });
    return;
  }
  res.json({ message: 'Player deleted successfully' });
});

// ==================== MATCHES & SCORES ====================
router.get('/matches', (req: Request, res: Response): void => {
  const { tournamentId, status } = req.query as { tournamentId?: string; status?: string };
  res.json(db.getMatches(tournamentId, status));
});

router.get('/matches/:id', (req: Request, res: Response): void => {
  const match = db.getMatchById(req.params.id);
  if (!match) {
    res.status(404).json({ message: 'Match not found' });
    return;
  }
  res.json(match);
});

router.post('/matches', verifyToken, requireRole(['admin', 'coordinator']), (req: AuthRequest, res: Response): void => {
  try {
    const created = db.createMatch(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Failed to schedule match' });
  }
});

router.put('/matches/:id', verifyToken, requireRole(['admin', 'coordinator']), (req: AuthRequest, res: Response): void => {
  const updated = db.updateMatch(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ message: 'Match not found' });
    return;
  }
  res.json(updated);
});

// Dedicated score update endpoint
router.put('/matches/:id/score', verifyToken, requireRole(['admin', 'coordinator']), (req: AuthRequest, res: Response): void => {
  const { teamAScore, teamADetail, teamBScore, teamBDetail, status, winnerId, winnerDepartment, playerOfTheMatch } = req.body;

  const match = db.getMatchById(req.params.id);
  if (!match) {
    res.status(404).json({ message: 'Match not found' });
    return;
  }

  const updates: any = {
    teamA: {
      ...match.teamA,
      score: teamAScore !== undefined ? teamAScore : match.teamA.score,
      detail: teamADetail !== undefined ? teamADetail : match.teamA.detail,
    },
    teamB: {
      ...match.teamB,
      score: teamBScore !== undefined ? teamBScore : match.teamB.score,
      detail: teamBDetail !== undefined ? teamBDetail : match.teamB.detail,
    },
  };

  if (status) updates.status = status;
  if (winnerId) updates.winnerId = winnerId;
  if (winnerDepartment) updates.winnerDepartment = winnerDepartment;
  if (playerOfTheMatch) updates.playerOfTheMatch = playerOfTheMatch;

  const updated = db.updateMatch(req.params.id, updates);
  res.json({ message: 'Score updated successfully', match: updated });
});

router.delete('/matches/:id', verifyToken, requireRole(['admin', 'coordinator']), (req: AuthRequest, res: Response): void => {
  const deleted = db.deleteMatch(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Match not found' });
    return;
  }
  res.json({ message: 'Match deleted successfully' });
});

// ==================== LEADERBOARD ====================
router.get('/leaderboard', (_req: Request, res: Response): void => {
  res.json(db.getDepartments());
});

// ==================== ANNOUNCEMENTS ====================
router.get('/announcements', (_req: Request, res: Response): void => {
  res.json(db.getAnnouncements());
});

router.post('/announcements', verifyToken, requireRole(['admin', 'coordinator']), (req: AuthRequest, res: Response): void => {
  try {
    const { title, content, category, author, pinned } = req.body;
    if (!title || !content) {
      res.status(400).json({ message: 'Title and content are required' });
      return;
    }
    const created = db.createAnnouncement({
      title,
      content,
      category: category || 'Notice',
      author: author || req.user?.name || 'Sports Office',
      pinned: Boolean(pinned),
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create announcement' });
  }
});

router.delete('/announcements/:id', verifyToken, requireRole(['admin', 'coordinator']), (req: AuthRequest, res: Response): void => {
  const deleted = db.deleteAnnouncement(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Announcement not found' });
    return;
  }
  res.json({ message: 'Announcement deleted successfully' });
});

// ==================== STATS ====================
router.get('/stats/dashboard', (_req: Request, res: Response): void => {
  res.json(db.getDashboardStats());
});

// Reset to initial academic demo dataset
router.post('/reset-demo', (_req: Request, res: Response): void => {
  db.resetToDemo();
  res.json({ message: 'Database reset to default PSCMRCET demo data.' });
});

export default router;
